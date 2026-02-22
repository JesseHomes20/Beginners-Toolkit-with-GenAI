# User Flows

This document describes how users move through the Booking System UI and what happens behind the scenes.

## Roles
- **Public User**: creates bookings from the public booking page.
- **Admin User**: signs in and manages bookings (search/filter/edit/status/delete).

## URLs / Pages
- `/` — Booking page (public)
- `/admin/login` — Admin sign-in (public)
- `/admin` — Admin dashboard (protected)

## Flow 1 — Create a Booking (Public)
**Goal:** Create a new booking request.

### Steps (UI)
1. User opens the booking page (`/`).
2. User fills in:
   - Name (required)
   - Service (required)
   - Appointment date/time (required)
   - Email, phone, notes (optional)
3. User clicks **Create booking**.
4. User sees a confirmation card containing a reference ID and actions:
   - Open admin (if they have admin access)
   - Create another booking

### System Behavior (API)
- `POST /api/bookings` with booking payload
- On success, the UI shows the created booking id.
- On validation failure, the UI shows inline field validation messages.

### Failure States
- **Validation error**: missing required fields or invalid email/date → shown inline.
- **Network/API error**: API not reachable → error alert shown on the form.

## Flow 2 — Admin Sign In (Protected Access)
**Goal:** Obtain access to the admin dashboard.

### Steps (UI)
1. Admin opens `/admin`.
2. If not authenticated, the app redirects to `/admin/login`.
3. Admin enters username + password.
4. Admin clicks **Sign in**.
5. On success, the app stores the auth token locally and redirects to `/admin`.
6. A **Sign out** action is available in the top navigation.

### System Behavior (API)
- `POST /api/auth/login` returns a JWT token if credentials match environment configuration.
- The token is stored in the browser (local storage) and attached to subsequent admin API requests.

### Failure States
- **Invalid credentials**: server returns `401` → login form shows an error alert.
- **Network/API error**: API not reachable → login form shows an error alert.

## Flow 3 — Admin View Bookings (List + Search + Filter)
**Goal:** Find a booking quickly.

### Steps (UI)
1. Admin opens `/admin` (must be signed in).
2. Admin optionally:
   - Enters a search string (name/email/phone/service)
   - Chooses a status filter (scheduled/completed/cancelled)
3. Admin clicks **Refresh** (or the page auto-loads on first open).
4. Admin sees a bookings table with:
   - ID, customer, service, appointment, status
   - Status badge + status dropdown for quick updates
   - Edit and Delete actions

### System Behavior (API)
- `GET /api/bookings?search=...&status=...` (admin token required)

### Failure States
- **Not authenticated / expired token**: server returns `401` → client clears token and redirects back to login on next navigation.
- **Server error**: UI shows an error alert on the admin page.

## Flow 4 — Admin Update Booking Status (Inline)
**Goal:** Quickly mark a booking as completed/cancelled/scheduled.

### Steps (UI)
1. In the bookings table, admin changes the status dropdown.
2. UI shows a small confirmation toast (“Updated status for #ID”).

### System Behavior (API)
- `PUT /api/bookings/:id` with `{ "status": "completed" }` (admin token required)
- UI updates the row in-place after success.

### Failure States
- Update fails → error alert shown on the admin page.

## Flow 5 — Admin Edit Booking (Modal)
**Goal:** Update booking details (name/service/appointment/notes/status).

### Steps (UI)
1. Admin clicks **Edit** on a booking row.
2. A modal opens with the booking form pre-filled.
3. Admin edits fields and clicks **Save changes**.
4. Modal closes and the list updates.

### System Behavior (API)
- `PUT /api/bookings/:id` with changed fields (admin token required)

### Failure States
- Validation/server error → error alert shown in the form.

## Flow 6 — Admin Delete Booking
**Goal:** Remove a booking.

### Steps (UI)
1. Admin clicks **Delete** on a booking row.
2. A browser confirmation dialog is shown.
3. Admin confirms deletion.
4. The list refreshes and a toast confirms the action.

### System Behavior (API)
- `DELETE /api/bookings/:id` (admin token required)

### Failure States
- Delete fails → error alert shown on the admin page.

## Notes / Assumptions
- The admin dashboard is protected by a JWT token issued from environment-configured credentials.
- The public booking creation endpoint remains open so customers can create bookings without an account.
- The UI uses a Vite dev proxy by default in development so `/api` is proxied to the backend.

