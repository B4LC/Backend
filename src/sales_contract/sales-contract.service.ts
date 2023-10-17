import { SalesContractDto } from "./dtos/createSalesContract.dto";
import { SalesContractRepository } from "./sales-contract.repository";

export class SalesContractService {
    private readonly salesContractRepository = new SalesContractRepository();
    async createSalesContract(createSalesContractDto: SalesContractDto) {
        return this.salesContractRepository.createSalesContract(createSalesContractDto);
    }
    async updateSalesContract(id: string, updateSalesContractDto: SalesContractDto) {
        return this.salesContractRepository.updateSalesContract(id, updateSalesContractDto);
    }
    async getAllSalesContract(userID: string) {
        return this.salesContractRepository.getAllSalesContract(userID);
    }
    async getSalesContractDetail(userID: string, salesContractID: string) {
        return this.salesContractRepository.getSalesContractDetail(userID, salesContractID);
    }
    async approveSalesContract(userID: string, salesContractID: string) {
        return this.salesContractRepository.approveSalesContract(userID, salesContractID);
    }
    async deleteSalesContract(userID: string, salesContractID: string) {
        return this.salesContractRepository.deleteSalesContract(userID, salesContractID);
    }
}