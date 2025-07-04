import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const profileRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/profile")
      .then((res) => setUser(res.data))
      .catch(console.error);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <h2>Feedback App</h2>

      <div className="profile-section" ref={profileRef}>
        <img
          src={user?.avatar || "/default-avatar.png"}
          alt="profile"
          onClick={toggleMenu}
          className="profile-circle"
        />
        {menuOpen && (
          <div className="dropdown">
            <button onClick={() => navigate("/profile")}>View/Edit Profile</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
