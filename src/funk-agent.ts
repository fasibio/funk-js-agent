import {client as WebSocketClient, connection} from 'websocket'

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

export class funkAgent{
private serverUrl = ""
private accessKey = ""
private wsCon: WebSocketClient
constructor(serverURL: string, accessKey: string){
  this.serverUrl = serverURL
  this.accessKey = accessKey
}


connect = (cb: (obj:ConnectedObj) => void) => {
  this.wsCon = new WebSocketClient()
  this.wsCon.on("connect", (connection) => {
    cb({
      send: send(connection),
    })
  })
  this.wsCon.on("connectFailed", (e) => {
    console.log(e)
  })
  
  this.wsCon.connect(this.serverUrl+"/data/subscribe",[],"",{
    "funk.connection": 'changeMe04cf242924f6b5f96',
  })
}



}

const send = (connection: connection) =>  {
  
  connection.on("error", (m) =>{
    console.log("error by send data", m )
  })
  connection.on("close", (m) => {
    console.log("close by send data", m )
  })
  return (obj: Message[]): boolean => {
  connection.sendUTF(JSON.stringify(obj))
  
  connection.on
  return true
}
}

type ConnectedObj = {
  send: (obj: Message[])=> boolean,
}



