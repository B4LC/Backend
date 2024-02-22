import { FileRepository } from "./file.repository";
export class FileService {
    private readonly fileRepository = new FileRepository();
    async saveToCloud(file: Express.Multer.File) {
        return this.fileRepository.saveToCloud(file);
    }
}