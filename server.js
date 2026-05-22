const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const ticketRoutes = require("./routes/ticketRoutes");
const socketHandler = require("./socket/socketHandler");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT"]
  }
});

app.use(cors());
app.use(express.json());

/*
  REST APIs
*/
app.use("/api/tickets", ticketRoutes);

app.get("/", (req, res) => {
  res.send("Helpdesk Backend Running");
});

/*
  Initialize Socket.io
*/
socketHandler(io);

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});