import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import { Server } from "socket.io";
import { createServer } from "http";
import { newConnectionHandler } from "./socket/index.js";

const expressServer = express();
const port = process.env.PORT || 3001;

//SOCKET.IO

const httpServer = createServer(expressServer);
const io = new Server(httpServer);
// this constructor (Server) is expecting to receive an HTTP-SERVER as parameter not an EXPRESS SERVER!!!

io.on("connection", newConnectionHandler);
// "connection" is NOT a custom event! This is a socket.io event, triggered every time a new client connects!

//MIDDLEWARES
expressServer.use(cors());
expressServer.use(express.json());

//ENDPOINTS

//ERROR HANDLERS

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  httpServer.listen(port, () => {
    console.log(`Port in running on ${port}`);
    console.table(listEndpoints(expressServer));
  });
});
