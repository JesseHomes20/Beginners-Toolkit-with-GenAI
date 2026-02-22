import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginAdmin } from "../api.js";
import { setAuthToken } from "../auth.js";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin";

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginAdmin({ username, password });
      setAuthToken(res.token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="pageHeader">
        <h1 className="title">Admin sign in</h1>
        <p className="subtitle">Sign in to manage bookings.</p>
      </div>

      <form className="card cardPad stack" onSubmit={handleSubmit}>
        <div className="formGrid">
          <div>
            <label className="label">Username</label>
            <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
            />
          </div>
        </div>

        {error ? <div className="alert alertError">{error}</div> : null}

        <div className="rowInline">
          <button className="btn btnPrimary" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>

      <div className="muted" style={{ marginTop: 12 }}>
        Default dev credentials are configured in <code>server/.env</code>.
      </div>
    </div>
  );
}

