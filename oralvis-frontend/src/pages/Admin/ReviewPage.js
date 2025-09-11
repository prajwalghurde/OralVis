import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";
import { toast } from "react-toastify";
import AnnotationCanvas from "../../components/AnnotationCanvas";
import { Box, Typography, Card, CardContent, Button, Grid } from "@mui/material";

const ReviewPage = () => {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    API.get(`/admin/submission/${id}`)
      .then((res) => setSubmission(res.data))
      .catch((err) => console.error("Error fetching submission:", err));
  }, [id]);

  const handleSaveAnnotation = async (section, json, dataUrl) => {
    try {
      const formData = new FormData();
      formData.append("annotationJson", JSON.stringify(json || {}));
      formData.append("section", section);

      if (dataUrl) {
        // Convert canvas image to file
        const res = await fetch(dataUrl);
        if (!res.ok) throw new Error("Failed to convert data URL to blob");
        const blob = await res.blob();
        const file = new File([blob], `${section}-annotated.png`, {
          type: "image/png",
        });
        formData.append("annotatedImage", file);
      } else {
        toast.info("Image export failed. Saving annotation JSON only.");
      }

      const { data } = await API.post(`/admin/annotate/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(`${section} annotation saved successfully`);
      setSubmission(data); // backend returns updated submission
    } catch (err) {
      console.error("Error saving annotation:", err);
      toast.error(`Error saving ${section} annotation`);
    }
  };

  const handleGeneratePDF = async () => {
    try {
      const { data } = await API.post(`/admin/generate-pdf/${id}`);
      toast.success("PDF generated successfully");

      const pdfUrl = data.pdfUrl.startsWith("http")
        ? data.pdfUrl
        : `${process.env.REACT_APP_API_URL}/${data.pdfUrl}`;

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
      <Typography>
        <b>Name:</b> {submission.name}
      </Typography>
      <Typography>
        <b>Email:</b> {submission.email}
      </Typography>
      <Typography>
        <b>Note:</b> {submission.note}
      </Typography>

      <Grid container spacing={3} mt={2}>
        {["upper", "front", "lower"].map((section) => {
          const imageUrl =
            submission[`${section}AnnotatedUrl`] ||
            submission[`${section}ImageUrl`];

          return (
            <Grid item xs={12} md={4} key={section}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {section.charAt(0).toUpperCase() + section.slice(1)} Teeth
                  </Typography>
                  {imageUrl ? (
                    <AnnotationCanvas
                      imageUrl={imageUrl} // ✅ trust backend absolute URL
                      onSave={(json, image) =>
                        handleSaveAnnotation(section, json, image)
                      }
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

