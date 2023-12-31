import { Ref, getModelForClass, prop, DocumentType } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { User } from "../user/user.model";
import { InvoiceStatus } from "./enums/invoiceStatus.enum";

// class PackageInfo {
//     @prop({required: false})
//     description: string;

//     @prop({required: false})
//     quantity: string;

//     @prop({required: false})
//     unit: string;

//     @prop({required: false})
//     total: string;
// }

// export class Invoice {
//     @prop({required: false})
//     hash: string;

//     @prop({required: true, type: Types.ObjectId, ref: () => User})
//     importerID: Ref<User>

//     @prop({required: true, type: Types.ObjectId, ref: () => User})
//     exporterID: Ref<User>

//     @prop({required: true})
//     createdOn: string;

//     @prop({required: true})
//     shipmentMethod: string

//     @prop({required: true})
//     additionalInfo: string;

//     @prop({required: true})
//     packageInfo: PackageInfo;

//     @prop({required: true, enum: InvoiceStatus})
//     status: InvoiceStatus;
// }

export class Invoice {
    @prop({required: false})
    hash: string;

    @prop({required: true})
    file: string;

    @prop({required: true, enum: InvoiceStatus})
    status: InvoiceStatus;
}

export type InvoiceDocument = DocumentType<Invoice>;
// export const InvoiceModel = getModelForClass(Invoice)