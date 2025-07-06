
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";  // 👁 icons
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./ChangePassword.css";

export default function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /* eye‑toggle state */
  const [showNew, setShowNew]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    try {
      await API.post("/auth/change-password", form);   // token added via axios interceptor
      alert("Password changed successfully");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to change password");
    }
  };

  const eye = (open) => open ? <AiFillEyeInvisible /> : <AiFillEye />;

  return (
    <form onSubmit={handleSubmit} className="change-password-form">
      <h2>Change Password</h2>

      <input
        type="password"
        placeholder="Current Password"
        value={form.currentPassword}
        onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
        required
      />

      {/* New password + eye */}
      <div className="input-with-eye">
        <input
          type={showNew ? "text" : "password"}
          placeholder="New Password"
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          required
        />
        <span onClick={() => setShowNew(!showNew)}>{eye(showNew)}</span>
      </div>

      {/* Confirm password + eye */}
      <div className="input-with-eye">
        <input
          type={showConfirm ? "text" : "password"}
          placeholder="Confirm New Password"
          value={form.confirmPassword}
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
          required
        />
        <span onClick={() => setShowConfirm(!showConfirm)}>{eye(showConfirm)}</span>
      </div>

      <div className="button-wrapper">
        <button type="submit">Submit</button>
      </div>
      <div style={{marginTop:"5px"}} className="back-button-wrapper">
        <button style={{padding:"7px"}} onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>
      </div>
    </form>  
  );
  
}
