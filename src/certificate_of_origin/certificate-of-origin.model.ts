import {
  Ref,
  prop,
  DocumentType,
  getModelForClass,
} from "@typegoose/typegoose";
import { CertificateOfOriginStatus } from "./enums/CertificateOfOriginStatus.enum";
export class CertificateOfOrigin {
  @prop({ required: false })
  hash: string;

  @prop({ required: false })
  file_path: string;

  @prop({ required: false })
  status: CertificateOfOriginStatus;
}
export type CertificateOfOriginDocument = DocumentType<CertificateOfOrigin>;
