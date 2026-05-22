const tickets = require("../data/tickets");

const getTickets = (req, res) => {
  return res.status(200).json({
    success: true,
    tickets
  });
};

const getTicketById = (req, res) => {
  const { id } = req.params;

  const ticket = tickets.find((t) => t.id === id);

  if (!ticket) {
    return res.status(404).json({
      success: false,
      message: "Ticket not found"
    });
  }

  return res.status(200).json({
    success: true,
    ticket
  });
};

const updateTicket = (req, res) => {
  const { id } = req.params;
  const { status, assignedTo } = req.body;

  const ticketIndex = tickets.findIndex((t) => t.id === id);

  if (ticketIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Ticket not found"
    });
  }

  tickets[ticketIndex] = {
    ...tickets[ticketIndex],
    status: status || tickets[ticketIndex].status,
    assignedTo:
      assignedTo !== undefined
        ? assignedTo
        : tickets[ticketIndex].assignedTo
  };

  return res.status(200).json({
    success: true,
    ticket: tickets[ticketIndex]
  });
};

module.exports = {
  getTickets,
  getTicketById,
  updateTicket
};