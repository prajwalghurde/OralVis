import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import UploadForm from "./pages/Patient/UploadForm";
import MySubmissions from "./pages/Patient/MySubmissions";
import Dashboard from "./pages/Admin/Dashboard";
import ReviewPage from "./pages/Admin/ReviewPage";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home"; 
// MUI Theme
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <ToastContainer />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Patient routes */}
          <Route
            path="/upload"
            element={<PrivateRoute role="patient"><UploadForm /></PrivateRoute>}
          />
          <Route
            path="/my-submissions"
            element={<PrivateRoute role="patient"><MySubmissions /></PrivateRoute>}
          />
          <Route path="/" element={<Home />} />

          {/* Admin routes */}
          
          <Route
            path="/admin/dashboard"
            element={<PrivateRoute role="admin"><Dashboard /></PrivateRoute>}
          />
          <Route
            path="/admin/review/:id"
            element={<PrivateRoute role="admin"><ReviewPage /></PrivateRoute>}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
