
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Nav from "./Nav";
import "./Admin.css";

export default function Admin() {
  const [feedback, setFeedback] = useState([]);
  const [courses,  setCourses]  = useState([]);
  const [users,    setUsers]    = useState([]);

  const [showCourses,  setShowCourses]  = useState(false);
  const [showAdd,      setShowAdd]      = useState(false);
  const [showStudents, setShowStudents] = useState(false);

  const [newCourse, setNewCourse] = useState({ title: "", description: "" });
  const navigate = useNavigate();

  /* fetch all data once on mount */
  useEffect(() => { pull(); }, []);
  const pull = async () => {
    const [f, c, u] = await Promise.all([
      API.get("/feedback/admin"),
      API.get("/courses"),
      API.get("/users"),
    ]);
    setFeedback(f.data);
    setCourses(c.data);
    setUsers(u.data);
  };

  /* course CRUD */
  const handleAddCourse = async (e) => {
    e.preventDefault();
    await API.post("/courses", newCourse);
    setNewCourse({ title: "", description: "" });
    setShowAdd(false);
    pull();
  };
  const deleteCourse = async (id) => { await API.delete(`/courses/${id}`); pull(); };

  /* student block / delete */
  const toggleBlock = async (id) => { await API.patch(`/users/${id}/block`); pull(); };
  const deleteUser  = async (id) => { await API.delete(`/users/${id}`); pull(); };

  /* avg rating helper */
  const avgRatings = () => {
    const buckets = {};
    feedback.forEach(fb => {
      if (!fb.course) return;
      (buckets[fb.course.title] ||= []).push(fb.rating);
    });
    return Object.entries(buckets).map(([course, ratings]) => ({
      course,
      avg: ratings.reduce((a, b) => a + b, 0) / ratings.length,
    }));
  };

  /* --------------- UI --------------- */
  return (
    <div>
      <Nav />
      <h2 className="admin-heading">Admin Dashboard</h2>

      {/* Feedback summary */}
      <section>
        <h3>Feedback Count: {feedback.length}</h3>
        <button className="section-btn" onClick={() => navigate("/admin/feedbacks")}>
          View All Feedbacks
        </button>
      </section>

      {/* Course management */}
      <section>
        <h3>Course Management</h3>
        <button className="section-btn" onClick={() => setShowCourses(v => !v)}>
          {showCourses ? "Hide Courses" : "View All Courses"}
        </button>

        {showCourses && (
          <>
            <button className="section-btn"
              onClick={() => setShowAdd(v => !v)}
              style={{ marginTop: "1rem" }}
            >
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

            <ul className="course-list">
              {courses.map(c => (
                <li key={c._id} className="course-row">
                  <span className="course-name">{c.title}</span>
                  <button
                    onClick={() => deleteCourse(c._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {/* Student management */}
      <section>
        <h3>Student Management</h3>
        <p>Total Registered Students: {users.length}</p>
        <button className="section-btn" onClick={() => setShowStudents(v => !v)}>
          {showStudents ? "Hide Students" : "View All Students"}
        </button>

        {showStudents && (
          <ul style={{ marginTop: "1rem" }}>
            {users.map(u => (
              <li key={u._id} className="student-row">
                <span>
                  {u.name} ({u.blocked ? "Blocked" : "Active"})
                </span>
                <div className="student-actions">
                  <button onClick={() => toggleBlock(u._id)}>
                    {u.blocked ? "Unblock" : "Block"}
                  </button>
                  <button
                    onClick={() => deleteUser(u._id)}
                    className="danger"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Feedback trends */}
      <section>
        <h3>Feedback Trends (Avg Rating / Course)</h3>
        <ul>
          {avgRatings().map(r => (
            <li key={r.course}>
              {r.course}: {r.avg.toFixed(2)} ⭐
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
