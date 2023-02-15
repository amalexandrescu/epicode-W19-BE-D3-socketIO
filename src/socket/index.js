export const newConnectionHandler = (newClient) => {
  console.log("NEW CONNECTION:", newClient.id);

  // 1. Emit a "welcome" event to the connected client
  newClient.emit("welcome", { message: `Hello ${newClient.id}` });
};

// 1. When we jump into this page, the socket.io client needs to connect to the server
// 2. If the connection happens successfully, the server will emit an event called "welcome"
// 3. If we want to do something when that event happens we shall LISTEN to that event by using socket.on("welcome")
// 4. Once we are connected we want to submit the username to the server --> we shall EMIT an event called "setUsername" (containing the username itself as payload)
// 5. The server is listening for the "setUsername" event, when that event is fired the server will broadcast that username to whoever is listening for an event called "loggedIn"
// 6. If a client wants to display the list of online users, it should listen for the "loggedIn" event
// 7. In this way the list of online users is updated only during login, but what happens if a new user joins? In this case we are not updating the list
// 8. When a new user joins server emits another event called "updateOnlineUsersList", this is supposed to update the list when somebody joins or leaves. Clients they should listen for the "updateOnlineUsersList" event to update the list when somebody joins or leaves
// 9. When the client sends a message we should trigger a "sendMessage" event
// 10. Server listens for that and then it should broadcast that message to everybody but the sender by emitting an event called "newMessage"
// 11. Anybody who is listening for a "newMessage" event will display that in the chat
