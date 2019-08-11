"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Websocket = require("ws");
var MessageType;
(function (MessageType) {
    MessageType["Log"] = "LOG";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
class FunkAgent {
    constructor(serverURL, accessKey) {
        this.serverUrl = "";
        this.accessKey = "";
        this.queueMessages = [];
        this.connect = (cb) => {
            this.wsCon = this.getWsConnection();
            this.wsCon.on("open", () => {
                cb({
                    send: send(this.wsCon, this),
                });
            });
            this.wsCon.on("close", (e, e2) => {
                setTimeout(() => {
                    this.wsCon.removeAllListeners();
                    this.wsCon.removeEventListener("open");
                    this.connect(cb);
                }, 3000);
                console.log("close", e, e2);
            });
            this.wsCon.on("error", (e) => {
                console.log("error", e);
            });
        };
        this.serverUrl = serverURL;
        this.accessKey = accessKey;
    }
    clearQueueMessage() {
        const res = [...this.queueMessages];
        this.queueMessages = [];
        return res;
    }
    addQueueMessage(msg) {
        this.queueMessages = [...this.queueMessages, ...msg];
    }
    getWsConnection() {
        return new Websocket(this.serverUrl + "/data/subscribe", {
            headers: {
                "funk.connection": this.accessKey,
            }
        });
    }
}
exports.FunkAgent = FunkAgent;
const send = (ws, funkAgent) => {
    return (obj) => {
        const queue = funkAgent.clearQueueMessage();
        ws.send(JSON.stringify([...obj, ...queue]), (e) => {
            if (e !== undefined) {
                console.log("error by send", e);
                funkAgent.addQueueMessage(obj);
            }
        });
        return true;
    };
};
