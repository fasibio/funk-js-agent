export declare enum MessageType {
    Log = "LOG"
}
export declare type SugarMessage = {
    data: {}[];
    searchindex: string;
    attr: {
        hostname: string;
        container: string;
        service?: string;
        namespace?: string;
        container_id?: string;
    };
};
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
    private clearQueueMessage;
    private addQueueMessage;
    private getWsConnection;
    send: (obj: Message[], onError?: (e: Error) => void) => void;
    sendSugar: (obj: SugarMessage, onError?: (e: Error) => void) => void;
    private sender;
}
