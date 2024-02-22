import uploadToCloudinary from "../config/cloudinary";

export class FileRepository {
    async saveToCloud(file: Express.Multer.File) {
        const result = await uploadToCloudinary(file);
        return result.secure_url;
    }
}