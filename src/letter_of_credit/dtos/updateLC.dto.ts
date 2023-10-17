import { LetterOfCreditStatus } from "letter_of_credit/enums/letter-of-credit.enum";
import mongoose from "mongoose";

export class UpdateLCDto {
    salesContractID: mongoose.Types.ObjectId;
    invoiceID: mongoose.Types.ObjectId;
    billOfExchange: mongoose.Types.ObjectId;
    billOfLading: mongoose.Types.ObjectId;
    otherDocument: string;
    startDate: string;
    status: LetterOfCreditStatus
}