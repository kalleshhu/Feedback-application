import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Nav from "./Nav";
import "./Admin.css";

export default function Admin() {
  const [feedback, setFeedback] = useState([]);
  const [courses, setCourses]   = useState([]);
  const [users, setUsers]       = useState([]);

  const [showCourses, setShowCourses]   = useState(false);
  const [showAdd, setShowAdd]           = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [courseEdits, setCourseEdits]   = useState({ title: "", description: "" });

  const [showStudents, setShowStudents] = useState(false);

  const [newCourse, setNewCourse] = useState({ title: "", description: "" });
  const navigate = useNavigate();

  /* fetch everything on mount */
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

  /* ─── Course CRUD ─────────────────────────────────────────── */
  const handleAddCourse = async (e) => {
    e.preventDefault();
    await API.post("/courses", newCourse);
    setNewCourse({ title: "", description: "" });
    setShowAdd(false);
    pull();
  };

  const startEditCourse = (c) => {
    setEditingCourseId(c._id);
    setCourseEdits({ title: c.title, description: c.description || "" });
  };

  const saveEditCourse = async (e) => {
    e.preventDefault();
    const { title, description } = courseEdits;
    await API.put(`/courses/${editingCourseId}`, { title, description });
    setEditingCourseId(null);
    pull();
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    await API.delete(`/courses/${id}`);
    pull();
  };

  const deleteAllCourses = async () => {
    if (!window.confirm("Delete ALL courses? This cannot be undone.")) return;
    await Promise.all(courses.map(c => API.delete(`/courses/${c._id}`)));
    pull();
  };

  /* ─── Student management ─────────────────────────────────── */
  const toggleBlock = async (id) => {
    if (!window.confirm("Toggle block status for this student?")) return;
    await API.patch(`/users/${id}/block`);
    pull();
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this student account?")) return;
    await API.delete(`/users/${id}`);
    pull();
  };

  const deleteAllStudents = async () => {
    if (!window.confirm("Delete ALL student accounts?")) return;
    await Promise.all(users.map(u => API.delete(`/users/${u._id}`)));
    pull();
  };

  /* ─── Feedback trends helper ─────────────────────────────── */
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

  return (
    <div>
      <Nav />
      <h2 className="admin-heading">Admin Dashboard</h2>

      {/* Feedback summary */}
      <section>
        <h3>Feedback Count: {feedback.length}</h3>
        <button
          className="section-btn"
          onClick={() => navigate("/admin/feedbacks")}
        >
          View All Feedbacks
        </button>
      </section>

      {/* Course management */}
      <section>
        <h3>Course Management</h3>
        <button
          className="section-btn"
          onClick={() => setShowCourses(v => !v)}
        >
          {showCourses ? "Hide Courses" : "View All Courses"}
        </button>

        {showCourses && (
          <>
            <div className="course-actions-row">
              <button
                className="section-btn"
                onClick={() => setShowAdd(v => !v)}
              >
                {showAdd ? "Cancel Add" : "Add Course"}
              </button>
              <button
                className="danger-all"
                onClick={deleteAllCourses}
              >
                Delete All Courses
              </button>
            </div>

            {/* Add Course form */}
            {showAdd && (
              <form onSubmit={handleAddCourse} className="course-form">
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
                  {editingCourseId === c._id ? (
                    <form onSubmit={saveEditCourse} className="course-form-inline">
                      <input
                        type="text"
                        value={courseEdits.title}
                        onChange={e => setCourseEdits(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                      <input
                        type="text"
                        value={courseEdits.description}
                        onChange={e => setCourseEdits(prev => ({ ...prev, description: e.target.value }))}
                      />
                      <button type="submit">Save</button>
                      <button type="button" onClick={() => setEditingCourseId(null)}>
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <>
                      <span className="course-name">{c.title}</span>
                      <div>
                        <button onClick={() => startEditCourse(c)}>
                          Edit
                        </button>
                        <button
                          className="danger"
                          onClick={() => deleteCourse(c._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
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
        <div className="course-actions-row">
          <button
            className="section-btn"
            onClick={() => setShowStudents(v => !v)}
          >
            {showStudents ? "Hide Students" : "View All Students"}
          </button>
        </div>

        

        {showStudents && (
          <ul className="student-list">
            <button
            className="danger-all"
            onClick={deleteAllStudents}
          >
            Delete All Students
          </button>
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
                    className="danger"
                    onClick={() => deleteUser(u._id)}
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
