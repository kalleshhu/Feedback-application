import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

const emailRegex     = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex  = /^(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;

const Signup = () => {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* ── front‑end validation ── */
    if (!emailRegex.test(form.email)) {
      alert("Invalid email format");
      return;
    }
    if (!passwordRegex.test(form.password)) {
      alert("Password must be ≥8 chars and include 1 number + 1 special char");
      return;
    }

    try {
      const res = await API.post("/auth/signup", form);
      login(res.data);            // store user + token in context
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Feedback System</h2>

      <input
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />

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
        <button type="submit">Signup</button>
      </div>

      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </form>
  );
};

export default Signup;
