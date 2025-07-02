
// import { Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import Profile from "./pages/Profile";
// import Admin from "./pages/Admin";
// import Login from "./components/Auth/Login";
// import Signup from "./components/Auth/Signup";
// import NotFound from "./pages/NotFound";
// import ProtectedRoute from "./routes/ProtectedRoute";

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Login />} />
//       <Route path="/signup" element={<Signup />} />

//       <Route element={<ProtectedRoute />}>
//         <Route path="/home" element={<Home />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/admin" element={<Admin />} />
//       </Route>

//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// }

// export default App;


import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected routes – any authenticated user (Student or Admin) */}
      <Route element={<ProtectedRoute /* default: allow all roles */ />}>
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Admin‑only route */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} /> }>
        <Route path="/admin" element={<Admin />} />
      </Route>

      {/* Catch‑all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;