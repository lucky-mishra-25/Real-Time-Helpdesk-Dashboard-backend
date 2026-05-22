const logger = require("../utils/logger");

const {
  lockTicket,
  unlockTicket,
  getAllLocks,
  releaseLocksBySocket
} = require("../services/ticketLockService");

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    logger(`Socket connected: ${socket.id}`);

    /*
      JOIN DASHBOARD EVENT
    */
    socket.on("join_dashboard", (userData) => {
      logger(`${userData.userId} joined dashboard`);

      socket.emit("current_locks", getAllLocks());
    });

    /*
      LOCK TICKET EVENT
    */
    socket.on("lock_ticket", ({ ticketId, userId }) => {
      try {
        if (!ticketId || !userId) {
          return socket.emit("lock_error", {
            message: "ticketId and userId are required"
          });
        }

        const result = lockTicket({
          ticketId,
          socketId: socket.id,
          userId
        });

        if (!result.success) {
          return socket.emit("lock_error", {
            ticketId,
            message: result.message
          });
        }

        logger(`${userId} locked ${ticketId}`);

        /*
          REAL-TIME GLOBAL SYNC
        */
        io.emit("ticket_locked", {
          ticketId,
          userId,
          socketId: socket.id
        });
      } catch (error) {
        console.error(error);
      }
    });

    /*
      UNLOCK TICKET EVENT
    */
    socket.on("unlock_ticket", ({ ticketId }) => {
      try {
        const result = unlockTicket({
          ticketId,
          socketId: socket.id
        });

        if (!result.success) {
          return socket.emit("unlock_error", {
            ticketId,
            message: result.message
          });
        }

        logger(`${socket.id} unlocked ${ticketId}`);

        /*
          REAL-TIME GLOBAL SYNC
        */
        io.emit("ticket_unlocked", {
          ticketId
        });
      } catch (error) {
        console.error(error);
      }
    });

    /*
      MOST IMPORTANT SECTION
      GHOST DISCONNECT CLEANUP

      Automatically release ALL locks
      owned by disconnected socket.id
    */
    socket.on("disconnect", () => {
      logger(`Socket disconnected: ${socket.id}`);

      const releasedLocks = releaseLocksBySocket(socket.id);

      if (releasedLocks.length > 0) {
        releasedLocks.forEach((lock) => {
          logger(`Auto released lock: ${lock.ticketId}`);

          /*
            Broadcast unlock updates to all clients
          */
          io.emit("ticket_unlocked", {
            ticketId: lock.ticketId,
            autoReleased: true
          });
        });
      }
    });
  });
};

module.exports = socketHandler;