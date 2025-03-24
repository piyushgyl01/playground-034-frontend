import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "./features/auth/authSlice";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OAuthCallback from "./components/OAuthCallback";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Posts from "./pages/Posts";
import PostDetail from "./features/post/PostDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import MfaSetup from "./pages/MfaSetup";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser()).catch((e) => {
      console.log(e);
    });
  });

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/auth/success" element={<OAuthCallback />}></Route>

        <Route path="/verify-email" element={<VerifyEmail />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
        <Route path="/reset-password" element={<ResetPassword />}></Route>

        <Route path="/" element={<Posts />}></Route>
        <Route path="/:id" element={<PostDetail />}></Route>

        <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/create" element={<CreatePost />}></Route>
        <Route path="/edit/:id" element={<EditPost />}></Route>
        <Route path="/mfa/setup" element={<MfaSetup />}></Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
