import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';

const ws = new WebSocket("ws://localhost:3001");
const uuid = require('uuid/v4');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: "Anonymous"}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: []  // messages coming from the server will be stored here as they arrive
      usersOnline : 0
    }
  }

  componentDidMount() {
    console.log("componentDidMount <App />");
    ws.onopen = (event) => {
      console.log("Connected to server");
    };

    ws.onmessage = (event) => {
      console.log(event.data);
    // On receiving a message, add it to the list of messages
      const message = JSON.parse(event.data);
      let oldMessages = "";
      const incomingMessages = {};
      let newMessages = [];

      switch(message.type) {
        case "incomingMessage":
        // handle incoming message
          oldMessages = this.state.messages;
          incomingMessages.type = message.type;
          incomingMessages.id = message.id;
          incomingMessages.username = message.username;
          incomingMessages.content = message.content;
          newMessages = [...oldMessages, incomingMessages];
          this.setState({ messages: newMessages});
          break;
        case "incomingNotification":
        // handle incoming notification
          oldMessages = this.state.messages;
          incomingMessages.type = message.type;
          incomingMessages.id = message.id;
          incomingMessages.content = message.content;
          newMessages = [...oldMessages, incomingMessages];
          this.setState({ messages: newMessages });
          break;
        default:
          // show an error in the console if the message type is unknown
          throw new Error("Unknown event type " + message.type);
      }
    }
  }

  addNewMessage = (currentUser, newMessageInput) => {  
    addNewMessage = (currentUser, newMessageInput) => {
      let changedUser = currentUser;
      if (!currentUser) {
        changedUser = "Anonymous";
      }
    const newMessageObject = {
      type: "postMessage",
      username : changedUser,
      content : newMessageInput,
      id : uuid()
    };
    const msg = JSON.stringify(newMessageObject);
    ws.send(msg);
  }  

  changeUser = (newUser) => {
    let changedUser = newUser;
    if (!newUser) {
      changedUser = "Anonymous";
    }

    let currentUser = this.state.currentUser.name
    if(!this.state.currentUser.name) {
      currentUser = "Anonymous";
    }

    const newMessageObject = {
      type: "postNotification",
      username: newUser,
      content: `${currentUser} has changed their name to ${changedUser}`,
    };

    this.setState({currentUser: {name: newUser}}, () => {
      if (newUser !== currentUser) {
        const msg = JSON.stringify(newMessageObject);
        ws.send(msg);        
      }
    })
  }

  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">CHATTERBOX</a>
          <p className="users-online">{this.state.usersOnline} user(s) online</p>
        </nav>
        <MessageList messages = {this.state.messages} />
        <ChatBar addNewMessage={this.addNewMessage} changeUser={this.changeUser} /> 
      </div>    
    );
  }
}
export default App;