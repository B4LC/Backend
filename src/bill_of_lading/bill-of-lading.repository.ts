import { BoLModel, LoCModel, SalesContractModel } from "../model";
import { NotFoundError, UnauthorizedError } from "routing-controllers";
import { uploadDocument, uploadFile } from "../helper/uploadFile";
import { BoLStatus } from "./enums/bill-of-lading.enum";

export class BoLRepository {
  async createBoL(LCID: string, userID: string, file: Express.Multer.File) {
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
    if (curLC.billOfLading) {
      const curBoL = await BoLModel.findById(curLC.billOfLading);
      curBoL.file = file.path;
      await curBoL.save();
      return { message: "Update bill of lading successfully" };
    } else {
      const newBoL = new BoLModel({
        file: file.path,
        status: BoLStatus.USER_UPLOADED,
      });
      await newBoL.save();
      await LoCModel.updateMany(
        { _id: curLC._id },
        { $set: { billOfLading: newBoL._id } }
      );
      return { message: "Upload bill of lading successfully" };
    }
  }

  async getBoLDetail(BoLID: string) {
    const curBoL = await BoLModel.findById(BoLID);
    if (curBoL) {
      return {
        hash: curBoL.hash,
        file: curBoL.file,
        status: curBoL.status,
      };
    } else {
      throw new NotFoundError("bill of lading not found");
    }
  }

  async approveBoL(LCID: string, userID: string) {
    const curLC = await LoCModel.findById(LCID);
    const curSalesContract = await SalesContractModel.findById(
      curLC.salesContract
    );
    if (
      userID !== curSalesContract.issuingBankID.toString() &&
      userID !== curSalesContract.advisingBankID.toString()
    ) {
      throw new UnauthorizedError("Unauthorized to approve document");
    } else if (curLC.billOfLading) {
      const curBoL = await BoLModel.findById(curLC.billOfLading);
      curBoL.status = BoLStatus.APRROVED;
      const cid = await uploadFile(curBoL.file);
      curBoL.hash = cid;
      await curBoL.save();
      await uploadDocument(curLC);
      return { message: "bill of lading approved" };
    } else {
      throw new NotFoundError("bill of lading not found");
    }
  }

  async rejectBoL(LCID: string, userID: string) {
    const curLC = await LoCModel.findById(LCID);
    const curSalesContract = await SalesContractModel.findById(
      curLC.salesContract
    );
    if (
      userID !== curSalesContract.issuingBankID.toString() &&
      userID !== curSalesContract.advisingBankID.toString()
    ) {
      throw new UnauthorizedError("Unauthorized to reject document");
    } else if (curLC.billOfLading) {
      const curBoL = await BoLModel.findById(curLC.billOfLading);
      curBoL.status = BoLStatus.REJECTED;
      await curBoL.save();
      return { message: "bill of lading rejected" };
    } else {
      throw new NotFoundError("bill of lading not found");
    }
  }
}
