const AWS = require("aws-sdk");
const multer = require("multer");
const util = require("util");
const path = require("path");
const fs = require("fs");
const xa = require("xa");
const execFile = util.promisify(require("child_process").execFile);

AWS.config.setPromisesDependency(require("bluebird"));

const S3 = new AWS.S3({
  apiVersion: "2006-03-01",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT,
  params: {
    Bucket: process.env.AWS_BUCKET,
  },
});

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, path.join(__dirname, "../tmp/uploads"));
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const resize = async (size, input, output) => {
  const fileName = path.join(__dirname, `../tmp/uploads/${output}`);

  const { error, stdout, stderr } = await execFile("ffmpeg", [
    "-i",
    input,
    "-s",
    size,
    "-c:v",
    "libx264",
    "-qp",
    16,
    fileName,
  ]);

  if (error) throw error;

  xa.info(stdout);
  xa.info(stderr);

  return fileName;
};

const extractThumbnail = async (input) => {
  const { error, stdout, stderr } = await execFile("ffmpeg", [
    "-i",
    input,
    "-ss",
    "00:00:30.000",
    "-vframes",
    1,
    path.join(__dirname, `../tmp/uploads/thumbnail.png`),
  ]);

  if (error) throw error;

  xa.info(stdout);
  xa.info(stderr);
};

const generateSizes = () => {
  return ["854x480", "640x360", "426x240"];
};

const removeFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (err) => {
      if (err) return reject(err);
      xa.info(`Successfully removed from ${path}`);
      resolve();
    });
  });
};

const currentTime = () => {
  let date = new Date();
  let minute = date.getMinutes();
  let hour = date.getHours();
  let seconds = date.getSeconds();
  return [hour, minute, seconds].map((i) => (i < 10 ? "0" + i : i)).join(":");
};

module.exports = {
  S3,
  storage,
  resize,
  extractThumbnail,
  generateSizes,
  removeFile,
  currentTime,
};
