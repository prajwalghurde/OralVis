import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <AppBar position="static" color="primary" sx={{ mb: 3 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, cursor: "pointer" }} onClick={() => navigate("/")}>
          OralVis Portal
        </Typography>

        {!token && (
          <>
            <Button color="inherit" onClick={() => navigate("/login")}>Login</Button>
            <Button color="inherit" onClick={() => navigate("/register")}>Register</Button>
          </>
        )}

        {token && role === "patient" && (
          <>
            <Button color="inherit" onClick={() => navigate("/upload")}>Upload</Button>
            <Button color="inherit" onClick={() => navigate("/my-submissions")}>My Submissions</Button>
          </>
        )}

        {token && role === "admin" && (
          <Button color="inherit" onClick={() => navigate("/admin/dashboard")}>Dashboard</Button>
        )}

        {token && (
          <Button variant="outlined" color="error" onClick={handleLogout} sx={{ ml: 2 }}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
