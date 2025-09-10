import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { toast } from "react-toastify";
import { Card, CardContent, TextField, Button, Typography, Box } from "@mui/material";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      toast.success("Login successful");
      navigate(data.role === "patient" ? "/upload" : "/admin/dashboard");
    } catch {
      toast.error("Invalid credentials");
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
      <Card sx={{ maxWidth: 400, width: "100%" }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Login</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              type="password"
              margin="normal"
              label="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
            <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }}>
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
