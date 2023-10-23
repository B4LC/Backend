import { Ref, getModelForClass, prop, DocumentType } from "@typegoose/typegoose";
import { UserRole } from "./enums/user-role.enum";
import { ObjectId, Types } from "mongoose";
import { SalesContract } from "../sales_contract/sales-contract.model";
import { LetterOfCredit } from "../letter_of_credit/letter-of-credit.model";
import { Invoice } from "../invoice/invoice.model";
import { BillOfExchange } from "../bill_of_exchange/bill-of-exchange.model";
import { BillOfLading } from "../bill_of_lading/bill-of-lading.model";
export class User {
  @prop({required: false})
  contractId: string;
  
  @prop({ required: true })
  username: string;
  
  @prop({ required: true })
  email: string;
  
  @prop({ required: true })
  password: string;

  @prop({ required: false })
  phoneNumber: string;
  
  @prop({ required: false })
  address: string;
  
  @prop({ required: true, enum: UserRole })
  role: UserRole;

  @prop({type: Types.ObjectId, ref: () => LetterOfCredit})
  salesContracts: Ref<SalesContract>[];

  @prop({type: Types.ObjectId, ref: () => LetterOfCredit})
  letterOfCredits: Ref<LetterOfCredit>[];
}

export type UserDocument = DocumentType<User>;

