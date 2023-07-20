import * as ws from "ws";

const PORT = 8080;

const server = new ws.WebSocketServer({ port: PORT }, () => {
  console.log(`Server started on port ${PORT}`);
});

const users = new Map<string, ws.WebSocket>();

server.on("connection", function (userSocket, _incomingMessage) {
  const userId = String(Math.random()); // generate a proper has in a real app instead
  users.set(userId, userSocket); // save the user

  userSocket.on("message", function (rawMessage) {
    const message = rawMessage.toString();
    console.log(`Received a new message from client ${userId}: ${message}`);
    console.log("Sending it back.");
    userSocket.send(message);
    console.log("Sending it to everyone.");
    users.forEach(user => {
      user.send(`${userId} says: ${message}`);
    })
  });

  userSocket.on("close", function (code) {
    users.delete(userId); // delete the user
    console.log(`${userId} closed the connection: exit code ${code}`);
  })
})