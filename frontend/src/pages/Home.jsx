import { useEffect, useState } from "react";
import API from "../api/axios";

const Home = () => {
  const [feedback, setFeedback] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ course: "", rating: "", message: "" });

  const fetchData = async () => {
    const [res1, res2] = await Promise.all([
      API.get("/feedback"),
      API.get("/courses"),
    ]);
    setFeedback(res1.data);
    setCourses(res2.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/feedback", form);
    setForm({ course: "", rating: "", message: "" });
    fetchData();
  };

  return (
    <div>
      <h2>Submit Feedback</h2>
      <form onSubmit={handleSubmit}>
        <select
          required
          value={form.course}
          onChange={(e) => setForm({ ...form, course: e.target.value })}
        >
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
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
          placeholder="Message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        />
        <button type="submit">Submit</button>
      </form>

      <h3>My Feedback</h3>
      <ul>
        {feedback.map((fb) => (
          <li key={fb._id}>
            <strong>{fb.course.title}</strong>: {fb.rating}⭐ – {fb.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
