import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

const emailRegex    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;

export default function Signup() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [form, setForm] = useState({
    name:    "",
    email:   "",
    password:"",
    confirm: "",
    role:    "STUDENT",  // default
  });

  const [showPwd, setShowPwd]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

// console.log("🚀 Signup payload:", {
//   name: form.name,
//   email: form.email,
//   password: form.password,
//   role: form.role,
// });


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Front‑end validation
    if (!emailRegex.test(form.email)) {
      alert("Invalid email format");
      return;
    }
    if (!passwordRegex.test(form.password)) {
      alert("Password must be ≥8 chars and include 1 number + 1 special char");
      return;
    }
    if (form.password !== form.confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await API.post("/auth/signup", {
        name:     form.name,
        email:    form.email,
        password: form.password,
        role:     form.role,
      });

      // console.log("🟢 Response from backend:", res.data);

      // On success: store auth and redirect based on actual role
      login(res.data);
      console.log("Signed up user role:", res.data.user.role);
      const actualRole = res.data.user.role;
      navigate(actualRole === "ADMIN" ? "/admin" : "/home");
    } catch (err) {

      // Show backend‑generated message (uses `msg` key)
      
      alert(err.response?.data?.msg || "Signup failed");
      return;
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

      {/* Role selector */}
     <select
  value={form.role}
  onChange={(e) => setForm({ ...form, role: e.target.value })}
  required
>
  <option value="STUDENT">Student</option>
  <option value="ADMIN">Admin</option>
</select>


      {/* Password field with eye icon */}
      <div className="input-with-eye">
        <input
          type={showPwd ? "text" : "password"}
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <span onClick={() => setShowPwd(!showPwd)}>
          {showPwd ? <AiFillEyeInvisible /> : <AiFillEye />}
        </span>
      </div>

      {/* Confirm password */}
      <div className="input-with-eye">
        <input
          type={showConfirm ? "text" : "password"}
          placeholder="Confirm Password"
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          required
        />
        <span onClick={() => setShowConfirm(!showConfirm)}>
          {showConfirm ? <AiFillEyeInvisible /> : <AiFillEye />}
        </span>
      </div>

      <div className="button-wrapper">
        <button type="submit">Signup</button>
      </div>

      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </form>
  );
}
