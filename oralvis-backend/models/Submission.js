const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  email: String,
  note: String,
  upperImageUrl: String,
  frontImageUrl: String,
  lowerImageUrl: String,
  upperAnnotatedUrl: String,    // new
  frontAnnotatedUrl: String,    // new
  lowerAnnotatedUrl: String,    // new
  annotationJson: { type: Object }, // store JSON per section
  pdfUrl: String,
  status: { type: String, enum: ["uploaded", "annotated", "reported"], default: "uploaded" },
}, { timestamps: true });

module.exports = mongoose.model("Submission", submissionSchema);
