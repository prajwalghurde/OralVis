import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Paper,
  TableContainer,
} from "@mui/material";

const Dashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/admin/submissions")
      .then((res) => setSubmissions(res.data))
      .catch((err) => console.error("Error fetching submissions", err));
  }, []);

  return (
    <Box m={3}>
      <Typography variant="h5" gutterBottom>
        Admin Dashboard
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Patient Name</b></TableCell>
              <TableCell><b>Email</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Uploaded At</b></TableCell>
              <TableCell><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No submissions found.
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((sub) => (
                <TableRow key={sub._id}>
                  <TableCell>{sub.patient?.name || sub.name || "N/A"}</TableCell>
                  <TableCell>{sub.patient?.email || sub.email || "N/A"}</TableCell>
                  <TableCell>{sub.status}</TableCell>
                  <TableCell>
                    {new Date(sub.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => navigate(`/admin/review/${sub._id}`)}
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Dashboard;
