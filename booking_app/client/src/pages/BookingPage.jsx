import { useState } from "react";
import BookingForm from "../components/BookingForm.jsx";
import { createBooking } from "../api.js";
import { Link } from "react-router-dom";

export default function BookingPage() {
  const [created, setCreated] = useState(null);
  const [formKey, setFormKey] = useState(0);

  async function handleSubmit(payload) {
    const booking = await createBooking(payload);
    setCreated(booking);
    setFormKey((k) => k + 1);
  }

  return (
    <div>
      <div className="pageHeader">
        <h1 className="title">Book an appointment</h1>
        <p className="subtitle">A clean booking flow with instant save to MySQL via the Node API.</p>
      </div>

      <div className="layoutGrid">
        <div className="stack">
          <BookingForm key={formKey} onSubmit={handleSubmit} submitLabel="Create booking" />
        </div>

        <div className="card cardPad stackSm">
          <div>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>How it works</div>
            <div className="muted">
              Submit your details and preferred time. The system stores the booking and makes it available in the admin dashboard.
            </div>
          </div>

          {created ? (
            <div className="alert alertSuccess stackSm">
              <div style={{ fontWeight: 700 }}>Booking created</div>
              <div className="muted">Reference ID: {created.id}</div>
              <div className="rowInline">
                <Link className="btn btnSm btnPrimary" to="/admin">
                  Open admin
                </Link>
                <button className="btn btnSm btnGhost" type="button" onClick={() => setCreated(null)}>
                  Create another
                </button>
              </div>
            </div>
          ) : (
            <div className="alert">
              <div className="muted">After submitting, you’ll get an instant confirmation here.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

