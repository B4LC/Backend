import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

const uploadToCloudinary = (folder: string, file: Express.Multer.File) => {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream({resource_type: "auto", format: "pdf", folder: folder}, (error, result) => {
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
