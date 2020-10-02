const path = require("path");
const fs = require("fs");
const xa = require("xa");
const getDimensions = require("get-video-dimensions");

const {
  S3,
  resize,
  extractThumbnail,
  generateSizes,
  removeFile,
  currentTime,
} = require("../helpers");

module.exports = {
  index: async (req, res, _) => {
    const { originalname, mimetype } = req.file;

    const timeLog = {};

    timeLog.init = currentTime();

    const input = path.join(__dirname, `../tmp/uploads/${originalname}`);

    try {
      // Extract a thumbnail from a specific video frame
      extractThumbnail(input);

      // Upload the files with reduced dimensions first
      const { width, height } = await getDimensions(input);
      const sizes = generateSizes();

      // Resize files
      let files = await Promise.all(
        sizes.map(async (size) => {
          const output = await resize(size, input, `${size}_${originalname}`);
          const buffer = fs.readFileSync(output);
          xa.info(`Resize finished to ${output}`);
          return {
            buffer,
            size,
          };
        })
      );

      // Get the original file
      let original = {
        buffer: fs.readFileSync(input),
        size: `${width}x${height}`,
      };

      files = [original, ...files];

      // Upload to space
      await Promise.all(
        files.map(async ({ size, buffer }) => {
          try {
            const { Location, Key } = await S3.upload({
              Key: `${size}_${originalname}`,
              Body: Buffer.from(buffer, "binary"),
              ACL: "public-read",
              ContentType: mimetype,
            }).promise();
            xa.info(`Successful publication to ${Location}`);
            if (!Key.startsWith(original.size)) {
              removeFile(path.join(__dirname, `../tmp/uploads/${Key}`));
            }
            return { Location, Key };
          } catch (error) {
            console.error(error);
          }
        })
      );

      xa.success("Successful upload!");
      removeFile(input);
      timeLog.end = currentTime();
      console.log(timeLog);
    } catch (error) {
      console.error(error);
    }

    res.send(req.body);
  },
};
