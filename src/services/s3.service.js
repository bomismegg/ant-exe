const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = require('../configs/s3.config');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class S3Service {
    // Upload a file to S3
    static async uploadFile(filePath, bucketName = process.env.AWS_BUCKET_NAME) {
        try {
            const fileContent = fs.readFileSync(filePath);
            const fileName = `${uuidv4()}-${path.basename(filePath)}`;
    
            // S3 upload parameters
            const params = {
                Bucket: bucketName,
                Key: fileName,
                Body: fileContent,
                ACL: 'public-read', // Set file to be publicly readable
            };
    
            // Use the PutObjectCommand in v3
            const command = new PutObjectCommand(params);
            const data = await s3Client.send(command);
    
            console.log(`File uploaded successfully. ${data.Location}`);
    
            // Remove local file after upload
            fs.unlinkSync(filePath);  // This removes the file from the uploads directory
    
            return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`; // Return the S3 file URL
        } catch (err) {
            console.error('Error uploading file: ', err);
            throw new Error('Failed to upload file');
        }
    }

    // Download a file from S3
    static async downloadFile(fileKey, downloadPath, bucketName = process.env.AWS_BUCKET_NAME) {
        try {
            const params = {
                Bucket: bucketName,
                Key: fileKey // Name of the file in S3
            };

            // Use the GetObjectCommand in v3
            const command = new GetObjectCommand(params);
            const data = await s3Client.send(command);

            fs.writeFileSync(downloadPath, data.Body);
            console.log(`File downloaded successfully to ${downloadPath}`);
        } catch (err) {
            console.error('Error downloading file: ', err);
            throw new Error('Failed to download file');
        }
    }

    // Delete a file from S3
    static async deleteFile(fileKey, bucketName = process.env.AWS_BUCKET_NAME) {
        try {
            const params = {
                Bucket: bucketName,
                Key: fileKey // Name of the file in S3
            };

            const command = new DeleteObjectCommand(params);
            await s3Client.send(command);

            console.log(`File deleted successfully. Key: ${fileKey}`);
        } catch (err) {
            console.error('Error deleting file: ', err);
            throw new Error('Failed to delete file');
        }
    }
}

module.exports = S3Service;
