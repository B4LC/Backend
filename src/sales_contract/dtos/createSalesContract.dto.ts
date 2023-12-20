import { RequiredDocument } from "sales_contract/sales-contract.model";

export class SalesContractDto {
    importer: string;
    exporter: string;
    issuingBank: string;
    advisingBank: string;
    commodity: string;
    price: string;
    paymentMethod: string;
    requiredDocument: RequiredDocument;
    additionalInfo: string;
    deadline: string;
}