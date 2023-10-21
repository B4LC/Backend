import { Ref, prop, DocumentType, getModelForClass } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { User } from "../user/user.model";
import { BoEStatus } from "./enums/bill-of-exchange-status.enum";

export class BillOfExchange {
    // @prop({required: false})
    // hash: string;

    // @prop({required: false})
    // price: string;

    // @prop({required: false})
    // issuingDate: string;

    // @prop({required: true, type: Types.ObjectId, ref: () => User})
    // drawerInfo: Ref<User>;

    // @prop({required: true})
    // paymentDeadline: string;

    @prop({required: false})
    hash: string;

    @prop({required: true})
    file: string;

    @prop({required: true, enum: BoEStatus})
    status: BoEStatus;
}

export type BoEDocument = DocumentType<BillOfExchange>;
// export const BoEModel = getModelForClass(BillOfExchange);