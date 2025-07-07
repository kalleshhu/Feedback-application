import { useEffect, useState } from "react";
import API from "../api/axios";
import { CSVLink } from "react-csv";
import { useNavigate } from "react-router-dom";
import "./AllFeedbacks.css";

const LIMIT = 9;               

export default function AllFeedbacks() {
  const [feedback, setFeedback] = useState([]);   // filtered list
  const [totalFeedback, setTotalFeedback] = useState(0);    // total
  const [page, setPage] = useState(1);    // current page

  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState({ course: "", rating: "", student: "" });

  const navigate = useNavigate();

  /* ------------ fetch helpers ------------- */
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
  };

  /* total once */
  useEffect(() => {
    API.get("/feedback/admin").then(res => setTotalFeedback(res.data.length));
  }, []);

  /* refresh on filter */
  useEffect(() => { pull(); }, [filter]);

  /* paging */
  const totalPages = Math.max(1, Math.ceil(feedback.length / LIMIT));
  const paged = feedback.slice((page - 1) * LIMIT, page * LIMIT);

  /* UI */
  return (
    <div>
      <h2 style={{ marginTop: "5%" }}>All Feedbacks</h2>
      <p>Total Feedbacks: {totalFeedback}</p>

      {/* Filters */}
      <section>
        <h3>Filters</h3>

        <select onChange={e => setFilter({ ...filter, course: e.target.value })}>
          <option value="">All Courses</option>
          {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
        </select>

        <select onChange={e => setFilter({ ...filter, rating: e.target.value })}>
          <option value="">All Ratings</option>
          {[1,2,3,4,5].map(r => <option key={r} value={r}>{r}</option>)}
        </select>

        <select onChange={e => setFilter({ ...filter, student: e.target.value })}>
          <option value="">All Students</option>
          {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
        </select>

        <CSVLink data={feedback} filename="feedback.csv" className="csv-link">
          Export CSV
        </CSVLink>
      </section>

      {/* Paged list */}
      <section>
        <h3>Feedback Count: {feedback.length}</h3>

        <div className="feedback-grid">
          {paged.map(fb => (
            <div key={fb._id} className="feedback-item">
              <div><strong>Name:&nbsp;</strong>{fb.user?.name || "N/A"}</div>
              <div><strong>Course:&nbsp;</strong>{fb.course?.title || "N/A"}</div>
              <div>
                <strong>Stars:&nbsp;</strong>
                <span style={{ color: "#f5b301" }}>{"⭐".repeat(fb.rating)}</span>
              </div>
              <div><strong>Feedback:&nbsp;</strong>{fb.message}</div>
            </div>
          ))}
        </div>

        {/* pagination controls */}
        <div className="pagination-controls">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>
          <span>{page} / {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </section>

      {/* back */}
      <div className="back-button-wrapper">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>
      </div>
    </div>
  );
}
