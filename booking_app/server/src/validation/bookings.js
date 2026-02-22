const STATUS = new Set(["scheduled", "completed", "cancelled"]);

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(value) {
  if (!isNonEmptyString(value)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidDate(value) {
  const d = value instanceof Date ? value : new Date(value);
  return !Number.isNaN(d.getTime());
}

function validateCreateBooking(body) {
  const errors = [];
  if (!body || typeof body !== "object") return ["Body must be an object"];

  if (!isNonEmptyString(body.customer_name)) errors.push("customer_name is required");
  if (!isNonEmptyString(body.service)) errors.push("service is required");
  if (!body.appointment_at || !isValidDate(body.appointment_at)) errors.push("appointment_at must be a valid date");

  if (body.email != null && body.email !== "" && !isValidEmail(body.email)) errors.push("email is invalid");
  if (body.status != null && body.status !== "" && !STATUS.has(body.status)) errors.push("status is invalid");

  return errors;
}

function validateUpdateBooking(body) {
  const errors = [];
  if (!body || typeof body !== "object") return ["Body must be an object"];

  const allowed = new Set([
    "customer_name",
    "email",
    "phone",
    "service",
    "appointment_at",
    "notes",
    "status"
  ]);

  for (const key of Object.keys(body)) {
    if (!allowed.has(key)) errors.push(`Unknown field: ${key}`);
  }

  if ("customer_name" in body && body.customer_name != null && !isNonEmptyString(body.customer_name)) {
    errors.push("customer_name must be a non-empty string");
  }
  if ("service" in body && body.service != null && !isNonEmptyString(body.service)) {
    errors.push("service must be a non-empty string");
  }
  if ("appointment_at" in body && body.appointment_at != null && !isValidDate(body.appointment_at)) {
    errors.push("appointment_at must be a valid date");
  }
  if ("email" in body && body.email != null && body.email !== "" && !isValidEmail(body.email)) {
    errors.push("email is invalid");
  }
  if ("status" in body && body.status != null && body.status !== "" && !STATUS.has(body.status)) {
    errors.push("status is invalid");
  }

  return errors;
}

module.exports = { validateCreateBooking, validateUpdateBooking };

