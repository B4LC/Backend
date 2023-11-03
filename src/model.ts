import { getModelForClass } from "@typegoose/typegoose";
import { BillOfExchange } from "./bill_of_exchange/bill-of-exchange.model";
import { BillOfLading } from "./bill_of_lading/bill-of-lading.model";
import { Invoice } from "./invoice/invoice.model";
import { SalesContract } from "./sales_contract/sales-contract.model";
import { User } from "./user/user.model";
import { LetterOfCredit } from "./letter_of_credit/letter-of-credit.model";

export const UserModel = getModelForClass(User);
export const InvoiceModel = getModelForClass(Invoice);
export const BoEModel = getModelForClass(BillOfExchange);
export const BoLModel = getModelForClass(BillOfLading);
export const SalesContractModel = getModelForClass(SalesContract);
export const LoCModel = getModelForClass(LetterOfCredit);