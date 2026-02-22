# API Documentation

Base path: `/api`

## Overview
- Content type: `application/json`
- Success responses usually wrap data in `{ "data": ... }`
- Error shape: `{ "error": "message" }`
- Validation errors: `{ "error": "Validation failed", "details": ["..."] }`

## Authentication (Admin)
Admin authentication uses a JWT access token.

### POST `/auth/login`
Authenticate an admin user and receive a JWT.

**Auth required:** No  
**Body**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**200 Response**
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { "username": "admin" }
  }
}
```

**Errors**
- `400` missing username/password
- `401` invalid credentials

### GET `/auth/me`
Validate the current token and return the current user.

**Auth required:** Yes (`Authorization: Bearer <token>`)

**200 Response**
```json
{
  "data": {
    "user": { "username": "admin", "role": "admin" }
  }
}
```

**Errors**
- `401` missing/invalid/expired token

## Health

### GET `/health`
Checks API + database connectivity.

**Auth required:** No

**200 Response**
```json
{ "ok": true }
```

## Bookings

### Booking object
```json
{
  "id": 1,
  "customer_name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1 555 0100",
  "service": "Consultation",
  "appointment_at": "2026-02-21T09:30:00.000Z",
  "notes": "Optional notes",
  "status": "scheduled",
  "created_at": "2026-02-21T08:10:00.000Z",
  "updated_at": "2026-02-21T08:10:00.000Z"
}
```

Valid `status` values: `scheduled | completed | cancelled`

### GET `/bookings`
List bookings (admin).

**Auth required:** Yes

**Query params (optional)**
- `search`: matches `customer_name`, `email`, `phone`, `service` (SQL LIKE)
- `status`: `scheduled|completed|cancelled`
- `from`: date/datetime (filters `appointment_at >= from`)
- `to`: date/datetime (filters `appointment_at <= to`)

**200 Response**
```json
{
  "data": [
    { "id": 1, "customer_name": "Jane Doe", "service": "Consultation", "appointment_at": "2026-02-21T09:30:00.000Z", "status": "scheduled", "email": null, "phone": null, "notes": null, "created_at": "2026-02-21T08:10:00.000Z", "updated_at": "2026-02-21T08:10:00.000Z" }
  ]
}
```

**Errors**
- `401` missing/invalid token

### GET `/bookings/:id`
Fetch a single booking by id (admin).

**Auth required:** Yes

**Path params**
- `id` (number)

**200 Response**
```json
{ "data": { "id": 1, "customer_name": "Jane Doe", "service": "Consultation", "appointment_at": "2026-02-21T09:30:00.000Z", "status": "scheduled" } }
```

**Errors**
- `400` invalid id
- `401` missing/invalid token
- `404` not found

### POST `/bookings`
Create a booking (public).

**Auth required:** No

**Body**
```json
{
  "customer_name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1 555 0100",
  "service": "Consultation",
  "appointment_at": "2026-02-21T09:30",
  "notes": "Optional notes"
}
```

**201 Response**
```json
{ "data": { "id": 1, "customer_name": "Jane Doe", "service": "Consultation", "appointment_at": "2026-02-21T09:30:00.000Z", "status": "scheduled" } }
```

**Errors**
- `400` validation failed (`details` array)

### PUT `/bookings/:id`
Update a booking (admin).

**Auth required:** Yes

**Body (any subset of fields)**
```json
{
  "status": "completed",
  "notes": "Updated notes"
}
```

**200 Response**
```json
{ "data": { "id": 1, "status": "completed" } }
```

**Errors**
- `400` invalid id or validation failed
- `401` missing/invalid token
- `404` not found

### DELETE `/bookings/:id`
Delete a booking (admin).

**Auth required:** Yes

**204 Response**
- No content

**Errors**
- `400` invalid id
- `401` missing/invalid token
- `404` not found

## Examples (cURL)

### Login
```bash
curl -s -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

### List bookings (authorized)
```bash
TOKEN="paste_token_here"
curl -s http://localhost:3002/api/bookings \
  -H "Authorization: Bearer $TOKEN"
```

