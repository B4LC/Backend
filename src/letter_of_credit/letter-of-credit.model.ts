import { Ref, prop, DocumentType, getModelForClass } from "@typegoose/typegoose";
import { BillOfExchange } from "../bill_of_exchange/bill-of-exchange.model";
import { BillOfLading } from "../bill_of_lading/bill-of-lading.model";
import { Invoice } from "../invoice/invoice.model";
import { Types } from "mongoose";
import { SalesContract } from "../sales_contract/sales-contract.model";
import { LetterOfCreditStatus } from "./enums/letter-of-credit.enum";

export class LetterOfCredit {
    @prop({required: false})
    lcId: string;

    @prop({type: Types.ObjectId, required: true, ref: () => SalesContract})
    salesContract: Ref<SalesContract>;

    @prop({type: Types.ObjectId, required: false, ref: () => Invoice})
    invoice: Ref<Invoice>

    @prop({type: Types.ObjectId, required: false, ref: () => BillOfExchange})
    billOfExchange: Ref<BillOfExchange>

    @prop({type: Types.ObjectId, required: false, ref: () => BillOfLading})
    billOfLading: Ref<BillOfLading>

    @prop({equired: false})
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