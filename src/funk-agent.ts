import * as Websocket from 'ws'

export enum MessageType{
  Log= "LOG"
}

export type SugarMessage = {
  data: {}[],
  searchindex: string,
  attr: {
    hostname: string,
    container: string, 
    service?: string,
    namespace?: string,
    container_id?: string,
  }
}

export type Message = {
  time: Date,
  data: string[], //marsheld obj
  searchindex: string,
  type: MessageType,
  attr: {
    hostname: string,
    container: string, 
    service?: string,
    namespace?: string,
    container_id?: string,
  }
}

export class FunkAgent{
  private serverUrl = ""
  private accessKey = ""
  private wsCon: Websocket
  private queueMessages : Message[] = []
  constructor(serverURL: string, accessKey: string){
    this.serverUrl = serverURL
    this.accessKey = accessKey
  }

  private clearQueueMessage(): Message[] {
    const res = [...this.queueMessages]
    this.queueMessages = []
    return res
  }

  private addQueueMessage(msg: Message[]) {
    this.queueMessages = [...this.queueMessages, ...msg]
  }

  private getWsConnection(): Websocket {
    return new Websocket(this.serverUrl+"/data/subscribe",{
      headers: {
        "funk.connection": this.accessKey,
      }
    }) 
  }
public send = (obj: Message[], onError?:(e: Error) => void) => {
  if (this.wsCon !== undefined){
    if (this.wsCon.readyState != Websocket.OPEN){
      this.wsCon.removeAllListeners("open")
      this.wsCon.removeAllListeners("close")
      this.wsCon.terminate()
      this.wsCon = undefined
    }
  } 
  if (this.wsCon === undefined){
      this.wsCon =  this.getWsConnection()
      this.wsCon.on("error",(e) => {
        if (onError){
          onError(e)
        }
      })
      this.wsCon.on("open", () => {
        this.sender(obj)
      })
      this.wsCon.on("close", (e,e2) => {
        this.addQueueMessage(obj)
      })
  } else {
    this.sender(obj)
  }
}

  public sendSugar = (obj: SugarMessage, onError?:(e: Error) => void) => {

    const seralizeData: string[] = obj.data.map<string>((one) => {
      return JSON.stringify(one)
    })
    
    const interalObj: Message = {
      attr: obj.attr,
      data: seralizeData,
      searchindex: obj.searchindex,
      time: new Date(Date.now()),
      type: MessageType.Log,     
    }
    const interalObjArray = [interalObj]
    this.send(interalObjArray, onError)
    
  }

  private sender(obj: Message[]){
    const queue = this.clearQueueMessage()
    this.wsCon.send(JSON.stringify([...obj, ...queue]))
  }
}



