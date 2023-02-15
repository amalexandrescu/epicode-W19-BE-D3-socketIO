let myOnlineUsers = [];

export const newConnectionHandler = (newClient) => {
  console.log("Your client connection id is", newClient.id);

  // 1. Emit a "welcome" event to the connected client
  //this is number 2 from the list
  newClient.emit("welcome", {
    message: `Hei! Your are client: ${newClient.id}`,
  });

  // 2. Listen to an event emitted by the FE called "setNewUsername", this event is going to contain the username in the payload
  //this is number 5 from the list part.1
  newClient.on("setNewUsername", (payload) => {
    console.log(payload);
    // 2.1 Whenever we receive the username, we keep track of that together with the socket.id
    myOnlineUsers.push({
      username: payload.username,
      socketUserId: newClient.id,
    });
    // console.log(myOnlineUsers);

    // 2.2 Then we have to send the list of online users to the current user that just logged in
    //this is number 5 part 2 from the list
    newClient.emit("loggedInUsers", myOnlineUsers);

    // 2.3 We have also to inform everybody (but not the sender) of the new user which just joined
    //this is number 8 from the list part 1
    newClient.broadcast.emit("updateOnlineUsersList", myOnlineUsers);
  });

  // 3. Listen to "sendNewMessage" event, this is received when an user sends a new message
  //number 10 from the list
  newClient.on("sendNewMessage", (message) => {
    console.log("NEW MESSAGE:", message);
    // 3.1 Whenever we receive that new message we have to propagate that message to everybody but not sender
    newClient.broadcast.emit("newMessage", message);
  });

  // 4. Listen to an event called "disconnect", this is NOT a custom event!! This event happens when an user closes browser/tab
  newClient.on("disconnect", () => {
    // 4.1 Server shall update the list of onlineUsers by removing the one that has disconnected
    myOnlineUsers = myOnlineUsers.filter(
      (user) => user.socketUserId !== newClient.id
    );
    // 4.2 Let's communicate the updated list all the remaining clients
    newClient.broadcast.emit("updateOnlineUsersList", myOnlineUsers);
  });
};

// 1. When we jump into this page, the socket.io client needs to connect to the server
// 2. If the connection happens successfully, the server will emit an event called "welcome"
// 3. If we want to do something when that event happens we shall LISTEN to that event by using socket.on("welcome")
// 4. Once we are connected we want to submit the username to the server --> we shall EMIT an event called "setUsername" (containing the username itself as payload)
// 5. The server is listening for the "setNewUsername" event, when that event is fired the server will broadcast that username to whoever is listening for an event called "loggedInUsers"
// 6. If a client wants to display the list of online users, it should listen for the "loggedIn" event
// 7. In this way the list of online users is updated only during login, but what happens if a new user joins? In this case we are not updating the list
// 8. When a new user joins server emits another event called "updateOnlineUsersList", this is supposed to update the list when somebody joins or leaves. Clients they should listen for the "updateOnlineUsersList" event to update the list when somebody joins or leaves
// 9. When the client sends a message we should trigger a "sendNewMessage" event
// 10. Server listens for that and then it should broadcast that message to everybody but the sender by emitting an event called "newMessage"
// 11. Anybody who is listening for a "newMessage" event will display that in the chat
