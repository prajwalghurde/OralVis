// routes/adminRoutes.js
const express = require("express");
const Submission = require("../models/Submission");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const generatePDF = require("../utils/pdfGenerator");
const s3 = require("../config/s3");
const multerS3 = require("multer-s3");

const isS3 = process.env.USE_S3 === "true";

// Multer setup
let upload;
if (isS3) {
  upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_BUCKET_NAME,
      acl: "public-read",
      metadata: (req, file, cb) => cb(null, { fieldName: file.fieldname }),
      key: (req, file, cb) => cb(null, Date.now().toString() + "-" + file.originalname),
    }),
  });
} else {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
  });
  upload = multer({ storage });
}

// Save annotation
router.post(
  "/annotate/:id",
  protect(["admin"]),
  upload.single("annotatedImage"),
  async (req, res) => {
    try {
      const { section, annotationJson } = req.body;
      const submission = await Submission.findById(req.params.id);
      if (!submission) return res.status(404).json({ message: "Submission not found" });

      submission.annotationJson = submission.annotationJson || {};

      // Safe parse
      try {
        submission.annotationJson[section] = annotationJson ? JSON.parse(annotationJson) : {};
      } catch (err) {
        console.error("❌ Invalid annotationJson:", annotationJson);
        submission.annotationJson[section] = {};
      }

      // Handle file -> save full URL
      if (req.file) {
        let imagePath;
        if (isS3) {
          imagePath = req.file.location;
        } else {
          const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
          imagePath = `${baseUrl}/${req.file.path.replace(/\\/g, "/")}`;
        }

        if (section === "upper") submission.upperAnnotatedUrl = imagePath;
        if (section === "front") submission.frontAnnotatedUrl = imagePath;
        if (section === "lower") submission.lowerAnnotatedUrl = imagePath;
      } else {
        console.warn("⚠️ No file received for section:", section);
      }

      submission.status = "annotated";
      await submission.save();

      console.log("✅ Annotation saved for section:", section, "submission:", submission._id);
      res.json(submission);
    } catch (error) {
      console.error("❌ Annotate error:", error);
      res.status(500).json({ message: "Error saving annotation", error });
    }
  }
);

// ... the rest remains same (submissions, submission/:id, generate-pdf) ...
router.get("/submissions", protect(["admin"]), async (req, res) => {
  try {
    const submissions = await Submission.find().populate("patient", "name email phone");
    res.json(submissions);
  } catch (error) {
    console.error("❌ Fetch submissions error:", error);
    res.status(500).json({ message: "Error fetching submissions" });
  }
});

router.get("/submission/:id", protect(["admin"]), async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id).populate("patient", "name email phone");
    if (!submission) return res.status(404).json({ message: "Submission not found" });
    res.json(submission);
  } catch (error) {
    console.error("❌ Fetch submission error:", error);
    res.status(500).json({ message: "Error fetching submission" });
  }
});

router.post("/generate-pdf/:id", protect(["admin"]), async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id).populate("patient");
    if (!submission) return res.status(404).json({ message: "Submission not found" });

    const pdfUrl = await generatePDF(submission);
    submission.pdfUrl = pdfUrl.replace(/\\/g, "/");
    submission.status = "reported";
    await submission.save();

    console.log("✅ PDF generated for submission:", submission._id);
    res.json({ message: "PDF generated", pdfUrl: submission.pdfUrl });
  } catch (error) {
    console.error("❌ PDF generation error:", error);
    res.status(500).json({ message: "Error generating PDF", error });
  }
});

module.exports = router;
