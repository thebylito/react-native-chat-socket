import React from "react";
import { View, Text, AsyncStorage, Button, Platform } from "react-native";

import { GiftedChat } from "react-native-gifted-chat";
import socket from './socket'


export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      userId: this.props.userId,
      username: this.props.username
    };


    this.socket = socket;

 
    this.onReceivedMessage = this.onReceivedMessage.bind(this);
    this.onSend = this.onSend.bind(this);
    this._storeMessages = this._storeMessages.bind(this);
    this.socket.on("message", this.onReceivedMessage);
  }

  // Event listeners
  /**
   * When the server sends a message to this.
   */
  onReceivedMessage(messages) {
    this._storeMessages(messages);
  }

  /**
   * When a message is sent, send the message to the server
   * and store it in this component's state.
   */
  onSend(messages = []) {
    this.socket.emit("message", messages[0]);
    this._storeMessages(messages);
  }

  // Helper functions
  _storeMessages(messages) {
      console.log(messages)
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages)
      };
    });
  }

  setNome(nome) {
    //alert(nome);
    this.socket.emit('set_username', {nome});
  }

  render() {
    var user = { _id: this.props.userId, name: this.props.username};
    return (
      <View style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 30: 0 }}>
        <GiftedChat
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={user}
        />
      </View>
    );
  }
}
