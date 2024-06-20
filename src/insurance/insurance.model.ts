import {
  Ref,
  prop,
  DocumentType,
  getModelForClass,
} from "@typegoose/typegoose";
import { InsuranceStatus } from "./enums/insuranceStatus.enum";
export class Insurance {
  @prop({ required: false })
  file_path: string;

  @prop({ required: false })
  status: InsuranceStatus;

  @prop({ required: false })
  hash: string;
}
export type InsuranceDocument = DocumentType<Insurance>;
