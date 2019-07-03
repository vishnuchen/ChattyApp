import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';

function generateRandomId() {
  let text = "";
  let possible = "01234567";
  for (let i = 0; i <= 7; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return parseInt(text);
}

class App extends Component {
  constructor (props) {
    super(props);
    
    this.state = {
      currentUser: {name: "Bob"}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [
        {
          username: "Bob",
          content: "Has anyone seen my marbles?",
        },
        {
          username: "Anonymous",
          content: "No, I think you lost them. You lost your marbles Bob. You lost them for good."
        }
      ]
    }
  }

  addNewMessage = newMessageInput => {  
    const oldMessages = this.state.messages;
    const newMessageObject = {
      username : this.state.currentUser.name,
      content : newMessageInput,
      id : generateRandomId()
    };
    const newMessages = [...oldMessages, newMessageObject];
    this.setState({ messages: newMessages });
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
