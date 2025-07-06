import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);

      // 1️⃣ Save token + user in context
      login(res.data);                     // <‑‑ restores AuthContext

      // 2️⃣ Role‑based redirect (case‑exact)
      const role = res.data.user.role;     // e.g., "ADMIN" or "STUDENT"
      navigate(role === "ADMIN" ? "/admin" : "/home");
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Feedback System</h2>

      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />

      <div className="button-wraper">
      <button type="submit">Login</button>
      </div>
      <p>
        Don't have an account? <Link to="/signup">Signup</Link>
      </p>
    </form>
  );
};

export default Login;
