import { Box, Typography } from "@mui/material";
import backgroundImage from "../image.png";
const Home = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        px: 2,
        color:"black",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
       // Ensures text is readable on darker images
      }}
    >
      <Typography variant="h4" gutterBottom>
        Welcome to the Oral Health Screening Portal!
      </Typography>
      <Typography variant="body1">
        Whether you're a patient checking your dental health, an admin managing reports, or a healthcare center reviewing submissions, this platform is here to assist you. Explore, annotate, and generate reports with ease.
      </Typography>
    </Box>
  );
};

export default Home;
