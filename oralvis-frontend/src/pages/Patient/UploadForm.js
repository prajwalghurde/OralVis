import { useState } from "react";
import API from "../../api/axios";
import { toast } from "react-toastify";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
} from "@mui/material";

const UploadForm = () => {
  const [form, setForm] = useState({ name: "", email: "", note: "" });
  const [files, setFiles] = useState({
    upperImage: null,
    frontImage: null,
    lowerImage: null,
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.upperImage || !files.frontImage || !files.lowerImage)
      return toast.error("Please upload all three images");

    const data = new FormData();
    data.append("name", form.name);
    data.append("email", form.email);
    data.append("note", form.note);
    data.append("upperImage", files.upperImage);
    data.append("frontImage", files.frontImage);
    data.append("lowerImage", files.lowerImage);

    try {
      await API.post("/submission", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Submission uploaded successfully");
    } catch {
      toast.error("Error uploading submission");
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Card sx={{ maxWidth: 600, width: "100%" }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Upload Teeth Images
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
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
              margin="normal"
              label="Notes"
              name="note"
              multiline
              rows={3}
              value={form.note}
              onChange={handleChange}
            />

            <Grid container spacing={2} mt={1}>
              {["upperImage", "frontImage", "lowerImage"].map((key) => (
                <Grid item xs={12} sm={4} key={key}>
                  <Button variant="outlined" component="label" fullWidth>
                    {key.replace("Image", " Teeth")}
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setFiles({ ...files, [key]: e.target.files[0] })
                      }
                    />
                  </Button>
                  {files[key] && (
                    <Typography variant="caption">
                      {files[key].name}
                    </Typography>
                  )}
                </Grid>
              ))}
            </Grid>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ mt: 3 }}
            >
              Upload
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UploadForm;
