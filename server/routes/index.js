const { Router } = require("express");
const router = Router();

const { S3 } = require("../helpers");

router.get("/", (_, res) => {
  S3.listObjects(
    {
      Bucket: process.env.AWS_BUCKET,
    },
    (err, data) => {
      if (err) console.log(err, err.stack);
      else
        res.send(
          data["Contents"].map((file) => {
            return {
              name: file.Key,
              size: file.Size,
              lastModified: file.LastModified,
            };
          })
        );
    }
  );
});

module.exports = router;
