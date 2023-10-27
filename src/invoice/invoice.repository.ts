import { InvoiceModel, LoCModel, SalesContractModel } from "../model";
import { NotFoundError, UnauthorizedError } from "routing-controllers";
import { InvoiceStatus } from "./enums/invoiceStatus.enum";
import { uploadDocument, uploadFile } from "../helper/uploadFile";
require("dotenv").config();
import uploadToCloudinary from "../config/cloudinary";

export class InvoiceRepository {
  async createInvoice(LCID: string, userID: string, file: Express.Multer.File) {
    const curLC = await LoCModel.findById(LCID);
    const curSalesContract = await SalesContractModel.findById(
      curLC.salesContract
    );
    if (
      userID !== curSalesContract.importerID.toString() &&
      userID !== curSalesContract.exporterID.toString()
    ) {
      throw new UnauthorizedError("Unauthorized to upload document");
    }
    
    const result = await uploadToCloudinary(curLC._id.toString(), file);
    if (curLC.invoice) {
      const curInvoice = await InvoiceModel.findById(curLC.invoice);
      curInvoice.file = result.secure_url;
      await curInvoice.save();
      return { message: "Update invoice successfully" };
    } else {
      const newInvoice = new InvoiceModel({
        file: result.secure_url,
        status: InvoiceStatus.USER_UPLOADED,
      });
      await newInvoice.save();
      await LoCModel.updateMany(
        { _id: curLC._id },
        { $set: { invoice: newInvoice._id } }
      );
      return { message: "Upload invoice successfully" };
    }
  }

  async getInvoiceDetail(invoiceID: string) {
    const curInvoice = await InvoiceModel.findById(invoiceID);
    if (curInvoice) {
      return {
        hash: curInvoice.hash,
        file: curInvoice.file,
        status: curInvoice.status,
      };
    } else {
      throw new NotFoundError("Invoice not found");
    }
  }

  async approveInvoice(LCID: string, userID: string) {
    const curLC = await LoCModel.findById(LCID);
    const curSalesContract = await SalesContractModel.findById(
      curLC.salesContract
    );
    if (
      userID !== curSalesContract.issuingBankID.toString() &&
      userID !== curSalesContract.advisingBankID.toString()
    ) {
      throw new UnauthorizedError("Unauthorized to approve document");
    } else if (curLC.invoice) {
      const curInvoice = await InvoiceModel.findById(curLC.invoice);
      curInvoice.status = InvoiceStatus.APRROVED;
      // save to ipfs
      const cid = await uploadFile(curInvoice.file);
      curInvoice.hash = cid;
      await curInvoice.save();
      await uploadDocument(curLC);
      return { message: "Invoice approved" };
    } else {
      throw new NotFoundError("Invoice not found");
    }
  }

  async rejectInvoice(LCID: string, userID: string) {
    const curLC = await LoCModel.findById(LCID);
    const curSalesContract = await SalesContractModel.findById(
      curLC.salesContract
    );
    if (
      userID !== curSalesContract.issuingBankID.toString() &&
      userID !== curSalesContract.advisingBankID.toString()
    ) {
      throw new UnauthorizedError("Unauthorized to reject document");
    } else if (curLC.invoice) {
      const curInvoice = await InvoiceModel.findById(curLC.invoice);
      curInvoice.status = InvoiceStatus.REJECTED;
      await curInvoice.save();
      return { message: "Invoice rejected" };
    } else {
      throw new NotFoundError("Invoice not found");
    }
  }
}
