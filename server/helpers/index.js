const AWS = require("aws-sdk");

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

module.exports = {
  S3,
};
