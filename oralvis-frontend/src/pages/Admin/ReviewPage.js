import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API, { API_BASE_URL } from "../../api/axios";
import { toast } from "react-toastify";
import AnnotationCanvas from "../../components/AnnotationCanvas";
import { Box, Typography, Card, CardContent, Button, Grid } from "@mui/material";

const ReviewPage = () => {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);

  // Fetch submission
  useEffect(() => {
    API.get(`/admin/submission/${id}`)
      .then((res) => setSubmission(res.data))
      .catch((err) => console.error("Error fetching submission:", err));
  }, [id]);

  // Save annotation
  const handleSaveAnnotation = async (section, json, dataUrl) => {
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `${section}-annotated.png`, { type: "image/png" });

      const formData = new FormData();
      formData.append("annotationJson", JSON.stringify(json));
      formData.append("annotatedImage", file);
      formData.append("section", section);

      await API.post(`/admin/annotate/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(`${section} annotation saved successfully`);

      // Refresh submission to get updated annotated URLs
      const updated = await API.get(`/admin/submission/${id}`);
      setSubmission(updated.data);
    } catch (err) {
      console.error(err);
      toast.error(`Error saving ${section} annotation`);
    }
  };

  // Generate PDF
  const handleGeneratePDF = async () => {
    try {
      const { data } = await API.post(`/admin/generate-pdf/${id}`);
      toast.success("PDF generated successfully");

      const pdfUrl =
        data.pdfUrl && data.pdfUrl.startsWith("http")
          ? data.pdfUrl
          : `${API_BASE_URL}/${data.pdfUrl}`;

      window.open(pdfUrl, "_blank");
    } catch (err) {
      console.error(err);
      toast.error("Error generating PDF");
    }
  };

  if (!submission) return <Typography>Loading...</Typography>;

  return (
    <Box m={3}>
      <Typography variant="h5" gutterBottom>
        Review Submission
      </Typography>
      <Typography><b>Name:</b> {submission.name}</Typography>
      <Typography><b>Email:</b> {submission.email}</Typography>
      <Typography><b>Note:</b> {submission.note}</Typography>

      <Grid container spacing={3} mt={2}>
        {["upper", "front", "lower"].map((section) => {
          const imageUrl =
            submission[`${section}AnnotatedUrl`] || submission[`${section}ImageUrl`];

          return (
            <Grid item xs={12} md={4} key={section}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {section.charAt(0).toUpperCase() + section.slice(1)} Teeth
                  </Typography>
                  {imageUrl ? (
                    <AnnotationCanvas
                      imageUrl={
                        imageUrl.startsWith("http")
                          ? imageUrl
                          : `${API_BASE_URL}/${imageUrl}`
                      }
                      onSave={(json, image) => handleSaveAnnotation(section, json, image)}
                    />
                  ) : (
                    <Typography color="text.secondary">
                      No image uploaded
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Button
        variant="contained"
        color="success"
        sx={{ mt: 3 }}
        onClick={handleGeneratePDF}
      >
        Generate PDF Report
      </Button>
    </Box>
  );
};

export default ReviewPage;
