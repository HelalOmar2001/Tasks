const fs = require("fs");
const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");

const app = express();

const upload = multer({ dest: "uploads/" });

app.use(express.json());

// @desc    Upload excel file and get data from it based on ID
// @route   GET /api/getData
// @access  Public
app.get("/api/getData", upload.single("file"), (req, res) => {
  const workbook = xlsx.readFile(req.file.path);
  const sheet_name_list = workbook.SheetNames;
  const xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  const dataRows = xlData.filter((row) => row.ID == req.body.id * 1);
  fs.unlink(req.file.path, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
    } else {
      console.log("File deleted successfully");
    }
  });
  res.json({ numberOfRows: dataRows.length, result: dataRows });
});

// server listening on port 3000
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
