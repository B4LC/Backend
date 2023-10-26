import { BoEModel, LoCModel, SalesContractModel } from "../model";
import { NotFoundError, UnauthorizedError } from "routing-controllers";
import { uploadDocument, uploadFile } from "../helper/uploadFile";
import { BoEStatus } from "./enums/bill-of-exchange-status.enum";
import getContract from "helper/contract";

export class BoERepository {
  async createBoE(LCID: string, userID: string, file: Express.Multer.File) {
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
    if (curLC.billOfExchange) {
      const curBoE = await BoEModel.findById(curLC.billOfExchange);
      curBoE.file = file.path;
      await curBoE.save();
      return { message: "Update bill of exchange successfully" };
    } else {
      const newBoE = new BoEModel({
        file: file.path,
        status: BoEStatus.USER_UPLOADED,
      });
      await newBoE.save();
      await LoCModel.updateMany(
        { _id: curLC._id },
        { $set: { billOfExchange: newBoE._id } }
      );
      return { message: "Upload bill of exchange successfully" };
    }
  }

  async getBoEDetail(BoEID: string) {
    const curBoE = await BoEModel.findById(BoEID);
    if (curBoE) {
      return {
        hash: curBoE.hash,
        file: curBoE.file,
        status: curBoE.status,
      };
    } else {
      throw new NotFoundError("bill of exchange not found");
    }
  }

  async approveBoE(LCID: string, userID: string) {
    const curLC = await LoCModel.findById(LCID);
    if(!curLC) throw new NotFoundError('Letter of credit not found');
    const curSalesContract = await SalesContractModel.findById(
      curLC.salesContract
    );
    if(!curSalesContract) throw new NotFoundError('Sales contract not found');
    if (
      userID !== curSalesContract.issuingBankID.toString() &&
      userID !== curSalesContract.advisingBankID.toString()
    ) {
      throw new UnauthorizedError("Unauthorized to approve document");
    } else if (curLC.billOfExchange) {
      const curBoE = await BoEModel.findById(curLC.billOfExchange);
      curBoE.status = BoEStatus.APRROVED;
      // save to ipfs
      const cid = await uploadFile(curBoE.file);
      curBoE.hash = cid;
      await curBoE.save();
      await uploadDocument(curLC);
      return { message: "bill of exchange approved" };
    } else {
      throw new NotFoundError("bill of exchange not found");
    }
  }

  async rejectBoE(LCID: string, userID: string) {
    const curLC = await LoCModel.findById(LCID);
    const curSalesContract = await SalesContractModel.findById(
      curLC.salesContract
    );
    if (
      userID !== curSalesContract.issuingBankID.toString() &&
      userID !== curSalesContract.advisingBankID.toString()
    ) {
      throw new UnauthorizedError("Unauthorized to reject document");
    } else if (curLC.billOfExchange) {
      const curBoE = await BoEModel.findById(curLC.billOfExchange);
      curBoE.status = BoEStatus.REJECTED;
      await curBoE.save();
      return { message: "bill of exchange rejected" };
    } else {
      throw new NotFoundError("bill of exchange not found");
    }
  }
}
