import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const Profile = () => {
  const { user, logout } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "", dob: "", address: "" });

  useEffect(() => {
    setForm({
      name: user?.name || "",
      phone: user?.phone || "",
      dob: user?.dob ? user.dob.split("T")[0] : "",
      address: user?.address || "",
    });
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    await API.put("/auth/update-profile", form);
    alert("Profile updated");
  };

  return (
    <div>
      <h2>My Profile</h2>
      <form onSubmit={handleSave}>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Name"
        />
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="Phone"
        />
        <input
          type="date"
          value={form.dob}
          onChange={(e) => setForm({ ...form, dob: e.target.value })}
        />
        <input
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          placeholder="Address"
        />
        <button type="submit">Update</button>
      </form>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Profile;
