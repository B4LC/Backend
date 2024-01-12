import { InvoiceModel, LoCModel, SalesContractModel } from "../model";
import { NotFoundError, UnauthorizedError } from "routing-controllers";
import { InvoiceStatus } from "./enums/invoiceStatus.enum";
import { uploadDocument, uploadFile } from "../helper/uploadFile";
require("dotenv").config();
import uploadToCloudinary from "../config/cloudinary";
import { CreateInvoiceDto } from "./dtos/createInvoice.dto";

export class InvoiceRepository {
  async createInvoice(LCID: string, userID: string, invoice: any) {
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
    const tableArray = Object.keys(invoice.table).map((rowKey) => {
      const row = Object.values(invoice.table[rowKey]);
      return row;
    });

    console.log(tableArray);

    // Convert the 2D array to an array of documents
    const arrayToSave = tableArray.map((row) => ({ values: row }));
    if (curLC.invoice) {
      // const curInvoice = await InvoiceModel.findById(curLC.invoice);
      await InvoiceModel.findByIdAndUpdate(curLC.invoice._id, {
        file_path: invoice.file_path,
        table: arrayToSave,
        from_name: invoice.from_name,
        from_address: invoice.from_address,
        from_phone: invoice.from_phone,
        from_fax: invoice.from_fax,
        title: invoice.title,
        no: invoice.no,
        date: invoice.date,
        consignee: invoice.consignee,
        notify_party_name: invoice.notify_party_name,
        notify_party_address: invoice.notify_party_address,
        notify_party_phone: invoice.notify_party_phone,
        notify_party_fax: invoice.notify_party_fax,
        lc_no: invoice.lc_no,
        transport: invoice.transport,
        transport_no: invoice.transport_no,
        bill_no: invoice.bill_no,
        cont_seal_no: invoice.cont_seal_no,
        from: invoice.from,
        to: invoice.to,
      });
      return { message: "Update invoice successfully" };
    } else {
      const newInvoice = new InvoiceModel({
        status: InvoiceStatus.USER_UPLOADED,
        file_path: invoice.file_path,
        table: arrayToSave,
        from_name: invoice.from_name,
        from_address: invoice.from_address,
        from_phone: invoice.from_phone,
        from_fax: invoice.from_fax,
        title: invoice.title,
        no: invoice.no,
        date: invoice.date,
        consignee: invoice.consignee,
        notify_party_name: invoice.notify_party_name,
        notify_party_address: invoice.notify_party_address,
        notify_party_phone: invoice.notify_party_phone,
        notify_party_fax: invoice.notify_party_fax,
        lc_no: invoice.lc_no,
        transport: invoice.transport,
        transport_no: invoice.transport_no,
        bill_no: invoice.bill_no,
        cont_seal_no: invoice.cont_seal_no,
        from: invoice.from,
        to: invoice.to,
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
        status: curInvoice.status,
        file_path: curInvoice.file_path,
        table: curInvoice.table,
        from_name: curInvoice.from_name,
        from_address: curInvoice.from_address,
        from_phone: curInvoice.from_phone,
        from_fax: curInvoice.from_fax,
        title: curInvoice.title,
        no: curInvoice.no,
        date: curInvoice.date,
        consignee: curInvoice.consignee,
        notify_party_name: curInvoice.notify_party_name,
        notify_party_address: curInvoice.notify_party_address,
        notify_party_phone: curInvoice.notify_party_phone,
        notify_party_fax: curInvoice.notify_party_fax,
        lc_no: curInvoice.lc_no,
        transport: curInvoice.transport,
        transport_no: curInvoice.transport_no,
        bill_no: curInvoice.bill_no,
        cont_seal_no: curInvoice.cont_seal_no,
        from: curInvoice.from,
        to: curInvoice.to,
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
      // const cid = await uploadFile(curInvoice.file_path);
      // curInvoice.hash = cid;
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
