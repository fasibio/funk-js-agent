import * as Websocket from 'ws'

export enum MessageType{
  Log= "LOG"
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

public clearQueueMessage(): Message[] {
  const res = [...this.queueMessages]
  this.queueMessages = []
  return res
}

public addQueueMessage(msg: Message[]) {
  this.queueMessages = [...this.queueMessages, ...msg]
}

private getWsConnection(): Websocket {
  return new Websocket(this.serverUrl+"/data/subscribe",{
    headers: {
      "funk.connection": this.accessKey,
    }
  }) 
}

connect = (cb: (obj:ConnectedObj) => void) => {
  this.wsCon =  this.getWsConnection()


  this.wsCon.on("open", () => {
    cb({
      send: send(this.wsCon, this),
    })
  })
  this.wsCon.on("close", (e,e2) => {
    setTimeout(() =>{
      this.wsCon.removeAllListeners()
      this.wsCon.removeEventListener("open")
      this.connect(cb)
    } ,3000)
    console.log("close",e, e2)
  })
  this.wsCon.on("error", (e) => {
    console.log("error",e)
  })
}



}

const send = (ws: Websocket, funkAgent:FunkAgent) =>  {
  
  return (obj: Message[]): boolean => {

    const queue = funkAgent.clearQueueMessage()
    ws.send(JSON.stringify([...obj, ...queue]),(e)=> {
      if (e !== undefined){
        console.log("error by send", e )
        funkAgent.addQueueMessage(obj)
      }
    })
    return true
}
}

type ConnectedObj = {
  send: (obj: Message[])=> boolean,
}



