import { Ref, getModelForClass, prop, DocumentType } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { User } from "../user/user.model";
import { SalesContractStatus } from "./enums/sales-contract.enum";

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

    @prop({required: false})
    additionalInfo: string;

    @prop({required: true})
    deadline: string;

    @prop({required: true, enum: SalesContractStatus})
    status: SalesContractStatus;
}

export type SalesContractDocument = DocumentType<SalesContract>;
// export const SalesContractModel = getModelForClass(SalesContract);