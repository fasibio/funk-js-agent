# Funk-js-agent
This is a lib to send Logmessages directly from your Javascript/Node.js Application to a [Funkserver](https://github.com/fasibio/funk-server)




## How to use
You need a running [Funkserver](https://github.com/fasibio/funk-server).

You need to know the Access-Key. 

## Installation

```
npm install funk-agent --save
```

## Integration

Optimal you have a loging lib like winston or something else. 

**IMPORTANT:**

set this Code by Applicationstart: 
```
const {FunkAgent} = require('funk-agent')
const funk_con = new FunkAgent("[ServerURL]","[ACCESSKEY]")
```

And now you can log inside you logging event. 

```
  funk_con.sendSugar({
    attr: {
      container: "Test", // attributesinformation to specify this application
      hostname: "spezial host", // attributesinformation to specify the server

    },
    data: [{ // A free to choose obj. use what you want. 
      message: "high obj", 
      time: new Date(Date.now()),
      request_time: 0.002,
      request_type: "ms",
    }],
    searchindex: "test-js-agent-sugar" //the elasticsearchindex where this information will be saved. 
  })
```

You can choose the function ```sendSugar``` and ```send```

```sendSugar``` is a littlebit slower but easier to use

```send``` is faster but more complex. 

Normally ```sendSugar``` will be fast enough. 


## Good to know

If the application lost the connection to your server. It will automatically try to reconnect. 
You send messages will be add to a queue and sending later. After connection is back. 


## Example Project

Here is a small example Projekt: [funk-js-agent-example](https://github.com/fasibio/funk-js-agent-example)


