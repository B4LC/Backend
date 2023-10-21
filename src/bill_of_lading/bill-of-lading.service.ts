import { BoLRepository } from "./bill-of-lading.repository";

export class BoLService {
    private readonly BoLRepository = new BoLRepository();
    async createBoL(LCID: string, userID: string, file: Express.Multer.File) {
        return this.BoLRepository.createBoL(LCID, userID, file);
    }
    async getBoLDetail(BoLID: string) {
        return this.BoLRepository.getBoLDetail(BoLID);
    }
    async approveBoL(LCID: string, userID: string) {
        return this.BoLRepository.approveBoL(LCID, userID);
    }
    async rejectBoL(LCID: string, userID: string) {
        return this.BoLRepository.rejectBoL(LCID, userID);
    }
}