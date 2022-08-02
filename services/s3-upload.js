require('dotenv').config();
const fs = require('fs');
const AWS = require('aws-sdk');

// initialize the S3 interface by passing our access keys
AWS.config.update({
    accessKeyId: process.env.S3ACCESSKEYID,
    secretAccessKey: process.env.S3SECRETACCESSKEY,
    region: 'us-west-1',
});

const s3 = new AWS.S3();

/**
 * Uploads a given file to s3 buckets
 * @param filePath: the path of the file: ex: 'uploads/66ce1075df07b65fa788930c55432519'
 * @param fileName: the file name: ex: 'e33be7e47d6843377189df0494aa1bc756df08029e90dc3958a3b4e8f784add5.ESP32-v2.bin'
 * @returns {Promise<ManagedUpload.SendData>} (with a link to the fireware file)
 */
async function upload(filePath, fileName) {
    const fileContent = fs.readFileSync(filePath);

    const params = {
        Bucket: process.env.S3BUCKETNAME,
        Key: fileName, // File name you want to save as in S3
        Body: fileContent,
    };
    // Uploading files to the bucket
    const stored = await s3.upload(params).promise();
    return stored;
}

/**
 * Delete an file in s3 buckets by its file name
 * @param fileName: the file name: ex: 'e33be7e47d6843377189df0494aa1bc756df08029e90dc3958a3b4e8f784add5.ESP32-v2.bin'
 * @returns {Promise<ManagedUpload.SendData>} (with a link to the fireware file)
 */
async function remove(fileName) {
    const params = {
        Bucket: process.env.S3BUCKETNAME,
        Key: fileName,
    };
    // Deleting files from the bucket
    const deleted = await s3.deleteObject(params).promise();
    return deleted;
}

module.exports = {upload, remove};
