import { ContractEventRepository } from "./contract-event.repository";

export class ContractEventService {
    private readonly contractEventRepository = new ContractEventRepository();
    async getAllEventByLC(userID: string, LCID: string) {
        return this.contractEventRepository.getAllEventByLC(userID, LCID);
    }
}