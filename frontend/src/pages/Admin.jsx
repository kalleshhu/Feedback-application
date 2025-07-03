import { useEffect, useState } from "react";
import API from "../api/axios";
import { CSVLink } from "react-csv";

export default function Admin() {
  const [feedback,  setFeedback]  = useState([]);
  const [courses,   setCourses]   = useState([]);
  const [users,     setUsers]     = useState([]);
  const [filter,    setFilter]    = useState({ course: "", rating: "", student: "" });
  const [showAdd,   setShowAdd]   = useState(false);
  const [newCourse, setNewCourse] = useState({ title: "", description: "" });

  /* ─── Fetch all data ─── */
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

  /* ─── Course CRUD ─── */
  const handleAddCourse = async (e) => {
    e.preventDefault();
    await API.post("/courses", newCourse);
    setNewCourse({ title: "", description: "" });
    setShowAdd(false);
    pull();
  };
  const deleteCourse = async (id) => { await API.delete(`/courses/${id}`); pull(); };

  /* ─── User block / delete ─── */
  const toggleBlock = async (id) => { await API.patch(`/users/${id}/block`); pull(); };
  const deleteUser  = async (id) => { await API.delete(`/users/${id}`); pull(); };

  /* ─── Avg ratings helper ─── */
  const avgRatings = () => {
    const bucket = {};
    feedback.forEach(fb => {
      if (!fb.course) return;
      bucket[fb.course.title] = bucket[fb.course.title] || [];
      bucket[fb.course.title].push(fb.rating);
    });
    return Object.entries(bucket).map(([course, ratings]) => ({
      course,
      avg: ratings.reduce((a, b) => a + b, 0) / ratings.length
    }));
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

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

      {/* Course Management */}
      <section>
        <h3>Course Management</h3>
        <button onClick={() => setShowAdd(v => !v)}>
          {showAdd ? "Cancel" : "Add Course"}
        </button>
        {showAdd && (
          <form onSubmit={handleAddCourse} style={{ margin: "1rem 0" }}>
            <input
              type="text"
              placeholder="Course Title"
              value={newCourse.title}
              onChange={e => setNewCourse({ ...newCourse, title: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newCourse.description}
              onChange={e => setNewCourse({ ...newCourse, description: e.target.value })}
            />
            <button type="submit">Save Course</button>
          </form>
        )}
        <ul>
          {courses.map(c => (
            <li key={c._id}>
              {c.title}
              <button onClick={() => deleteCourse(c._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>

      {/* Student Management */}
      <section>
        <h3>Student Management ({users.length})</h3>
        <ul>
          {users.map(u => (
            <li key={u._id}>
              {u.name} ({u.blocked ? "Blocked" : "Active"})
              <button onClick={() => toggleBlock(u._id)}>
                {u.blocked ? "Unblock" : "Block"}
              </button>
              <button onClick={() => deleteUser(u._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>

      {/* Feedback Trends */}
      <section>
        <h3>Feedback Trends (Avg Rating / Course)</h3>
        <ul>
          {avgRatings().map(r => (
            <li key={r.course}>{r.course}: {r.avg.toFixed(2)} ⭐</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
