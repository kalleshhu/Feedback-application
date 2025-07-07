import { useState, useEffect } from "react";
import API from "../api/axios";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const limit = 4;

export default function MyFeedbacks() {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTP] = useState(1);

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ rating: "", message: "" });

   const navigate = useNavigate();

  const fetchPage = async (p) => {
    try {
      const res = await API.get("/feedback", { params: { page: p, limit } });
      const { feedbacks, total, totalPages = Math.ceil(total / limit) } = res.data;
      setList(feedbacks);
      setTP(totalPages);
      setPage(p);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    }
  };

  useEffect(() => {
    fetchPage(1);
  }, []);

  const startEdit = (fb) => {
    setEditingId(fb._id);
    setEditData({ rating: fb.rating, message: fb.message });
  };

  const saveEdit = async () => {
    await API.put(`/feedback/${editingId}`, editData);
    setEditingId(null);
    await fetchPage(page);
  };

  const deleteFb = async (id) => {
    if (window.confirm("Delete this feedback?")) {
      await API.delete(`/feedback/${id}`);
      const newPage = page > 1 && list.length === 1 ? page - 1 : page;
      await fetchPage(newPage);
    }
  };

  return (
    <>
      <Navbar />
      <div className="home-container">
        <h2>My Feedbacks (Page {page})</h2>

        {list.length ? (
          <ul className="feedback-list">
            {list.map((fb) =>
              editingId === fb._id ? (
                <li key={fb._id} className="feedback-card">
                  <div><strong>Course:</strong> {fb.course?.title}</div>

                  <div style={{ marginTop: "0.5rem" }}>
                    <label><strong>Rating:</strong></label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={editData.rating}
                      onChange={(e) => setEditData({ ...editData, rating: e.target.value })}
                      style={{ width: "60px", marginLeft: "0.5rem" }}
                    />
                  </div>

                  <div style={{ marginTop: "0.5rem" }}>
                    <label><strong>Message:</strong></label>
                    <textarea
                      value={editData.message}
                      onChange={(e) => setEditData({ ...editData, message: e.target.value })}
                      style={{ width: "100%", marginTop: "0.3rem" }}
                    />
                  </div>

                  <div className="card-actions" style={{ marginTop: "0.5rem" }}>
                    <button onClick={saveEdit}>Save</button>
                    <button className="cancel-btn" onClick={() => setEditingId(null)}>
                      Cancel
                    </button>
                  </div>
                </li>
              ) : (
                <li key={fb._id} className="feedback-card">
                  <div><strong>Course:</strong> {fb.course?.title || "N/A"}</div>
                  <div><strong>Rating:</strong> {"⭐".repeat(fb.rating)}</div>
                  <div><strong>Feedback:</strong> {fb.message}</div>

                  <div className="card-actions" style={{ marginTop: "0.5rem" }}>
                    <button onClick={() => startEdit(fb)}>Edit</button>
                    <button className="delete-btn" onClick={() => deleteFb(fb._id)}>Delete</button>
                  </div>
                </li>
              )
            )}
          </ul>
        ) : (
          <p>No feedbacks found.</p>
        )}

        {/* Pagination */}
       <div
  className="pagination-controls"
>
  <button disabled={page === 1} onClick={() => fetchPage(page - 1)}>
    Prev
  </button>
  <span>{page} / {totalPages}</span>
  <button disabled={page === totalPages} onClick={() => fetchPage(page + 1)}>
    Next
  </button>
</div>

<div className="back-button-wrapper">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>
      </div>
      </div>
    </>
  );
}
