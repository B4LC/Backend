import {
  Ref,
  prop,
  DocumentType,
  getModelForClass,
} from "@typegoose/typegoose";
import { QuanQualCertificateStatus } from "./enums/QuanQualCertificate.enum";
export class QuantityQualityCertificate {
  @prop({ required: false })
  file_path: string;

  @prop({ required: false })
  hash: string;

  @prop({ required: false })
  status: QuanQualCertificateStatus;
}
export type QuantityQualityCertificateDocument =
  DocumentType<QuantityQualityCertificate>;
