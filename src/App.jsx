import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import FormList from "./pages/FormList";
import FormSubmission from "./pages/FormSubmission";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import { useSelector } from "react-redux";
import Layout from "./components/Layout";

export default function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route element={<Layout />}>
      
      <Route  path="/profile" element={
          isAuthenticated ? <Profile /> : <Navigate to="/login" replace />
        }/>
        <Route  path="/form" element={
          isAuthenticated ? <FormSubmission /> : <Navigate to="/login" replace />
        }/>
        <Route  path="/form-list" element={
          isAuthenticated ? <FormList /> : <Navigate to="/login" replace />
        }/>


      <Route
        path="*"
        element={
          isAuthenticated ? (
            <Navigate to="/profile" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      /></Route>

      
    </Routes>
  );
}
