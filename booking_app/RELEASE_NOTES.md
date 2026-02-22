# Release Notes

## v1.0.0 (2026-02-21)

### Highlights
- Full booking workflow: create bookings from the public page and manage them in an admin dashboard.
- Modern refreshed UI: dark “glass” theme, improved layout, and responsive styling across pages.

### Frontend (React)
- Booking page (`/`): streamlined booking form, inline validation, and richer success confirmation panel.
- Admin dashboard (`/admin`): search + status filtering, quick status changes, edit-in-modal flow, improved table UX (badges + actions), and sign-in protection.
- Navigation: new top bar with active route styling (Book / Admin).

### Backend (Node.js / Express)
- REST API for bookings:
  - `GET /api/health`
  - `GET /api/bookings`
  - `GET /api/bookings/:id`
  - `POST /api/bookings`
  - `PUT /api/bookings/:id`
  - `DELETE /api/bookings/:id`
- Admin authentication:
  - `POST /api/auth/login`
  - `GET /api/auth/me`
- CORS allowlist via `CORS_ORIGIN` (comma-separated).

### Database (MySQL)
- Added `booking_app` schema + `bookings` table definition in `db/schema.sql`.

### Configuration
- API default port is `3002` (configurable via `APP_PORT`).
- Frontend API base URL default is `http://localhost:3002/api` (via `VITE_API_URL`).

### Notes / Limitations
- Admin authentication uses environment-configured credentials and a JWT token for API access.
- If port `5173` is already in use, Vite will automatically pick the next available port.
