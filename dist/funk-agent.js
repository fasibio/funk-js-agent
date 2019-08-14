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
        this.send = (obj, onError) => {
            if (this.wsCon !== undefined) {
                if (this.wsCon.readyState != Websocket.OPEN) {
                    this.wsCon.removeAllListeners("open");
                    this.wsCon.removeAllListeners("close");
                    this.wsCon.terminate();
                    this.wsCon = undefined;
                }
            }
            if (this.wsCon === undefined) {
                this.wsCon = this.getWsConnection();
                this.wsCon.on("error", (e) => {
                    if (onError) {
                        onError(e);
                    }
                });
                this.wsCon.on("open", () => {
                    this.sender(obj);
                });
                this.wsCon.on("close", (e, e2) => {
                    this.addQueueMessage(obj);
                });
            }
            else {
                this.sender(obj);
            }
        };
        this.sendSugar = (obj, onError) => {
            const seralizeData = obj.data.map((one) => {
                return JSON.stringify(one);
            });
            const interalObj = {
                attr: obj.attr,
                data: seralizeData,
                searchindex: obj.searchindex,
                time: new Date(Date.now()),
                type: MessageType.Log,
            };
            const interalObjArray = [interalObj];
            this.send(interalObjArray, onError);
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
    sender(obj) {
        const queue = this.clearQueueMessage();
        this.wsCon.send(JSON.stringify([...obj, ...queue]));
    }
}
exports.FunkAgent = FunkAgent;
