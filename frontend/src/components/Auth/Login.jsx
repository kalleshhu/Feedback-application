
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      login(res.data);
      const role = res.data.user.role;
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

      <div className="input-with-eye">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <span onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
        </span>
      </div>

      <div className="button-wrapper">
        <button type="submit">Login</button>
      </div>

      <p>
        Don't have an account? <Link to="/signup">Signup</Link>
      </p>
    </form>
  );
};

export default Login;
