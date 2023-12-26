import { CreateInvoiceDto } from "./dtos/createInvoice.dto";
import { InvoiceRepository } from "./invoice.repository";

export class InvoiceService {
    private readonly invoiceRepository = new InvoiceRepository();
    async createInvoice(LCID: string, userID: string, createInvoice: CreateInvoiceDto) {
        return this.invoiceRepository.createInvoice(LCID, userID, createInvoice);
    }
    async getInvoiceDetail(invoiceID: string) {
        return this.invoiceRepository.getInvoiceDetail(invoiceID);
    }
    async approveInvoice(LCID: string, userID: string) {
        return this.invoiceRepository.approveInvoice(LCID, userID);
    }
    async rejectInvoice(LCID: string, userID: string) {
        return this.invoiceRepository.rejectInvoice(LCID, userID);
    }
}