function fmtDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
}

export default function BookingsTable({ bookings, onEdit, onDelete, onStatusChange }) {
  return (
    <div className="card" style={{ marginTop: 14 }}>
      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th style={{ width: 70 }}>ID</th>
              <th>Customer</th>
              <th style={{ width: 180 }}>Service</th>
              <th style={{ width: 210 }}>Appointment</th>
              <th style={{ width: 220 }}>Status</th>
              <th style={{ width: 220 }} />
            </tr>
          </thead>
          <tbody>
            {bookings.length ? (
              bookings.map((b) => (
                <tr key={b.id}>
                  <td className="muted">#{b.id}</td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{b.customer_name}</div>
                    <div className="muted">{[b.email, b.phone].filter(Boolean).join(" · ") || "—"}</div>
                  </td>
                  <td>{b.service}</td>
                  <td>{fmtDate(b.appointment_at)}</td>
                  <td>
                    <div className="rowInline">
                      <span className={`badge ${b.status}`}>{b.status}</span>
                      <select className="select" value={b.status} onChange={(e) => onStatusChange(b, e.target.value)}>
                        <option value="scheduled">scheduled</option>
                        <option value="completed">completed</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </div>
                  </td>
                  <td>
                    <div className="rowInline">
                      <button className="btn btnSm" type="button" onClick={() => onEdit(b)}>
                        Edit
                      </button>
                      <button className="btn btnSm btnDanger" type="button" onClick={() => onDelete(b)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="muted">
                  No bookings yet. Create one from the booking page.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

