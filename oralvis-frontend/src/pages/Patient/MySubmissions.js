import { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Grid,
} from "@mui/material";

const statusColors = {
  uploaded: "default",
  annotated: "warning",
  reported: "success",
};

const MySubmissions = () => {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    API.get("/submission/my")
      .then((res) => setSubmissions(res.data))
      .catch(() => {});
  }, []);

  return (
    <Box m={3}>
      <Typography variant="h5" gutterBottom>
        My Submissions
      </Typography>
      {submissions.length === 0 ? (
        <Typography>No submissions yet.</Typography>
      ) : (
        <Grid container spacing={3}>
          {submissions.map((sub) => (
            <Grid item xs={12} md={6} key={sub._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{sub.name}</Typography>
                  <Typography variant="body2">{sub.email}</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {sub.note}
                  </Typography>
                  <Chip
                    label={sub.status}
                    color={statusColors[sub.status]}
                    sx={{ mt: 1 }}
                  />

                  {sub.pdfUrl && (
                    <Button
  href={sub.pdfUrl.startsWith("http") ? sub.pdfUrl : `${process.env.REACT_APP_API_URL}/${sub.pdfUrl}`}
  target="_blank"
  sx={{ mt: 2 }}
  variant="contained"
>
  Download Report
</Button>

                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MySubmissions;
