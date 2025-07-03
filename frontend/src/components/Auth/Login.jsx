// import { useState } from "react";
// import API from "../../api/axios";
// import { useAuth } from "../../context/AuthContext";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";



// const Login = () => {
//   const { login } = useAuth();
//   const [form, setForm] = useState({ email: "", password: "" });

//   const navigate = useNavigate();

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   const res = await API.post("/auth/login", form);
//   //   login(res.data);
//   // };
//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     const res = await API.post("/auth/login", form); // Make sure `form.email` and `form.password` are set
//     localStorage.setItem("token", res.data.token);
//     const role = res.data.user.role;
//     navigate(role === "ADMIN" ? "/admin" : "/home");
//   } catch (err) {
//     console.error("Login failed:", err.response?.data || err.message);
//     alert(err.response?.data?.msg || "Login failed");
//   }
// };


//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Login</h2>
//       <input
//         type="email"
//         placeholder="Email"
//         value={form.email}
//         onChange={(e) => setForm({ ...form, email: e.target.value })}
//         required
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={form.password}
//         onChange={(e) => setForm({ ...form, password: e.target.value })}
//         required
//       />
//       <button type="submit">Login</button>
//       <p>Don't have an account? <Link to="/signup">Signup</Link></p>
//     </form>
//   );
// };

// export default Login;


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);

      // 1️⃣ Save token + user in context
      login(res.data);                     // <‑‑ restores AuthContext

      // 2️⃣ Role‑based redirect (case‑exact)
      const role = res.data.user.role;     // e.g., "ADMIN" or "STUDENT"
      navigate(role === "ADMIN" ? "/admin" : "/home");
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />

      <button type="submit">Login</button>
      <p>
        Don't have an account? <Link to="/signup">Signup</Link>
      </p>
    </form>
  );
};

export default Login;
