require("dotenv").config({ override: true });

const express = require("express");
const cors = require("cors");

const { bookingsRouter } = require("./routes/bookings");
const { authRouter } = require("./routes/auth");
const { errorHandler } = require("./middleware/errorHandler");
const { pool } = require("./db/pool");

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const isDev = String(process.env.NODE_ENV || "").toLowerCase() !== "production";

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      if (!allowedOrigins.length) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      if (isDev && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    }
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/api/health", async (req, res, next) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

app.use("/api/auth", authRouter);
app.use("/api/bookings", bookingsRouter);

app.use(errorHandler);

const port = Number(process.env.APP_PORT || 3002);
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});

