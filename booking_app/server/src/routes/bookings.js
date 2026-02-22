const express = require("express");
const {
  listBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking
} = require("../db/bookingsRepo");

const { validateCreateBooking, validateUpdateBooking } = require("../validation/bookings");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const rows = await listBookings({
      from: req.query.from,
      to: req.query.to,
      status: req.query.status,
      search: req.query.search
    });
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "Invalid id" });

    const booking = await getBookingById(id);
    if (!booking) return res.status(404).json({ error: "Not found" });

    res.json({ data: booking });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const errors = validateCreateBooking(req.body);
    if (errors.length) return res.status(400).json({ error: "Validation failed", details: errors });

    const booking = await createBooking(req.body);
    res.status(201).json({ data: booking });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "Invalid id" });

    const errors = validateUpdateBooking(req.body);
    if (errors.length) return res.status(400).json({ error: "Validation failed", details: errors });

    const updated = await updateBooking(id, req.body);
    if (!updated) return res.status(404).json({ error: "Not found" });

    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "Invalid id" });

    const ok = await deleteBooking(id);
    if (!ok) return res.status(404).json({ error: "Not found" });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = { bookingsRouter: router };

