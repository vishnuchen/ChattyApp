import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';

const ws = new WebSocket("ws://localhost:3001");
const uuid = require('uuid/v4');

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      currentUser: {}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: []  // messages coming from the server will be stored here as they arrive
    }
  }

  componentDidMount() {
    console.log("componentDidMount <App />");
    console.log("Connected to server");

    ws.onmessage = (event) => {
      console.log(event.data);
    // On receiving a message, add it to the list of messages
      const message = JSON.parse(event.data);
      const oldMessages = this.state.messages;
      const newMessages = [...oldMessages, message];
      this.setState({ messages: newMessages });
    }

    setTimeout(() => {
      console.log("Simulating incoming message");
      // Add a new message to the list of messages in the data store
      const newMessage = {id: 3, username: "Michelle", content: "Hello there!"};
      const messages = this.state.messages.concat(newMessage)
      // Update the state of the app component.
      // Calling setState will trigger a call to render() in App and all child components.
      this.setState({messages: messages})
    }, 3000);
  }

  addNewMessage = (currentUser, newMessageInput) => {  
    const newMessageObject = {
      username : currentUser,
      content : newMessageInput,
      id : uuid()
    };
    const msg = JSON.stringify(newMessageObject);
    ws.send(msg);
  }  

  render() {
    // this.state.currentUser
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
        </nav>
        <MessageList messages = {this.state.messages} />
        <ChatBar currentUser= {this.state.currentUser} addNewMessage={this.addNewMessage} />
      </div>    
    );
  }
}
export default App;
