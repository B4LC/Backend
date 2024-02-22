import { Ref, getModelForClass, prop, DocumentType } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { User } from "../user/user.model";
import { SalesContractStatus } from "./enums/sales-contract.enum";

export class RequiredDocument {
    @prop({required: false})
    invoice: boolean

    @prop({required: false})
    billOfLading: boolean

    @prop({required: false})
    billOfExchange: boolean

    @prop({required: false})
    insurance: boolean

    @prop({required: false})
    qualityCertificate: boolean

    @prop({required: false})
    quantityCertificate: boolean

    @prop({required: false})
    packingList: boolean

    @prop({required: false})
    otherDocument: string
}
export class SalesContract {
    @prop({required: false})
    contractId: string;
    
    @prop({type: Types.ObjectId, required: true, ref: () => User})
    importerID: Ref<User>;

    @prop({type: Types.ObjectId, required: true, ref: () => User})
    exporterID: Ref<User>

    @prop({type: Types.ObjectId, required: true, ref: () => User})
    issuingBankID: Ref<User>

    @prop({type: Types.ObjectId, required: true, ref: () => User})
    advisingBankID: Ref<User>

    @prop({equired: true})
    commodity: string;

    @prop({required: true})
    price: string;

    @prop({required: true})
    paymentMethod: string;

    @prop({required: true})
    requiredDocument: RequiredDocument
    
    @prop({required: false})
    additionalInfo: string;

    @prop({required: true})
    deadline: string;

    @prop({required: true, enum: SalesContractStatus})
    status: SalesContractStatus;
}

export type SalesContractDocument = DocumentType<SalesContract>;
// export const SalesContractModel = getModelForClass(SalesContract);