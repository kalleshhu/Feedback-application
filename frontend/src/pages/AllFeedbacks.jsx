import { useEffect, useState } from "react";
import API from "../api/axios";
import { CSVLink } from "react-csv";
import { useNavigate } from "react-router-dom";

export default function AllFeedbacks() {
  const [feedback, setFeedback] = useState([]);
   const [courses,   setCourses]   = useState([]);
    const [users,     setUsers]     = useState([]);
    const [filter,    setFilter]    = useState({ course: "", rating: "", student: "" });
  const navigate = useNavigate();

    const pull = async () => {
    const [f, c, u] = await Promise.all([
      API.get("/feedback/admin", { params: filter }),
      API.get("/courses"),
      API.get("/users")
    ]);
    setFeedback(f.data);
    setCourses(c.data);
    setUsers(u.data);
  };
  useEffect(() => { pull(); }, [filter]);


  useEffect(() => {
    API.get("/feedback/admin").then(res => setFeedback(res.data));
  }, []);

  return (
    <div>
      <h2>All Feedbacks</h2>
      <p>Total: {feedback.length}</p>

      
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
        <CSVLink data={feedback} filename="feedback.csv">Export CSV</CSVLink>
      </section>

      {/* Feedback list */}
      <section>
        <h3>Feedback Count: {feedback.length}</h3>
        <ul>
          {feedback.map(fb => (
            <li key={fb._id}>
              {fb.user?.name || "N/A"} ➜ {fb.course?.title || "N/A"}: {fb.rating}⭐ – {fb.message}
            </li>
          ))}
        </ul>
      </section>

      <button onClick={() => navigate(-1)} style={{ marginLeft: "1rem" }}>
        ← Back
      </button>

      {/* <ul style={{ marginTop: "1rem" }}>
        {feedback.map(fb => (
          <li key={fb._id}>
            {fb.user?.name || "N/A"} ➜ {fb.course?.title || "N/A"}:{" "}
            {fb.rating}⭐ – {fb.message}
          </li>
        ))}
      </ul> */}
    </div>
  );
}
