/**
* producer.js
**/
var amqp = require('amqplib/callback_api');
// process.env.CLOUDAMQP_URL = '	amqp://mirjvqap:J2l7YaXcAXwBUqZrLdlRhQ1fSFGik6eo@barnacle.rmq.cloudamqp.com/mirjvqap';

// if the connection is closed or fails to be established at all, we will reconnect
var amqpConn = null;
let Task  = require("./app/task/model")
exports.start = function  () {
    amqp.connect(process.env.CLOUDAMQP_URL + "?heartbeat=60", function (err, conn) {
        if (err) {
            console.error("[AMQP]", err.message);
            return setTimeout(start, 7000);
        }
        conn.on("error", function (err) {
            if (err.message !== "Connection closing") {
                console.error("[AMQP] conn error", err.message);
            }
        });
        conn.on("close", function () {
            console.error("[AMQP] reconnecting");
            return setTimeout(start, 7000);
        });

        console.log("[AMQP] connected");
        amqpConn = conn;

        whenConnected();
    });
}

function whenConnected() {
    startPublisher();
    startWorker();
}

var pubChannel = null;
var offlinePubQueue = [];
function startPublisher() {
    amqpConn.createConfirmChannel(function (err, ch) {
        if (closeOnErr(err)) return;
        ch.on("error", function (err) {
            console.error("[AMQP] channel error", err.message);
        });
        ch.on("close", function () {
            console.log("[AMQP] channel closed");
        });

        pubChannel = ch;
        while (true) {
            var m = offlinePubQueue.shift();
            console.log('M = ', m);
            if (!m) break;
            exports.publish(m[0], m[1], m[2]);
        }
    });
}

// method to publish a message, will queue messages internally if the connection is down and resend later
exports.publish = function (exchange, routingKey, content) {
    try {
        pubChannel.publish(exchange, routingKey, content, { persistent: true },
            function (err, ok) {
                if (err) {
                    console.error("[AMQP] publish", err);
                    offlinePubQueue.push([exchange, routingKey, content]);
                    pubChannel.connection.close();
                }
            });
    } catch (e) {
        console.error("[AMQP] publish", e.message);
        offlinePubQueue.push([exchange, routingKey, content]);
    }
}

// A worker that acks messages only if processed succesfully
function startWorker() {
    amqpConn.createChannel(function (err, ch) {
        if (closeOnErr(err)) return;
        ch.on("error", function (err) {
            console.error("[AMQP] channel error", err.message);
        });
        ch.on("close", function () {
            console.log("[AMQP] channel closed");
        });
        ch.prefetch(10);
        ch.assertQueue("jobs", { durable: true }, function (err, _ok) {
            if (closeOnErr(err)) return;
            ch.consume("jobs", processMsg, { noAck: false });
            console.log("Worker is started");
        });

        function processMsg(msg) {
            var incomingDate = (new Date()).toISOString();
            console.log("Msg [deliveryTag=" + msg.fields.deliveryTag + "] arrived at " + incomingDate);
            work(msg, function (ok) {
                console.log("Sending Ack for msg at time " + incomingDate);
                try {
                    if (ok)
                        ch.ack(msg);
                    else
                        ch.reject(msg, true);
                } catch (e) {
                    closeOnErr(e);
                }
            });
        }
    });
}

function work(msg, cb) {
    let contentList = msg.content.toString().split(",");
    let fact = factorial(new Number(contentList[1]));
    let obj = {
        status:"Completed",
        factorial:fact
    }
    Task.findByIdAndUpdate(contentList[0],obj)
    .then((data)=>{
        console.log("successfully updated data",data)
    })
    .catch((err)=>{console.log("unable to update task",err)})
    console.log("Got msg from producer", contentList[0]);
    setTimeout(() => cb(true), process.env.WORK_WAIT_TIME || 12000);
}

function factorial(n) {
    return n ? n * factorial(n - 1) : 1;
  }
function closeOnErr(err) {
    if (!err) return false;
    console.error("[AMQP] error", err);
    amqpConn.close();
    return true;
}

// setTimeout(function () {
//     publish("", "jobs", new Buffer.from("work work work"));
// }, 3000);


