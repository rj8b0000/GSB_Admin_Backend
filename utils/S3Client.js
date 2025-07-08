const { S3Client } = require("@aws-sdk/client-s3");

// Debug logging for AWS credentials
console.log(
  "AWS_ACCESS_KEY_ID:",
  process.env.AWS_ACCESS_KEY_ID
    ? process.env.AWS_ACCESS_KEY_ID.substring(0, 8) + "..."
    : "NOT SET",
);
console.log("AWS_REGION:", process.env.AWS_REGION);
console.log("S3_BUCKET_NAME:", process.env.S3_BUCKET_NAME);

const s3 = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

module.exports = s3;
