import { useCallback, useEffect, useMemo, useState } from "react";
import { deleteBooking, listBookings, updateBooking } from "../api.js";
import BookingForm from "../components/BookingForm.jsx";
import BookingsTable from "../components/BookingsTable.jsx";

export default function AdminPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState("");

  const params = useMemo(() => ({ search, status }), [search, status]);

  const refresh = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const rows = await listBookings(params);
      setBookings(rows);
    } catch (err) {
      setError(err?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  async function handleDelete(booking) {
    const ok = window.confirm(`Delete booking #${booking.id}?`);
    if (!ok) return;
    try {
      await deleteBooking(booking.id);
      await refresh();
      setToast(`Deleted booking #${booking.id}`);
    } catch (err) {
      setError(err?.message || "Delete failed");
    }
  }

  async function handleStatusChange(booking, nextStatus) {
    try {
      const updated = await updateBooking(booking.id, { status: nextStatus });
      setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      setToast(`Updated status for #${updated.id}`);
    } catch (err) {
      setError(err?.message || "Update failed");
    }
  }

  async function handleEditSubmit(payload) {
    const updated = await updateBooking(editing.id, payload);
    setEditing(null);
    setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    setToast(`Saved changes for #${updated.id}`);
  }

  return (
    <div>
      <div className="pageHeader">
        <h1 className="title">Admin dashboard</h1>
        <p className="subtitle">Search, filter, edit, update status, and delete bookings.</p>
      </div>

      {toast ? <div className="alert alertSuccess" style={{ marginBottom: 14 }}>{toast}</div> : null}
      {error ? <div className="alert alertError" style={{ marginBottom: 14 }}>{error}</div> : null}

      <div className="card cardPad stackSm">
        <div className="formGrid">
          <div>
            <label className="label">Search</label>
            <input
              className="input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name, email, phone, service…"
            />
          </div>
          <div>
            <label className="label">Status</label>
            <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All</option>
              <option value="scheduled">scheduled</option>
              <option value="completed">completed</option>
              <option value="cancelled">cancelled</option>
            </select>
          </div>
        </div>

        <div className="rowInline">
          <button className="btn btnPrimary" type="button" onClick={refresh} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          <button className="btn btnGhost" type="button" onClick={() => { setSearch(""); setStatus(""); }} disabled={loading}>
            Clear filters
          </button>
          <div className="muted">{bookings.length} bookings</div>
        </div>
      </div>

      {editing ? (
        <div
          className="modalOverlay"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setEditing(null);
          }}
        >
          <div className="modal">
            <div className="modalHeader">
              <div className="modalTitle">Edit booking #{editing.id}</div>
              <button className="btn btnSm btnGhost" type="button" onClick={() => setEditing(null)}>
                Close
              </button>
            </div>
            <div className="modalBody">
              <BookingForm
                initialBooking={editing}
                onSubmit={handleEditSubmit}
                submitLabel="Save changes"
                allowStatus={true}
                onCancel={() => setEditing(null)}
              />
            </div>
          </div>
        </div>
      ) : null}

      <BookingsTable
        bookings={bookings}
        onEdit={(b) => setEditing(b)}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

