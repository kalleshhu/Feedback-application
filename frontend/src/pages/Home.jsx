
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "./Navbar";
import "./Home.css";


const Home = () => {
  const [courses, setCourses]   = useState([]);
  const [form,    setForm]      = useState({ course: "", rating: "", message: "" });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  /* fetch courses */
  useEffect(() => {
    API.get("/courses").then(res => setCourses(res.data));
  }, []);

  /* create / update feedback */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await API.put(`/feedback/${editingId}`, form);
    } else {
      await API.post("/feedback", form);
    }
    setForm({ course: "", rating: "", message: "" });
    setEditingId(null);
    alert("Feedback saved!");
  };

  return (
    <>
      <Navbar />
      <div className="home-container">
        <h2>{editingId ? "Edit Feedback" : "Submit Feedback"}</h2>

        {/* Feedback Form */}
        <form onSubmit={handleSubmit} className="feedback-form">
          <select
            required
            value={form.course}
            onChange={(e) => setForm({ ...form, course: e.target.value })}
          >
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>{c.title}</option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            max="5"
            placeholder="Rating (1–5)"
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: e.target.value })}
            required
          />

          <textarea
            placeholder="Type your feedback..."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
          />

          <div className="form-actions">
            <button type="submit">{editingId ? "Update" : "Submit"}</button>
            {editingId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setEditingId(null);
                  setForm({ course: "", rating: "", message: "" });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* link to feedback list */}
        <button
          className="section-btn"
          style={{ marginTop: "2rem" }}
          onClick={() => navigate("/my-feedbacks")}
        >
          View My Feedbacks
        </button>
      </div>
    </>
  );
};
export default Home;

/* MY‑FEEDBACKS PAGE  – paginated list */
export function MyFeedbacks() {
  const [list, setList]       = useState([]);
  const [page, setPage]       = useState(1);
  const [totalPages, setTotal] = useState(1);
  const limit = 5;            

  const fetchPage = async (p) => {
    const res = await API.get("/feedback", { params: { page: p, limit } });
    setList(res.data.docs || res.data);     
    setTotal(res.data.totalPages || 1);
    setPage(p);
  };

  useEffect(() => { fetchPage(1); }, []);

  return (
    <>
      <Navbar />
      <div className="home-container">
        <h2>My Feedback (page {page})</h2>

        <ul className="feedback-list">
          {list.map((fb) => (
            <li key={fb._id} className="feedback-card">
              <div><strong>Course:</strong> {fb.course?.title || "N/A"}</div>
              <div><strong>Rating:</strong> {"⭐".repeat(fb.rating)}</div>
              <div><strong>Message:</strong> {fb.message}</div>
            </li>
          ))}
        </ul>

        {/* pagination controls */}
        <div className="form-actions" style={{ justifyContent: "center", marginTop: "1.5rem" }}>
          <button disabled={page === 1} onClick={() => fetchPage(page - 1)}>Prev</button>
          <span style={{ alignSelf: "center" }}>
            &nbsp;{page}/{totalPages}&nbsp;
          </span>
          <button disabled={page === totalPages} onClick={() => fetchPage(page + 1)}>Next</button>
        </div>
      </div>
    </>
  );
}
