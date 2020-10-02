const { Router } = require("express");
const router = Router();
const multer = require("multer");

const { storage } = require("../helpers");
const uploadController = require("../controllers/uploadController");

const upload = multer({ storage });

router.post("/upload", upload.single("video"), uploadController.index);

module.exports = router;
