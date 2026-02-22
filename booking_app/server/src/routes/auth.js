const express = require("express");
const jwt = require("jsonwebtoken");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/login", async (req, res) => {
  const username = String(req.body?.username || "").trim();
  const password = String(req.body?.password || "");

  const expectedUser = String(process.env.ADMIN_USER || "admin");
  const expectedPass = String(process.env.ADMIN_PASSWORD || "admin123");
  const secret = process.env.JWT_SECRET || "dev_secret_change_me";

  if (!username || !password) return res.status(400).json({ error: "Username and password are required" });

  const ok = username === expectedUser && password === expectedPass;
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ sub: username, role: "admin" }, secret, { expiresIn: "8h" });
  res.json({ data: { token, user: { username } } });
});

router.get("/me", requireAuth, async (req, res) => {
  res.json({ data: { user: { username: req.user?.sub || "admin", role: req.user?.role || "admin" } } });
});

module.exports = { authRouter: router };

