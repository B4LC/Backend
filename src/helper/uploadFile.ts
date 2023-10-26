import { BoEModel, BoLModel, InvoiceModel } from "../model";
import saveToIPFS from "../config/ipfs";
import getContract from "./contract";
import { LoCDocument } from "../letter_of_credit/letter-of-credit.model";
import { InvoiceStatus } from "../invoice/enums/invoiceStatus.enum";
import { BoEStatus } from "../bill_of_exchange/enums/bill-of-exchange-status.enum";
import { BoLStatus } from "../bill_of_lading/enums/bill-of-lading.enum";

export async function uploadFile(filePath: string) {
    const cid = await saveToIPFS(filePath);
    return cid;
}

export async function uploadDocument(curLC: LoCDocument) {
    const curInvoice = await InvoiceModel.findOne({_id: curLC.invoice})
    const curBoE = await BoEModel.findOne({_id: curLC.billOfExchange})
    const curBoL = await BoLModel.findOne({_id: curLC.billOfLading})
    if(curInvoice.status == InvoiceStatus.APRROVED && curBoE.status == BoEStatus.APRROVED && curBoL.status == BoLStatus.APRROVED) {
        let contract = getContract();
        // console.log(contract);
        await contract.uploadDocument(parseInt(curLC.lcId), curInvoice.hash, curBoE.hash, curBoL.hash, "");
    }
}