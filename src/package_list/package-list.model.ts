import {
  Ref,
  prop,
  DocumentType,
  getModelForClass,
} from "@typegoose/typegoose";
import { PackageListStatus } from "./enums/packageListStatus.enum";
export class PackageList {
  @prop({ required: false })
  hash: string;

  @prop({ required: false })
  status: PackageListStatus;

  @prop({ required: false })
  file_path: string;

  @prop({ required: false })
  seller: string;

  @prop({ required: false })
  delivery_for: string;

  @prop({ required: false })
  delivery_from: string;

  @prop({ required: false })
  destination: string;

  @prop({ required: false })
  vessel: string;

  @prop({ required: false })
  lifting_date: string;

  @prop({ required: false })
  commodity: string;

  @prop({ required: false })
  price_term: string;

  @prop({ required: false })
  total_amount: string;

  @prop({ required: false })
  origin: string;
}
export type PackageListDocument = DocumentType<PackageList>;
