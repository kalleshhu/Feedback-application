import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Nav.css";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleChangePassword = () => {
    navigate("/change-password");
  };

    const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="admin-nav">
      <h1>Feedback Application</h1>

      <div className="hamburger" onClick={toggleMenu}>
        &#9776; {/* ☰ */}
      </div>

      {menuOpen && (
        <div className="dropdown-menu">
          <button onClick={handleChangePassword}>Change Password</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}
