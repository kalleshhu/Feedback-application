import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";
import AllFeedbacks from "./pages/AllFeedbacks";
import MyFeedbacks from "./pages/MyFeedbacks";
import ChangePassword from "./pages/ChangePassword";


function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-feedbacks" element={<MyFeedbacks />} />
      </Route>

      {/* Admin‑only route */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} /> }>
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/feedbacks" element={<AllFeedbacks />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Route>

      {/* Catch‑all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;