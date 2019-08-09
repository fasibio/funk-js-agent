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
export declare class funkAgent {
    private serverUrl;
    private accessKey;
    private wsCon;
    constructor(serverURL: string, accessKey: string);
    connect: (cb: (obj: ConnectedObj) => void) => void;
}
declare type ConnectedObj = {
    send: (obj: Message[]) => boolean;
};
export {};
