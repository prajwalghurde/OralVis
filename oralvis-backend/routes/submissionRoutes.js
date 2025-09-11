// routes/submissionRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const Submission = require("../models/Submission");
const { protect } = require("../middleware/authMiddleware");
const multerS3 = require("multer-s3");
const s3 = require("../config/s3");

const router = express.Router();
const isS3 = process.env.USE_S3 === "true";

// Setup multer (S3 if configured, else local disk)
let upload;
if (isS3) {
  upload = multer({
    storage: multerS3({
      s3,
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

// Helper to get public URL for files
function getFileUrl(fileArray, req) {
  if (!fileArray) return null;
  const file = fileArray[0];
  if (isS3) return file.location;
  const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
  return `${baseUrl}/${file.path.replace(/\\/g, "/")}`;
}

// Patient uploads submission with 3 images
router.post(
  "/",
  protect(["patient"]),
  upload.fields([
    { name: "upperImage", maxCount: 1 },
    { name: "frontImage", maxCount: 1 },
    { name: "lowerImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      console.log("isS3:", isS3, "files:", req.files ? Object.keys(req.files) : "none");
      const { name, email, note } = req.body;

      const upperImage = getFileUrl(req.files?.["upperImage"], req);
      const frontImage = getFileUrl(req.files?.["frontImage"], req);
      const lowerImage = getFileUrl(req.files?.["lowerImage"], req);

      const submission = await Submission.create({
        patient: req.user.id,
        name,
        email,
        note,
        upperImageUrl: upperImage,
        frontImageUrl: frontImage,
        lowerImageUrl: lowerImage,
      });

      res.status(201).json(submission);
    } catch (error) {
      console.error("❌ Error uploading submission:", error);
      res.status(500).json({ message: "Error uploading submission", error: error.message || error });
    }
  }
);

// Get all submissions by patient
router.get("/my", protect(["patient"]), async (req, res) => {
  try {
    const submissions = await Submission.find({ patient: req.user.id });
    res.json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching submissions" });
  }
});

module.exports = router;
