import { Ref, prop, DocumentType, getModelForClass } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { User } from "../user/user.model";

export class BillOfExchange {
    @prop({required: false})
    hash: string;

    @prop({required: false})
    price: string;

    @prop({required: false})
    issuingDate: string;

    @prop({required: true, type: Types.ObjectId, ref: () => User})
    drawerInfo: Ref<User>;

    @prop({required: true})
    paymentDeadline: string;
}

export type BoEDocument = DocumentType<BillOfExchange>;
// export const BoEModel = getModelForClass(BillOfExchange);