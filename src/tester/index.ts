import {FunkAgent, MessageType} from '../index'


const con = new FunkAgent("ws://127.0.0.1:3000","changeMe04cf242924f6b5f96")

setInterval(() => {
  con.send([{
    attr: {
      container: "test js con",
      container_id: "12344",
      hostname: "localhost",
      namespace:"",
      service: "",
    },
    data:[JSON.stringify({
      level: "warn",
      nana: "bubu",
      message: "Test"
    })],
    searchindex: "test-js-agent",
    time: new Date(Date.now()),
    type: MessageType.Log,
  }])
  con.sendSugar({
    attr: {
      container: "Test",
      hostname: "spezial host",

    },
    data: [{
      message: "high obj",
      time: new Date(Date.now()),
      request_time: 0.002,
      request_type: "ms",
    }],
    searchindex: "test-js-agent-sugar"
  })
}, 3000)



// con.connect((connection) => {
//   setInterval(() => {
//     const ok = connection.send([{
//       attr: {
//         container: "test js con",
//         container_id: "12344",
//         hostname: "localhost",
//         namespace:"",
//         service: "",
//       },
//       data:[JSON.stringify({
//         level: "warn",
//         nana: "bubu",
//         message: "Test"
//       })],
//       searchindex: "test-js-agent",
//       time: new Date(Date.now()),
//       type: MessageType.Log,
//     }])
//     console.log("send data", ok )
//   }, 3000)
// })
