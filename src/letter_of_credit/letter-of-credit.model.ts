import { Ref, prop, DocumentType, getModelForClass } from "@typegoose/typegoose";
import { BillOfExchange } from "../bill_of_exchange/bill-of-exchange.model";
import { BillOfLading } from "../bill_of_lading/bill-of-lading.model";
import { Invoice } from "../invoice/invoice.model";
import { Types } from "mongoose";
import { SalesContract } from "../sales_contract/sales-contract.model";
import { LetterOfCreditStatus } from "./enums/letter-of-credit.enum";
import { QuantityQualityCertificate } from "../quantity_quality_certificate/quantity-quality-certificate.model";
import { CertificateOfOrigin } from "../certificate_of_origin/certificate-of-origin.model";
import { Insurance } from "../insurance/insurance.model";
import { PackageList } from "../package_list/package-list.model";

class DocumentFolder {
    @prop({type: Types.ObjectId, required: false, ref: () => Invoice})
    invoice: Ref<Invoice>;

    @prop({type: Types.ObjectId, required: false, ref: () => BillOfExchange})
    bill_of_exchange: Ref<BillOfExchange>;

    @prop({type: Types.ObjectId, required: false, ref: () => BillOfLading})
    bill_of_lading: Ref<BillOfLading>;

    @prop({type: Types.ObjectId, required: false, ref: () => QuantityQualityCertificate})
    quantity_quality_certificate: Ref<QuantityQualityCertificate>;

    @prop({type: Types.ObjectId, required: false, ref: () => CertificateOfOrigin})
    certificate_of_origin: Ref<CertificateOfOrigin>;
    
    @prop({type: Types.ObjectId, required: false, ref: () => Insurance})
    insurance: Ref<Insurance>;

    @prop({type: Types.ObjectId, required: false, ref: () => PackageList})
    package_list: Ref<PackageList>;
}

export class LetterOfCredit {
    @prop({required: false})
    LcAddress: string;

    @prop({type: Types.ObjectId, required: true, ref: () => SalesContract})
    salesContract: Ref<SalesContract>;

    @prop({type: Types.ObjectId, required: false, ref: () => Invoice})
    invoice: Ref<Invoice>

    @prop({type: Types.ObjectId, required: false, ref: () => BillOfExchange})
    billOfExchange: Ref<BillOfExchange>

    @prop({type: Types.ObjectId, required: false, ref: () => BillOfLading})
    billOfLading: Ref<BillOfLading>

    @prop({required: false})
    document: DocumentFolder;

    @prop({required: false})
    otherDocument: string;

    @prop({required: true})
    startDate: string;

    @prop({required: true, enum: LetterOfCreditStatus})
    status: LetterOfCreditStatus;

    @prop({required: false})
    rejectedReason: string;
}
export type LoCDocument = DocumentType<LetterOfCredit>;
// export const LCModel = getModelForClass(LetterOfCredit);