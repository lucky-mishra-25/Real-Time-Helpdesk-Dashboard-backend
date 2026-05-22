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
    origin: [
      "http://localhost:3000",
      "https://syncdesk.vercel.app"
    ],
    methods: ["GET", "POST", "PUT"]
  }
});

app.use(cors());

app.use(express.json());

app.use("/api/tickets", ticketRoutes);

app.get("/", (req, res) => {
  res.send("SyncDesk Backend Running");
});

socketHandler(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});