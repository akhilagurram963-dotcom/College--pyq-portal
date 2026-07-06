const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));
import cors from "cors"
app.use(cors({ origin: "*" }));

const DATA_FILE = "./data.json";

// Create data.json if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Home route
app.get("/", (req, res) => {
  res.send("PYQ Backend Running");
});

// Upload route
app.post("/upload", upload.single("pdf"), (req, res) => {
  try {
    const { subject, branch, year, semester } = req.body;

    const pdfData = {
      id: Date.now(),
      subject,
      branch,
      year,
      semester,
      pdf: req.file.filename,
    };

    const papers = JSON.parse(fs.readFileSync(DATA_FILE));

    papers.push(pdfData);

    fs.writeFileSync(DATA_FILE, JSON.stringify(papers, null, 2));

    res.json({
      success: true,
      message: "PDF Uploaded Successfully",
      data: pdfData,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Get all PDFs
app.get("/pdfs", (req, res) => {
  const papers = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(papers);
});

// Delete PDF
app.delete("/delete/:id", (req, res) => {
  const id = Number(req.params.id);

  let papers = JSON.parse(fs.readFileSync(DATA_FILE));

  const paper = papers.find((p) => p.id === id);

  if (paper) {
    const filePath = path.join("uploads", paper.pdf);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  papers = papers.filter((p) => p.id !== id);

  fs.writeFileSync(DATA_FILE, JSON.stringify(papers, null, 2));

  res.json({
    success: true,
    message: "Deleted Successfully",
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});