import {
  Ref,
  getModelForClass,
  prop,
  DocumentType,
} from "@typegoose/typegoose";
import { Types } from "mongoose";
import { User } from "../user/user.model";
import { SalesContractStatus } from "./enums/sales-contract.enum";

export class RequiredDocument {
  @prop({ required: false })
  invoice: boolean;

  @prop({ required: false })
  bill_of_lading: boolean;

  @prop({ required: false })
  bill_of_exchange: boolean;

  @prop({ required: false })
  insurance: boolean;

  @prop({ required: false })
  quantity_quality_certificate: boolean;

  @prop({ required: false })
  certificate_of_origin: boolean;

  @prop({ required: false })
  package_list: boolean;

  @prop({ required: false })
  otherDocument: string;
}
export class CommodityInfor {
  @prop({ required: false })
  description: string;

  @prop({ required: false })
  quantity: string;

  @prop({ required: false })
  unit: string;
}
export interface ShipmentInfor {
  from: string;
  to: string;
  partialShipment: boolean;
  transhipment: boolean;
  latestShipmentDate: string;
}
export class SalesContract {
  @prop({ type: Types.ObjectId, required: true, ref: () => User })
  importerID: Ref<User>;

  @prop({ type: Types.ObjectId, required: true, ref: () => User })
  exporterID: Ref<User>;

  @prop({ type: Types.ObjectId, required: true, ref: () => User })
  issuingBankID: Ref<User>;

  @prop({ type: Types.ObjectId, required: true, ref: () => User })
  advisingBankID: Ref<User>;

  @prop({ required: false })
  commodity: CommodityInfor[];

  @prop({ required: false })
  price: string;

  @prop({ required: false })
  currency: string;

  @prop({ required: false })
  paymentMethod: string;

  @prop({ required: false })
  requiredDocument: RequiredDocument;

  @prop({ required: false })
  shipmentInformation: ShipmentInfor;

  @prop({ required: false })
  additionalInfo: string;

  @prop({ required: false })
  deadline: string;

  @prop({ required: false })
  token: string;

  @prop({ required: true, enum: SalesContractStatus })
  status: SalesContractStatus;

  @prop({ required: false })
  rejectedReason: string;
}

export type SalesContractDocument = DocumentType<SalesContract>;
// export const SalesContractModel = getModelForClass(SalesContract);
