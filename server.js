const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const ticketRoutes = require("./routes/ticketRoutes");
const socketHandler = require("./socket/socketHandler");

const app = express();

const server = http.createServer(app);

/*
  EXPRESS CORS
*/
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://real-time-helpdesk-dashboard-fronte.vercel.app"
    ],
    methods: ["GET", "POST", "PUT"],
    credentials: true
  })
);

app.use(express.json());

/*
  SOCKET.IO
*/
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://real-time-helpdesk-dashboard-fronte.vercel.app"
    ],
    methods: ["GET", "POST", "PUT"],
    credentials: true
  },

  transports: ["websocket", "polling"],

  pingTimeout: 60000,
  pingInterval: 25000
});

/*
  ROUTES
*/
app.use("/api/tickets", ticketRoutes);

app.get("/", (req, res) => {
  res.send("SyncDesk Backend Running");
});

/*
  SOCKET HANDLER
*/
socketHandler(io);

/*
  START SERVER
*/
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});