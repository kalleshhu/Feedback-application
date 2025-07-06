import { useEffect, useRef, useState } from "react";
import API from "../api/axios";
import { uploadImage } from "../utils/uploadImage";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState({});
  const [isEditing, setEditOn] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [pw, setPw] = useState({ current: "", password: "" });
  const fileInputRef = useRef(null);

   const navigate = useNavigate();

  useEffect(() => {
    API.get("/profile")
      .then(res => {
        setUser(res.data);
        setEdit(res.data);
      })
      .catch(console.error);
  }, []);

  const saveInfo = async (e) => {
    e.preventDefault();
    if (uploading) {
      alert("Please wait for the image to finish uploading.");
      return;
    }
    const res = await API.put("/profile", edit);
    setUser(res.data);
    setEditOn(false);
    alert("Profile updated");
  };

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await API.patch("/profile/password", pw);
      alert(res.data.msg || "Password changed");
      setPw({ current: "", password: "" });
      setChangingPw(false);
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to change password");
    }
  };

  const Heading = ({ avatar, title }) => (
    <div className="profile-heading">
      <img
        src={avatar || "/default-avatar.png"}
        alt="avatar"
        onError={(e) => { e.target.src = "/default-avatar.png"; }}
      />
      <h2>{title}</h2>
    </div>
  );

  if (!user) return <p>Loading…</p>;

  if (!isEditing) {
    return (
      <div className="profile">
        <Heading avatar={user.avatar} title="My Profile" />
        <div className="profile-info">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
          {user.dob && !isNaN(new Date(user.dob)) && (
            <p><strong>DOB:</strong> {new Date(user.dob).toLocaleDateString()}</p>
          )}
          {user.address && <p><strong>Address:</strong> {user.address}</p>}
        </div>
        <div className="profile-actions">
          <button className="edit-button" onClick={() => setEditOn(true)}>Edit</button>
        </div>
        <div style={{marginTop:"5px"}} className="back-button-wrapper">
        <button style={{padding:"7px", backgroundColor:"grey"}} onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>
      </div>
      </div>
    );
  }

  return (
    <div className="profile-edit">
      <Heading avatar={edit.avatar} title="Edit Profile" />

      <form onSubmit={saveInfo} className="profile-form">
        <label>
          Name
          <input
            value={edit.name || ""}
            onChange={e => setEdit({ ...edit, name: e.target.value })}
            required
          />
        </label>

        <label>
          Phone
          <input
            value={edit.phone || ""}
            onChange={e => setEdit({ ...edit, phone: e.target.value })}
            placeholder="Phone number"
          />
        </label>

        <label>
          Date of Birth
          <input
            type="date"
            value={edit.dob?.slice(0, 10) || ""}
            onChange={e => setEdit({ ...edit, dob: e.target.value })}
          />
        </label>

        <label>
          Address
          <textarea
            value={edit.address || ""}
            onChange={e => setEdit({ ...edit, address: e.target.value })}
          />
        </label>

        <label>
          Avatar
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={async e => {
              if (!e.target.files.length) return;
              const file = e.target.files[0];
              const previewUrl = URL.createObjectURL(file);
              setEdit(prev => ({ ...prev, avatar: previewUrl }));
              setUploading(true);
              try {
                const uploadedUrl = await uploadImage(file);
                setEdit(prev => ({ ...prev, avatar: uploadedUrl }));
              } catch (err) {
                alert("Image upload failed");
              } finally {
                setUploading(false);
                fileInputRef.current.value = "";
              }
            }}
          />
        </label>

        {uploading && <p className="uploading">Uploading avatar…</p>}

        <div className="form-buttons">
          <button type="submit" disabled={uploading}>
            {uploading ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => {
              setEdit(user);
              setEditOn(false);
              fileInputRef.current.value = "";
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => setChangingPw(true)}
          >
            Change Password
          </button>
        </div>
      </form>

      {changingPw && (
        <form onSubmit={changePassword} className="password-form">
          <div className="change-password-container">
          <h3>Change Password</h3>

          <label>
            Current Password
            <input
              type="password"
              value={pw.current}
              onChange={e => setPw({ ...pw, current: e.target.value })}
              required
            />
          </label>

          <label>
            New Password
            <input
              type="password"
              value={pw.password}
              onChange={e => setPw({ ...pw, password: e.target.value })}
              required
            />
          </label>

          <label>
            Confirm Password
            <input
              type="password"
              value={pw.confirm || ""}
              onChange={e => setPw({ ...pw, confirm: e.target.value })}
              required
            />
          </label>

          {pw.password && pw.confirm && pw.password !== pw.confirm && (
            <p className="error">Passwords do not match</p>
          )}

          <div className="form-buttons">
            <button
              type="submit"
              disabled={pw.password !== pw.confirm}
            >
              Update Password
            </button>
            <button
              type="button"
              onClick={() => {
                setChangingPw(false);
                setPw({ current: "", password: "", confirm: "" });
              }}
            >
              Cancel
            </button>
          </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;
