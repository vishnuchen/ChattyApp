const express = require('express');
const WebSocket = require('ws');
const uuid = require('uuid/v4');


const PORT = 3001;


const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  console.log('Client connected');
  

  const newClientNotification = {
    id: uuid(),
    type: "incomingNotification",
    content: "Anonymous user has joined the chat"
  };

  wss.clients.forEach(function each(client) {
    client.send(JSON.stringify(newClientNotification));
  })


  let clientCount = wss.clients.size;
  wss.clients.forEach(function each(client) {
    client.send(clientCount);
  })


  ws.on('message', function incoming(data) {

    let receivedMsg = JSON.parse(data);
    const newMessageObject = {};

    switch(receivedMsg.type) {
      case "postMessage":

        newMessageObject.type = "incomingMessage";
        newMessageObject.id = uuid();
        newMessageObject.username = receivedMsg.username;
        newMessageObject.content = receivedMsg.content;
        break;
      case "postNotification":

        newMessageObject.type = "incomingNotification";
        newMessageObject.id = uuid();
        newMessageObject.username = receivedMsg.username;
        newMessageObject.content = receivedMsg.content;
        break;
      default:

      throw new Error("Unknown event type " + receivedMsg.type);
    };

    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(newMessageObject));
      }
    });

  });

  ws.on('close', () => {
    console.log('Client disconnected')

    // Create notification for user that has left the chat
    const clientLeftNotification = {
      id: uuid(),
      type: "incomingNotification",
      content: "User has left the chat"
    };


    wss.clients.forEach(function each(client) {
      client.send(JSON.stringify(clientLeftNotification));
    })


    let clientCount = wss.clients.size;
    wss.clients.forEach(function each(client) {
      client.send(clientCount);
    })

  });

});
