import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { toast } from "react-toastify";
import { Card, CardContent, TextField, Button, Typography, Box, MenuItem } from "@mui/material";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", role: "patient" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      toast.success("Registration successful");
      navigate("/login");
    } catch {
      toast.error("Error registering");
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
      <Card sx={{ maxWidth: 450, width: "100%" }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Register</Typography>
          <form onSubmit={handleSubmit}>
            <TextField fullWidth margin="normal" label="Name" name="name" value={form.name} onChange={handleChange} />
            <TextField fullWidth margin="normal" label="Email" name="email" value={form.email} onChange={handleChange} />
            <TextField fullWidth margin="normal" label="Phone" name="phone" value={form.phone} onChange={handleChange} />
            <TextField fullWidth type="password" margin="normal" label="Password" name="password" value={form.password} onChange={handleChange} />
            <TextField
              fullWidth
              select
              margin="normal"
              label="Role"
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <MenuItem value="patient">Patient</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
            <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }}>
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;
