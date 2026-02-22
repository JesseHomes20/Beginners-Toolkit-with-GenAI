import { Navigate, NavLink, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingPage from "./pages/BookingPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";
import { clearAuthToken, getAuthToken } from "./auth.js";

function RequireAuth({ children }) {
  const location = useLocation();
  const token = getAuthToken();
  if (!token) return <Navigate to="/admin/login" replace state={{ from: location }} />;
  return children;
}

export default function App() {
  const [authed, setAuthed] = useState(Boolean(getAuthToken()));

  useEffect(() => {
    function onAuthChange() {
      setAuthed(Boolean(getAuthToken()));
    }
    window.addEventListener("authchange", onAuthChange);
    window.addEventListener("storage", onAuthChange);
    return () => {
      window.removeEventListener("authchange", onAuthChange);
      window.removeEventListener("storage", onAuthChange);
    };
  }, []);

  return (
    <div className="appShell">
      <header className="topbar">
        <div className="container topbarInner">
          <div className="brand">
            <div className="brandMark" />
            <div>
              <div className="brandName">Booking</div>
              <div className="brandTag">Appointments</div>
            </div>
          </div>

          <nav className="navLinks">
            <NavLink className={({ isActive }) => `navLink ${isActive ? "active" : ""}`} to="/" end>
              Book
            </NavLink>
            <NavLink className={({ isActive }) => `navLink ${isActive ? "active" : ""}`} to="/admin">
              Admin
            </NavLink>
            {authed ? (
              <button className="btn btnSm btnGhost" type="button" onClick={clearAuthToken}>
                Sign out
              </button>
            ) : null}
          </nav>
        </div>
      </header>

      <main className="container main">
        <Routes>
          <Route path="/" element={<BookingPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <AdminPage />
              </RequireAuth>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
