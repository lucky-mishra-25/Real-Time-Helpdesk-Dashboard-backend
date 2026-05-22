const express = require("express");

const {
  getTickets,
  getTicketById,
  updateTicket
} = require("../controllers/ticketController");

const router = express.Router();

router.get("/", getTickets);
router.get("/:id", getTicketById);
router.put("/:id", updateTicket);

module.exports = router;