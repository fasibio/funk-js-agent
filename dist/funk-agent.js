"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const websocket_1 = require("websocket");
var MessageType;
(function (MessageType) {
    MessageType["Log"] = "LOG";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
class funkAgent {
    constructor(serverURL, accessKey) {
        this.serverUrl = "";
        this.accessKey = "";
        this.connect = (cb) => {
            this.wsCon = new websocket_1.client();
            this.wsCon.on("connect", (connection) => {
                cb({
                    send: send(connection),
                });
            });
            this.wsCon.on("connectFailed", (e) => {
                console.log(e);
            });
            this.wsCon.connect(this.serverUrl + "/data/subscribe", [], "", {
                "funk.connection": 'changeMe04cf242924f6b5f96',
            });
        };
        this.serverUrl = serverURL;
        this.accessKey = accessKey;
    }
}
exports.funkAgent = funkAgent;
const send = (connection) => (obj) => {
    connection.sendUTF(JSON.stringify(obj));
    connection.on("error", (m) => {
        console.log("error by send data", m);
    });
    return true;
};
