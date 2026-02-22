const { pool } = require("./pool");

function toDate(value) {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

async function listBookings({ from, to, status, search } = {}) {
  const where = [];
  const params = [];

  const fromDate = toDate(from);
  const toDateVal = toDate(to);

  if (fromDate) {
    where.push("appointment_at >= ?");
    params.push(fromDate);
  }
  if (toDateVal) {
    where.push("appointment_at <= ?");
    params.push(toDateVal);
  }
  if (status) {
    where.push("status = ?");
    params.push(status);
  }
  if (search) {
    where.push("(customer_name LIKE ? OR email LIKE ? OR phone LIKE ? OR service LIKE ?)");
    const like = `%${search}%`;
    params.push(like, like, like, like);
  }

  const sql = `
    SELECT id, customer_name, email, phone, service, appointment_at, notes, status, created_at, updated_at
    FROM bookings
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    ORDER BY appointment_at DESC, id DESC
  `;

  const [rows] = await pool.query(sql, params);
  return rows;
}

async function getBookingById(id) {
  const [rows] = await pool.query(
    `
      SELECT id, customer_name, email, phone, service, appointment_at, notes, status, created_at, updated_at
      FROM bookings
      WHERE id = ?
      LIMIT 1
    `,
    [id]
  );
  return rows[0] || null;
}

async function createBooking(payload) {
  const appointmentAt = toDate(payload.appointment_at);
  const [result] = await pool.query(
    `
      INSERT INTO bookings (customer_name, email, phone, service, appointment_at, notes, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      payload.customer_name,
      payload.email || null,
      payload.phone || null,
      payload.service,
      appointmentAt,
      payload.notes || null,
      payload.status || "scheduled"
    ]
  );

  return getBookingById(result.insertId);
}

async function updateBooking(id, patch) {
  const allowed = [
    "customer_name",
    "email",
    "phone",
    "service",
    "appointment_at",
    "notes",
    "status"
  ];

  const setParts = [];
  const params = [];

  for (const key of allowed) {
    if (!(key in patch)) continue;
    if (key === "appointment_at") {
      const d = toDate(patch.appointment_at);
      if (!d) continue;
      setParts.push(`${key} = ?`);
      params.push(d);
      continue;
    }

    setParts.push(`${key} = ?`);
    params.push(patch[key] ?? null);
  }

  if (!setParts.length) return getBookingById(id);

  params.push(id);
  await pool.query(`UPDATE bookings SET ${setParts.join(", ")} WHERE id = ?`, params);
  return getBookingById(id);
}

async function deleteBooking(id) {
  const [result] = await pool.query("DELETE FROM bookings WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

module.exports = {
  listBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking
};

