import React, {Component} from 'react';

class ChatBar extends Component {
  _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      let newMessageInput = "";
      newMessageInput = e.target.value;
      let currentUser = document.getElementById("username").value;
      this.props.addNewMessage(currentUser, newMessageInput);
      e.target.value = "";
      document.getElementById("username").value = "";
    }
  };
  render() {
    return (
      <footer className="chatbar">
        <input className="chatbar-username" id="username" placeholder="Your Name (Optional)" />                    
        <input className="chatbar-message" onKeyDown={this._handleKeyDown} placeholder="Type a message and hit ENTER" />
      </footer>  
    );
  }
}
export default ChatBar;