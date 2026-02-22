import { useMemo, useState } from "react";

function toDateTimeLocal(value) {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";

  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

function validate(values, { requireAll }) {
  const errors = {};
  if (requireAll && !values.customer_name.trim()) errors.customer_name = "Required";
  if (requireAll && !values.service.trim()) errors.service = "Required";
  if (requireAll && !values.appointment_at) errors.appointment_at = "Required";
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "Invalid email";
  return errors;
}

export default function BookingForm({
  initialBooking,
  onSubmit,
  submitLabel = "Submit",
  allowStatus = false,
  onCancel
}) {
  const initial = useMemo(() => {
    const b = initialBooking || {};
    return {
      customer_name: b.customer_name || "",
      email: b.email || "",
      phone: b.phone || "",
      service: b.service || "",
      appointment_at: toDateTimeLocal(b.appointment_at) || "",
      notes: b.notes || "",
      status: b.status || "scheduled"
    };
  }, [initialBooking]);

  const [values, setValues] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  function setField(name, value) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const errors = validate(values, { requireAll: !initialBooking });
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    setSubmitting(true);
    try {
      const payload = {
        customer_name: values.customer_name.trim(),
        email: values.email.trim() || null,
        phone: values.phone.trim() || null,
        service: values.service.trim(),
        appointment_at: values.appointment_at,
        notes: values.notes.trim() || null
      };
      if (allowStatus) payload.status = values.status;
      await onSubmit(payload);
    } catch (err) {
      setError(err?.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="card cardPad stack" onSubmit={handleSubmit}>
      <div className="formGrid">
        <div>
          <label className="label">
            Name{!initialBooking ? <span className="req">*</span> : null}
          </label>
          <input
            className="input"
            value={values.customer_name}
            onChange={(e) => setField("customer_name", e.target.value)}
            placeholder="Jane Doe"
            aria-invalid={Boolean(fieldErrors.customer_name)}
            required={!initialBooking}
          />
          {fieldErrors.customer_name ? <div className="fieldError">{fieldErrors.customer_name}</div> : null}
        </div>

        <div>
          <label className="label">
            Service{!initialBooking ? <span className="req">*</span> : null}
          </label>
          <input
            className="input"
            value={values.service}
            onChange={(e) => setField("service", e.target.value)}
            placeholder="Consultation"
            aria-invalid={Boolean(fieldErrors.service)}
            required={!initialBooking}
          />
          {fieldErrors.service ? <div className="fieldError">{fieldErrors.service}</div> : null}
        </div>

        <div>
          <label className="label">Email</label>
          <input
            className="input"
            value={values.email}
            onChange={(e) => setField("email", e.target.value)}
            placeholder="jane@example.com"
            aria-invalid={Boolean(fieldErrors.email)}
            inputMode="email"
          />
          {fieldErrors.email ? <div className="fieldError">{fieldErrors.email}</div> : null}
        </div>

        <div>
          <label className="label">Phone</label>
          <input
            className="input"
            value={values.phone}
            onChange={(e) => setField("phone", e.target.value)}
            placeholder="+1 555 0100"
            inputMode="tel"
          />
        </div>

        <div>
          <label className="label">
            Appointment{!initialBooking ? <span className="req">*</span> : null}
          </label>
          <input
            className="input"
            type="datetime-local"
            value={values.appointment_at}
            onChange={(e) => setField("appointment_at", e.target.value)}
            aria-invalid={Boolean(fieldErrors.appointment_at)}
            required={!initialBooking}
          />
          {fieldErrors.appointment_at ? <div className="fieldError">{fieldErrors.appointment_at}</div> : null}
        </div>

        {allowStatus ? (
          <div>
            <label className="label">Status</label>
            <select className="select" value={values.status} onChange={(e) => setField("status", e.target.value)}>
              <option value="scheduled">scheduled</option>
              <option value="completed">completed</option>
              <option value="cancelled">cancelled</option>
            </select>
          </div>
        ) : (
          <div />
        )}
      </div>

      <div>
        <label className="label">Notes</label>
        <textarea className="textarea" value={values.notes} onChange={(e) => setField("notes", e.target.value)} placeholder="Any extra details…" />
        <div className="hint">Optional. Add preferences or context for the appointment.</div>
      </div>

      {error ? <div className="alert alertError">{error}</div> : null}

      <div className="rowInline">
        <button className="btn btnPrimary" disabled={submitting} type="submit">
          {submitting ? "Saving..." : submitLabel}
        </button>
        {onCancel ? (
          <button className="btn btnGhost" type="button" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}

