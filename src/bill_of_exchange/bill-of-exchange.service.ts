import { BoERepository } from "./bill-of-exchange.repository";

export class BoEService {
    private readonly BoERepository = new BoERepository();
    async createBoE(LCID: string, userID: string, file: Express.Multer.File) {
        return this.BoERepository.createBoE(LCID, userID, file);
    }
    async getBoEDetail(BoEID: string) {
        return this.BoERepository.getBoEDetail(BoEID);
    }
    async approveBoE(LCID: string, userID: string) {
        return this.BoERepository.approveBoE(LCID, userID);
    }
    async rejectBoE(LCID: string, userID: string) {
        return this.BoERepository.rejectBoE(LCID, userID);
    }
}