require('dotenv').config();
const fs = require('fs');
const AWS = require('aws-sdk');

// initialize the S3 interface by passing our access keys
AWS.config.update({
    accessKeyId: process.env.S3ACCESSKEYID,
    secretAccessKey: process.env.S3SECRETACCESSKEY,
    region: "us-west-1"
});

const s3 = new AWS.S3();

/**
 * Uploads a given image to s3 buckets
 * Usage:         const data = await s3.uploadImage(filePath, fileName);
 * Data is in the format of:
 * {
 *   ETag: '"62eceddef87f59c2b51c269337b22d5d"',
 *   Location: 'https://v0-test-images.s3.us-west-1.amazonaws.com/test.jpeg',
 *   key: 'test.jpeg',
 *   Key: 'test.jpeg',
 *   Bucket: 'v0-test-images'
 * }
 * @param filePath: the path of the file: ex: /resources/license-check.jpeg
 * @param hashedFileName the file name: ex: dfjklsa342.jpg
 * @returns {Promise<ManagedUpload.SendData>} (with a link to the image)
 */
async function upload(filePath, hashedFileName) {
    const fileContent = fs.readFileSync(filePath);

    const params = {
        Bucket: process.env.S3BUCKETNAME,
        Key: hashedFileName, // File name you want to save as in S3
        Body: fileContent
    }
    // Uploading files to the bucket
    const stored = await s3.upload(params).promise()
    return stored;
}

async function remove(fileName) {
    const params = {
        Bucket: process.env.S3BUCKETNAME,
        Key: fileName
    }
    // Deleting files from the bucket
    const deleted = await s3.deleteObject(params).promise()
    return deleted;
}

module.exports={upload, remove};
