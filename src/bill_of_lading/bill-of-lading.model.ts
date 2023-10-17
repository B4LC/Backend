import { Ref, getModelForClass, prop, DocumentType } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { User } from "../user/user.model";
import { BillType } from "./enums/bill-type.enum";
import { ChargeType } from "./enums/charge-type.enum";

class Shipper {
    @prop({required: false})
    name: string;

    @prop({required: false})
    address: string;

    @prop({required: false})
    phoneNumber: string;

    @prop({required: false})
    email: string;
}

class GoodsDescription {
    @prop({required: false})
    name: string;

    @prop({required: false})
    packageNum: number;

    @prop({required: false})
    weight: string;
}

export class BillOfLading {
    @prop({required: false})
    hash: string;

    @prop({required: true})
    bookingNo: string;

    @prop({required: true})
    voyageNo: string;

    @prop({required: true, enum: BillType})
    billType: BillType;

    @prop({required: true, enum: ChargeType})
    freightAndCharge: ChargeType;

    @prop({required: false, type: Shipper})
    shipper: Shipper;

    @prop({required: true, type: Types.ObjectId, ref: () => User})
    consignee: Ref<User>

    @prop({required: true, type: Types.ObjectId, ref: () => User})
    notifyParty: Ref<User>

    @prop({required: true})
    sealNo: string;

    @prop({required: true, type: GoodsDescription})
    goodsDescription: GoodsDescription

    @prop({required: false})
    portOfLoading: string;

    @prop({required: false})
    portOfDischarge: string;

    @prop({required: false})
    portOfDelivery: string;

    @prop({required: false})
    additionalInfo: string;
}

export type BoLDocument = DocumentType<BillOfLading>;
// export const BoLModel = getModelForClass(BillOfLading)