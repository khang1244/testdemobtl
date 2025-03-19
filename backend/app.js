const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const contactsRouter = require("./app/routes/contact.route");
const ApiError = require("./app/api-error");

const app = express();

// Cấu hình multer để lưu file vào thư mục "uploads"
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Thư mục lưu trữ
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Tên file
  },
});

// Khởi tạo multer với cấu hình lưu trữ
const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());

// API upload ảnh
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
  res.status(200).send({
    message: "File uploaded successfully",
    file: { filename: req.file.filename, url: imageUrl },
  });
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to contact book application." });
});

app.use("/api/contacts", contactsRouter);

// handle 404 response
app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});

// define error-handling middleware
app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
