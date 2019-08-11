export declare enum MessageType {
    Log = "LOG"
}
export declare type Message = {
    time: Date;
    data: string[];
    searchindex: string;
    type: MessageType;
    attr: {
        hostname: string;
        container: string;
        service?: string;
        namespace?: string;
        container_id?: string;
    };
};
export declare class FunkAgent {
    private serverUrl;
    private accessKey;
    private wsCon;
    private queueMessages;
    constructor(serverURL: string, accessKey: string);
    clearQueueMessage(): Message[];
    addQueueMessage(msg: Message[]): void;
    private getWsConnection;
    connect: (cb: (obj: ConnectedObj) => void) => void;
}
declare type ConnectedObj = {
    send: (obj: Message[]) => boolean;
};
export {};
