// utils/pdfGenerator.js
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const s3 = require("../config/s3"); // AWS S3 setup
const isS3 = process.env.USE_S3 === "true";

async function loadImageBuffer(imagePath) {
  if (!imagePath) return null;
  try {
    if (imagePath.startsWith("http")) {
      // Use global fetch (Node 18+) to get image bytes
      const res = await fetch(imagePath);
      if (!res.ok) {
        console.warn("Failed to fetch image:", imagePath, "status:", res.status);
        return null;
      }
      const arrayBuffer = await res.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } else {
      // Local path (relative)
      if (fs.existsSync(imagePath)) {
        return fs.readFileSync(imagePath);
      }
      // Try relative to project root
      const alt = path.join(__dirname, "..", imagePath);
      if (fs.existsSync(alt)) {
        return fs.readFileSync(alt);
      }
      console.warn("Local image not found:", imagePath);
      return null;
    }
  } catch (err) {
    console.error("Error loading image buffer:", err);
    return null;
  }
}

const generatePDF = (submission) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Ensure uploads dir exists
      const uploadsDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

      const doc = new PDFDocument({ size: "A4", margin: 30 });
      const filename = `report-${submission._id}.pdf`;
      const localPath = path.join("uploads", filename).replace(/\\/g, "/");

      // Preload images (buffers) for PDF embedding
      const upperImg = submission.upperAnnotatedUrl || submission.upperImageUrl;
      const frontImg = submission.frontAnnotatedUrl || submission.frontImageUrl;
      const lowerImg = submission.lowerAnnotatedUrl || submission.lowerImageUrl;

      const [upperBuf, frontBuf, lowerBuf] = await Promise.all([
        loadImageBuffer(upperImg),
        loadImageBuffer(frontImg),
        loadImageBuffer(lowerImg),
      ]);

      const stream = fs.createWriteStream(localPath);
      doc.pipe(stream);

      // --- Header & layout (same as before) ---
      const purple = "#8e44ad";
      const lightGray = "#f3f4f6";
      const blue = "#007bff";
      const labelColors = {
        inflamed: "#e74c3c",
        malaligned: "#f1c40f",
        receded: "#7f8c8d",
        stains: "#d35400",
        attrition: "#16a085",
        crowns: "#9b59b6",
      };
      const titleFontSize = 20;
      const detailFontSize = 11;
      const labelFontSize = 10;

      doc.rect(0, 0, doc.page.width, 60).fill(purple);
      doc.fillColor("white").fontSize(titleFontSize).text("Oral Health Screening Report", 0, 20, {
        align: "center",
      });

      const phone = submission.patient?.phone || submission.phone || "N/A";
      const date = new Date(submission.createdAt).toLocaleDateString();

      doc.fillColor("black").fontSize(detailFontSize);
      doc.text(`Name: ${submission.name}`, 40, 70);
      doc.text(`Phone: ${phone}`, 200, 70);
      doc.text(`Date: ${date}`, 380, 70);
      doc.moveDown(2);

      // Box
      const boxY = doc.y;
      const boxHeight = 250;
      const boxX = 40;
      const boxWidth = doc.page.width - 80;
      const borderRadius = 12;

      doc.roundedRect(boxX, boxY - 5, boxWidth, boxHeight, borderRadius).fill(lightGray);
      doc.roundedRect(boxX, boxY - 5, boxWidth, boxHeight, borderRadius)
        .lineWidth(2)
        .strokeColor("#919494")
        .stroke();

      const lineY = boxY - 5 + boxHeight - 3;
      doc.moveTo(boxX + 5, lineY)
        .lineTo(boxX + boxWidth - 5, lineY)
        .lineWidth(6)
        .lineCap('round')
        .strokeColor("#e67e22")
        .stroke();

      doc.fillColor("black").fontSize(labelFontSize + 2).text("SCREENING REPORT:", 50, boxY + 10);

      // Images placement
      const imgWidth = 130;
      const imgHeight = 120;
      const spacing = 50;
      const startX = 50;
      const imgY = boxY + 35;

      function drawLabel(doc, text, x, y, width, color) {
        const radius = 12;
        doc.roundedRect(x, y, width, 20, radius).fill(color);
        doc.fillColor("white").fontSize(10).font("Helvetica-Bold")
          .text(text, x, y + 4, { width: width, align: "center" });
      }

      const pillColor = "#e74c3c";

      // Upper
      if (upperBuf) {
        try {
          doc.image(upperBuf, startX, imgY, { fit: [imgWidth, imgHeight] });
        } catch (e) {
          console.warn("Error embedding upper image:", e);
        }
      }
      drawLabel(doc, "Upper Teeth", startX, imgY + imgHeight + 10, imgWidth, pillColor);

      // Front
      const frontX = startX + imgWidth + spacing;
      if (frontBuf) {
        try {
          doc.image(frontBuf, frontX, imgY, { fit: [imgWidth, imgHeight] });
        } catch (e) {
          console.warn("Error embedding front image:", e);
        }
      }
      drawLabel(doc, "Front Teeth", frontX, imgY + imgHeight + 10, imgWidth, pillColor);

      // Lower
      const lowerX = frontX + imgWidth + spacing;
      if (lowerBuf) {
        try {
          doc.image(lowerBuf, lowerX, imgY, { fit: [imgWidth, imgHeight] });
        } catch (e) {
          console.warn("Error embedding lower image:", e);
        }
      }
      drawLabel(doc, "Lower Teeth", lowerX, imgY + imgHeight + 10, imgWidth, pillColor);

      // Legend
      let legendX = 60;
      const legendY = imgY + imgHeight + 45;
      const boxSize = 8;
      const spaceBetween = 80;

      Object.entries(labelColors).forEach(([key, color]) => {
        doc.rect(legendX, legendY, boxSize, boxSize).fill(color);
        doc.fillColor("black").fontSize(labelFontSize).text(capitalizeFirstLetter(key), legendX + boxSize + 4, legendY);
        legendX += spaceBetween;
      });

      doc.moveDown(6);

      // Recommendations
      doc.fontSize(labelFontSize + 2).fillColor(blue).text("TREATMENT RECOMMENDATIONS:", 50, doc.y);
      doc.moveDown(1);

      const recommendations = [
        { label: "Inflamed or Red gums", treatment: "Scaling.", key: "inflamed" },
        { label: "Malaligned", treatment: "Braces or Clear Aligner.", key: "malaligned" },
        { label: "Receded gums", treatment: "Gum Surgery.", key: "receded" },
        { label: "Stains", treatment: "Teeth cleaning and polishing.", key: "stains" },
        { label: "Attrition", treatment: "Filling/ Night Guard.", key: "attrition" },
        { label: "Crowns", treatment: "If the crown is loose or broken, better get it checked. Teeth coloured caps are the best ones.", key: "crowns" },
      ];

      doc.fontSize(labelFontSize);

      recommendations.forEach((rec) => {
        const startX = 50;
        const textX = 70;
        const squareSize = 8;

        doc.rect(startX, doc.y + 3, squareSize, squareSize).fill(labelColors[rec.key]);

        doc.fillColor("black")
          .font("Helvetica-Bold")
          .text(`${rec.label}: `, textX, doc.y - 2, { continued: true, width: 450 })
          .font("Helvetica")
          .text(rec.treatment, { width: 450, align: "left" });

        doc.moveDown(0.8);
      });

      doc.end();

      stream.on("finish", async () => {
        try {
          if (isS3) {
            // Upload to S3
            const fileContent = fs.readFileSync(localPath);
            const params = {
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: filename,
              Body: fileContent,
              ACL: "public-read",
            };
            const { Location } = await s3.upload(params).promise();
            // Remove local file (optional, keeps filesystem clean)
            try { fs.unlinkSync(localPath); } catch (e) {}
            resolve(Location); // S3 URL
          } else {
            resolve(localPath); // local storage path
          }
        } catch (err) {
          console.error("Error during PDF upload:", err);
          // fallback: return local path if exists
          if (fs.existsSync(localPath)) {
            resolve(localPath);
          } else {
            reject(err);
          }
        }
      });

      stream.on("error", (err) => {
        console.error("PDF write error:", err);
        reject(err);
      });
    } catch (err) {
      console.error("PDF generator top-level error:", err);
      reject(err);
    }
  });
};

function capitalizeFirstLetter(string) {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : "";
}

module.exports = generatePDF;
