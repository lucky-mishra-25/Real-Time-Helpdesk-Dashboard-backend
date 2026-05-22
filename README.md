# SyncDesk Backend

Real-time collaborative helpdesk backend built with Node.js, Express.js, and Socket.io.

## Features

- Real-time ticket locking
- Socket.io synchronization
- Ghost disconnect cleanup
- In-memory lock management using JavaScript Map
- REST APIs for ticket management
- Modular architecture
- Lock ownership validation
- Production-ready structure
- Multi-user collaboration support

---

# Tech Stack

- Node.js
- Express.js
- Socket.io
- JavaScript
- REST API

---

# Folder Structure

```bash
backend/
│
├── controllers/
├── routes/
├── services/
├── socket/
├── data/
├── utils/
├── server.js
└── package.json
```

---

# Installation

## Clone Project

```bash
git clone YOUR_GITHUB_LINK
```

---

## Move To Backend Folder

```bash
cd backend
```

---

## Install Dependencies

```bash
npm install
```

---

# Run Development Server

```bash
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

# API Endpoints

## Get All Tickets

```http
GET /api/tickets
```

---

## Get Ticket By ID

```http
GET /api/tickets/:id
```

---

## Update Ticket

```http
PUT /api/tickets/:id
```

Example Body:

```json
{
  "status": "IN_PROGRESS",
  "assignedTo": "agent-101"
}
```

---

# Socket.io Events

## join_dashboard

```javascript
socket.emit("join_dashboard", {
  userId: "agent-101"
});
```

---

## lock_ticket

```javascript
socket.emit("lock_ticket", {
  ticketId: "TICKET-101",
  userId: "agent-101"
});
```

---

## unlock_ticket

```javascript
socket.emit("unlock_ticket", {
  ticketId: "TICKET-101"
});
```

---

# Real-Time Features

- Live synchronization
- Instant lock updates
- Multi-user collaboration
- Auto unlock on disconnect
- Ownership validation

---

# Ghost Disconnect Cleanup

On socket disconnect:

- Automatically releases all locks
- Broadcasts unlock events
- Prevents stale locks
- Keeps dashboard synchronized

```javascript
socket.on("disconnect", () => {
  const releasedLocks = releaseLocksBySocket(socket.id);

  releasedLocks.forEach((lock) => {
    io.emit("ticket_unlocked", {
      ticketId: lock.ticketId,
      autoReleased: true
    });
  });
});
```

---

# Production Features

- Modular architecture
- Error handling
- Socket cleanup
- Edge case handling
- Scalable folder structure
- REST + WebSocket hybrid architecture

---

# Future Improvements

- MongoDB/PostgreSQL
- Redis distributed locks
- JWT Authentication
- Docker support
- Kubernetes deployment
- CI/CD pipeline
- Role-based access control

---

# Author

Lucky Mishra
