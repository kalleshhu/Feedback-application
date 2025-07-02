import { useEffect, useState } from "react";
import API from "../api/axios";

const Admin = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    API.get("/feedback/admin").then((res) => setFeedbacks(res.data));
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <h3>All Feedbacks</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Student</th>
            <th>Course</th>
            <th>Rating</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((fb) => (
            <tr key={fb._id}>
              <td>{fb.user.name}</td>
              <td>{fb.course.title}</td>
              <td>{fb.rating}</td>
              <td>{fb.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
