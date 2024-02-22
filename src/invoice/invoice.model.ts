import {
  Ref,
  getModelForClass,
  prop,
  DocumentType,
} from "@typegoose/typegoose";
import { Types } from "mongoose";
import { User } from "../user/user.model";
import { InvoiceStatus } from "./enums/invoiceStatus.enum";

// export class PackageInfo {
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

//     @prop({required: true})
//     file: string;

//     @prop({required: false})
//     from_name: string

//     @prop({required: false})
//     from_address: string

//     @prop({required: false})
//     from_phone: string

//     @prop({required: false})
//     from_fax: string

//     @prop({required: false})
//     title: string

//     @prop({required: false})
//     no: string

//     @prop({required: false})
//     date: string

//     @prop({required: false})
//     consignee: string

//     @prop({required: false})
//     notify_party_name: string

//     @prop({required: false})
//     notify_party_address: string

//     @prop({required: false})
//     notify_party_phone: string

//     @prop({required: false})
//     notify_party_fax: string

//     @prop({required: false})
//     lc_no: string

//     @prop({required: false})
//     transport: string

//     @prop({required: false})
//     transport_no: string

//     @prop({required: false})
//     bill_no: string

//     @prop({required: false})
//     cont_seal_no: string

//     @prop({required: false})
//     from: string

//     @prop({required: false})
//     to: string

//     @prop({required: false})
//     packageInfo: PackageInfo

//     @prop({required: true, enum: InvoiceStatus})
//     status: InvoiceStatus;
// }

export class Invoice {
  @prop({ required: false })
  hash: string;

  @prop({ required: false })
  status: InvoiceStatus;
  
  @prop({ required: false })
  file_path: string;
  
  @prop({ required: false })
  table: object[];

  @prop({ required: false })
  from_name: string;
  
  @prop({ required: false })
  from_address: string;
  
  @prop({ required: false })
  from_phone: string;
  
  @prop({ required: false })
  from_fax: string;
  
  @prop({ required: false })
  title: string;
  
  @prop({ required: false })
  no: string;
  
  @prop({ required: false })
  date: string;
  
  @prop({ required: false })
  consignee: string;
  
  @prop({ required: false })
  notify_party_name: string;
  
  @prop({ required: false })
  notify_party_address: string;
  
  @prop({ required: false })
  notify_party_phone: string;
  
  @prop({ required: false })
  notify_party_fax: string;
  
  @prop({ required: false })
  lc_no: string;
  
  @prop({ required: false })
  transport: string;
  
  @prop({ required: false })
  transport_no: string;
  
  @prop({ required: false })
  bill_no: string;
  
  @prop({ required: false })
  cont_seal_no: string;
  
  @prop({ required: false })
  from: string;
  
  @prop({ required: false })
  to: string;
}

export type InvoiceDocument = DocumentType<Invoice>;
// export const InvoiceModel = getModelForClass(Invoice)
