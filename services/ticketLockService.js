/*
  Production-ready Ticket Lock Service

  ticketLocks Map Structure:

  Map {
    ticketId => {
      socketId,
      userId,
      timestamp
    }
  }
*/

const ticketLocks = new Map();

const lockTicket = ({ ticketId, socketId, userId }) => {
  const existingLock = ticketLocks.get(ticketId);

  if (existingLock && existingLock.socketId !== socketId) {
    return {
      success: false,
      message: "Ticket already locked by another user"
    };
  }

  ticketLocks.set(ticketId, {
    socketId,
    userId,
    timestamp: Date.now()
  });

  return {
    success: true,
    lock: ticketLocks.get(ticketId)
  };
};

const unlockTicket = ({ ticketId, socketId }) => {
  const existingLock = ticketLocks.get(ticketId);

  if (!existingLock) {
    return {
      success: false,
      message: "Ticket is not locked"
    };
  }

  // Ownership validation
  if (existingLock.socketId !== socketId) {
    return {
      success: false,
      message: "You do not own this lock"
    };
  }

  ticketLocks.delete(ticketId);

  return {
    success: true
  };
};

const getAllLocks = () => {
  return Array.from(ticketLocks.entries()).map(([ticketId, value]) => ({
    ticketId,
    ...value
  }));
};

/*
  IMPORTANT:
  Ghost disconnect cleanup
  Release all locks owned by disconnected socket
*/
const releaseLocksBySocket = (socketId) => {
  const releasedTickets = [];

  for (const [ticketId, lockData] of ticketLocks.entries()) {
    if (lockData.socketId === socketId) {
      ticketLocks.delete(ticketId);

      releasedTickets.push({
        ticketId,
        userId: lockData.userId
      });
    }
  }

  return releasedTickets;
};

module.exports = {
  ticketLocks,
  lockTicket,
  unlockTicket,
  getAllLocks,
  releaseLocksBySocket
};