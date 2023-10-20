import { InvoiceModel, LoCModel, SalesContractModel } from "../model";
import { NotFoundError, UnauthorizedError } from "routing-controllers";
import { InvoiceStatus } from "./enums/invoiceStatus.enum";

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
    if (curLC.invoice) {
      const curInvoice = await InvoiceModel.findById(curLC.invoice);
      curInvoice.file = file.path;
      await curInvoice.save();
      return { message: "Update invoice successfully" };
    } else {
      const newInvoice = new InvoiceModel({
        file: file.buffer,
        status: InvoiceStatus.USER_UPLOADED,
      });
      await newInvoice.save();
      await LoCModel.updateMany(
        { ref: newInvoice._id },
        { $pull: { ref: newInvoice._id } }
      );
      return { message: "Upload invoice successfully" };
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
    }
    else if(curLC.invoice) {
        const curInvoice = await InvoiceModel.findById(curLC.invoice);
        curInvoice.status = InvoiceStatus.APRROVED;
        return { message: "Invoice approved"}
    }
    else {
        throw new NotFoundError('Invoice not found');
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
    }
    else if(curLC.invoice) {
        const curInvoice = await InvoiceModel.findById(curLC.invoice);
        curInvoice.status = InvoiceStatus.REJECTED;
        return { message: "Invoice rejected"}
    }
    else {
        throw new NotFoundError('Invoice not found');
    }
  }
}
