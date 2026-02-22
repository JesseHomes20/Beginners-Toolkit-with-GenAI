# Booking System (React + Node + MySQL)

## API Documentation
- See [API_DOCUMENTATION.md](file:///c:/xampp/htdocs/book/API_DOCUMENTATION.md)

## User Flows
- See [USER_FLOWS.md](file:///c:/xampp/htdocs/book/USER_FLOWS.md)

## Database
- Run the SQL in [schema.sql](file:///c:/xampp/htdocs/book/db/schema.sql) to create the `booking_app` database and `bookings` table.

## Backend (Node.js / Express)
1. Copy `server/.env.example` to `server/.env` and set your MySQL credentials.
   - Default API URL: `http://localhost:3002`
   - Admin auth:
     - `ADMIN_USER` / `ADMIN_PASSWORD`
     - `JWT_SECRET`
2. Install dependencies:
   - `cd server`
   - `npm install` (if PowerShell blocks scripts, use `npm.cmd install`)
3. Start the API:
   - `npm run dev` (or `npm.cmd run dev`)

API endpoints:
- `GET /api/health`
- `GET /api/bookings`
- `GET /api/bookings/:id`
- `POST /api/bookings`
- `PUT /api/bookings/:id`
- `DELETE /api/bookings/:id`

CORS:
- Configure allowed frontend origin(s) via `CORS_ORIGIN` (comma-separated).

## Frontend (React / Vite)
1. Copy `client/.env.example` to `client/.env` if your API base URL is different.
   - Default uses a dev proxy: frontend calls `/api` and Vite proxies to `http://127.0.0.1:3002`
2. Install and run:
   - `cd client`
   - `npm install` (or `npm.cmd install`)
   - `npm run dev`
3. Open:
   - `http://127.0.0.1:5173/`

Pages:
- `/` booking form
- `/admin/login` admin sign-in
- `/admin` admin dashboard (requires sign-in)

