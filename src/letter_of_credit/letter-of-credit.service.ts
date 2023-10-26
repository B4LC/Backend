import { UpdateLCDto } from "./dtos/updateLC.dto";
import { LetterOfCreditStatus } from "./enums/letter-of-credit.enum";
import { LoCRepository } from "./letter-of-credit.repository";

export class LoCService {
    private readonly LoCRepository = new LoCRepository();

    async createLC(userID: string, salesContractID: string) {
        return this.LoCRepository.createLC(userID, salesContractID);
    }

    async updateLC(userID: string, LCID: string, updateLCDto: UpdateLCDto) {
        return this.LoCRepository.updateLC(userID, LCID, updateLCDto);
    }

    async getAllLC(userID: string) {
        return this.LoCRepository.getAllLC(userID);
    }

    async getLCDetail(userID: string, LCID: string) {
        return this.LoCRepository.getLCDetail(userID, LCID);
    }

    async approveLC(userID: string, LCID: string) {
        return this.LoCRepository.approveLC(userID, LCID);
    }

    async rejectLC(userID: string, LCID: string, reason: string) {
        return this.LoCRepository.rejectLC(userID, LCID, reason);
    }

    async updateLCStatus(userID: string, LCID: string, newStatus: LetterOfCreditStatus) {
        return this.LoCRepository.updateLCStatus(userID, LCID, newStatus);
    }

    async deleteLC(userID: string, LCID: string) {
        return this.LoCRepository.deleteLC(userID, LCID);
    }
}