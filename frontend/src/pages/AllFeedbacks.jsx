import { useEffect, useState } from "react";
import API from "../api/axios";
import { CSVLink } from "react-csv";
import { useNavigate } from "react-router-dom";
import "./AllFeedbacks.css";

const LIMIT = 9;

export default function AllFeedbacks() {
  const [feedback, setFeedback] = useState([]);
  const [totalFeedback, setTotalFeedback] = useState(0);
  const [page, setPage] = useState(1);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState({ course: "", rating: "", student: "" });

  const [deleteMode, setDeleteMode] = useState(false);
  const [selected, setSelected] = useState(new Set());

  const navigate = useNavigate();

  const pull = async () => {
    const [f, c, u] = await Promise.all([
      API.get("/feedback/admin", { params: filter }),
      API.get("/courses"),
      API.get("/users"),
    ]);
    setFeedback(f.data);
    setCourses(c.data);
    setUsers(u.data);
    setPage(1);
    setSelected(new Set());
  };

  useEffect(() => {
    API.get("/feedback/admin").then((res) => setTotalFeedback(res.data.length));
  }, []);

  useEffect(() => {
    pull();
  }, [filter]);

  const handleSelect = (id) => {
    const updated = new Set(selected);
    updated.has(id) ? updated.delete(id) : updated.add(id);
    setSelected(updated);
  };

  const handleDeleteSelected = async () => {
    if (selected.size === 0) {
      alert("Please select at least one feedback to delete.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete the selected feedback(s)?")) {
      return;
    }
    try {
      await Promise.all(
        Array.from(selected).map((id) => API.delete(`/feedback/${id}`))
      );
      pull();
    } catch (err) {
      alert("Error deleting selected feedback(s).");
    }
  };

  const handleDeleteAll = async () => {
    if (feedback.length === 0) {
      alert("No feedbacks to delete.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete ALL feedback?")) {
      return;
    }
    try {
      await Promise.all(feedback.map((f) => API.delete(`/feedback/${f._id}`)));
      pull();
    } catch (err) {
      alert("Error deleting all feedback.");
    }
  };

  const totalPages = Math.max(1, Math.ceil(feedback.length / LIMIT));
  const paged = feedback.slice((page - 1) * LIMIT, page * LIMIT);

  return (
    <div>
      <h2 style={{ marginTop: "5%" }}>All Feedbacks</h2>
      <p>Total Feedbacks: {totalFeedback}</p>

      {/* Filters */}
      <section>
        <h3>Filters</h3>
        <select onChange={(e) => setFilter({ ...filter, course: e.target.value })}>
          <option value="">All Courses</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>
        <select onChange={(e) => setFilter({ ...filter, rating: e.target.value })}>
          <option value="">All Ratings</option>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select onChange={(e) => setFilter({ ...filter, student: e.target.value })}>
          <option value="">All Students</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>
        <CSVLink data={feedback} filename="feedback.csv" className="csv-link">
          Export CSV
        </CSVLink>
      </section>

      {/* Delete buttons */}
      <div className="delete-controls">
        {!deleteMode ? (
          <button
            className="danger-button"
            onClick={() => setDeleteMode(true)}
          >
            Delete Feedbacks
          </button>
        ) : (
          <>
            <button
              className="danger-button"
              onClick={handleDeleteSelected}
            >
              Delete Selected
            </button>
            <button
              className="danger-button"
              onClick={handleDeleteAll}
            >
              Delete All
            </button>
            <button
              className="cancel-button"
              onClick={() => setDeleteMode(false)}
            >
              Cancel
            </button>
          </>
        )}
      </div>

      {/* Feedback list */}
      <section>
        <h3>Feedback Count: {feedback.length}</h3>
        <div className="feedback-grid">
          {paged.map((fb) => (
            <div key={fb._id} className="feedback-item">
              {deleteMode && (
                <div className="check">
                <input
                  type="checkbox"
                  className="feedback-checkbox"
                  checked={selected.has(fb._id)}
                  onChange={() => handleSelect(fb._id)}
                />
                </div>
              )}
              <div>
                <strong>Name:</strong> {fb.user?.name || "N/A"}
              </div>
              <div>
                <strong>Course:</strong> {fb.course?.title || "N/A"}
              </div>
              <div>
                <strong>Stars:</strong>{" "}
                <span style={{ color: "#f5b301" }}>
                  {"⭐".repeat(fb.rating)}
                </span>
              </div>
              <div>
                <strong>Feedback:</strong> {fb.message}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination controls */}
        <div className="pagination-controls">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>
          <span>
            {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </section>

      {/* Back Button */}
      <div className="back-button-wrapper">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>
      </div>
    </div>
  );
}
