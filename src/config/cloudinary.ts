import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

const uploadToCloudinary = (file: Express.Multer.File) => {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const originalName = file.originalname.split('.').slice(0, -1).join('.');
    let stream = cloudinary.uploader.upload_stream({resource_type: "auto", format: "pdf", public_id: originalName}, (error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

export default uploadToCloudinary;
