import React from "react";
import {
  View,
  Text,
  AsyncStorage,
  Button,
  Platform,
  TextInput
} from "react-native";
import SocketIOClient from "socket.io-client";

import socket from "./src/socket";
import Chat from "./src/chat";
const USER_ID = "@UserId";
export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      username: null,
      ativo: false
    };
    this.socket = socket;

    this.socket.on("debug", (debug) => {
      console.log(debug);
    });
  }

  determineUser() {
    const { username } = this.state;
    AsyncStorage.getItem(USER_ID)
      .then((userId) => {
        //console.log(userId);
        // If there isn't a stored userId, then fetch one from the server.
        if (!userId) {
          this.socket.emit("userJoined", { username });
          this.socket.on("userJoined", (user) => {
            AsyncStorage.setItem(
              USER_ID,
              JSON.stringify({
                userId: user.userId,
                username: user.username
              })
            );
            this.setState({
              userId: user.userId,
              username: user.username,
              ativo: true
            });
          });
        } else {
          userId = JSON.parse(userId);
          this.socket.emit("userJoined", {
            userId: userId.userId
          });
          this.socket.on("userJoined", (user) => {
            AsyncStorage.setItem(
              USER_ID,
              JSON.stringify({
                userId: user.userId,
                username: user.username
              })
            );
            this.setState({
              userId: userId.userId,
              username: userId.username,
              ativo: true
            });
          });
        }
      })
      .catch((e) => alert(e));
  }

  render() {
    var user = { _id: this.state.userId || -1 };
    const { userId, username } = this.state;
    return (
      <View
        style={{
          flex: 1,
          paddingTop: Platform.OS === "ios" ? 30 : 0,
          alignContent: "center",
          justifyContent: "center"
        }}
      >
        {(!this.state.ativo && (
          <View>
            <Text>
              UserId: {userId}
              {"\n"}Username: {username}
              {"\n\n\n"}
            </Text>
            <TextInput
              value={this.state.username}
              style={{ borderWidth: 2 }}
              onChangeText={(username) => {
                this.setState({
                  username
                });
              }}
            />
            <Button
              title="Usar esse nome"
              onPress={() => {
                this.determineUser();
              }}
            />
            <Button
              title="Limpar"
              onPress={() => {
                AsyncStorage.removeItem(USER_ID);
              }}
            />
          </View>
        )) || <Chat userId={userId} username={username} />}
      </View>
    );
  }
}
