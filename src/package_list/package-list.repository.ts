import { PackageListModel, LoCModel, SalesContractModel } from "../model";
import { NotFoundError, UnauthorizedError } from "routing-controllers";
import { PackageListStatus } from "./enums/packageListStatus.enum";
import { uploadDocument, uploadFile } from "../helper/uploadFile";
require("dotenv").config();
import { Types } from "mongoose";

export class PackageListRepository {
  async createPackageList(LCID: string, userID: string, packageList: any) {
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
    // const tableArray = Object.keys(packageList.table).map((rowKey) => {
    //   const row = Object.values(packageList.table[rowKey]);
    //   return row;
    // });

    // // console.log(tableArray);

    // // Convert the 2D array to an array of documents
    // const arrayToSave = tableArray.map((row) => ({ values: row }));
    if (
      curLC.document.invoice._id.equals(
        new Types.ObjectId("000000000000000000000000")
      )
    ) {
      const newPackageList = new PackageListModel({
        status: PackageListStatus.USER_UPLOADED,
        file_path: packageList.file_path,
        // table: arrayToSave,
        seller: packageList.seller,
        delivery_for: packageList.delivery_for,
        delivery_from: packageList.delivery_from,
        destination: packageList.destination,
        vessel: packageList.vessel,
        lifting_date: packageList.lifting_date,
        commodity: packageList.commodity,
        price_term: packageList.price_term,
        total_amount: packageList.total_amount,
        origin: packageList.origin,
      });
      await newPackageList.save();
      await LoCModel.updateMany(
        { _id: curLC._id },
        { $set: { "document.package_list": newPackageList._id } }
      );
      return { message: "Upload Package list successfully" };
    } else {
      await PackageListModel.findByIdAndUpdate(
        curLC.document.package_list._id,
        {
          file_path: packageList.file_path,
          // table: arrayToSave,
          seller: packageList.seller,
          delivery_for: packageList.delivery_for,
          delivery_from: packageList.delivery_from,
          destination: packageList.destination,
          vessel: packageList.vessel,
          lifting_date: packageList.lifting_date,
          commodity: packageList.commodity,
          price_term: packageList.price_term,
          total_amount: packageList.total_amount,
          origin: packageList.origin,
        }
      );
      return { message: "Update Package list successfully" };
    }
  }

  async getPackageListDetail(packageListID: string) {
    const curPackageList = await PackageListModel.findById(packageListID);
    if (curPackageList) {
      return {
        hash: curPackageList.hash,
        status: curPackageList.status,
        file_path: curPackageList.file_path,
        // table: curPackageList.table,
        seller: curPackageList.seller,
        delivery_for: curPackageList.delivery_for,
        delivery_from: curPackageList.delivery_from,
        destination: curPackageList.destination,
        vessel: curPackageList.vessel,
        lifting_date: curPackageList.lifting_date,
        commodity: curPackageList.commodity,
        price_term: curPackageList.price_term,
        total_amount: curPackageList.total_amount,
        origin: curPackageList.origin,
      };
    } else {
      throw new NotFoundError("Package list not found");
    }
  }

  async approvePackageList(LCID: string, userID: string) {
    const curLC = await LoCModel.findById(LCID);
    const curSalesContract = await SalesContractModel.findById(
      curLC.salesContract
    );
    if (
      userID !== curSalesContract.issuingBankID.toString() &&
      userID !== curSalesContract.advisingBankID.toString()
    ) {
      throw new UnauthorizedError("Unauthorized to approve document");
    } else if (curLC.document.invoice) {
      const curPackageList = await PackageListModel.findById(
        curLC.document.package_list
      );
      curPackageList.status = PackageListStatus.APRROVED;
      // save to ipfs
      const cid = await uploadFile(curPackageList.file_path);
      curPackageList.hash = cid;
      await curPackageList.save();
      await uploadDocument(curLC);
      return { message: "Package list approved" };
    } else {
      throw new NotFoundError("Package list not found");
    }
  }

  async rejectPackageList(LCID: string, userID: string) {
    const curLC = await LoCModel.findById(LCID);
    const curSalesContract = await SalesContractModel.findById(
      curLC.salesContract
    );
    if (
      userID !== curSalesContract.issuingBankID.toString() &&
      userID !== curSalesContract.advisingBankID.toString()
    ) {
      throw new UnauthorizedError("Unauthorized to reject document");
    } else if (curLC.document.package_list) {
      const curPackageList = await PackageListModel.findById(
        curLC.document.package_list
      );
      curPackageList.status = PackageListStatus.REJECTED;
      await curPackageList.save();
      return { message: "Package list rejected" };
    } else {
      throw new NotFoundError("Package list not found");
    }
  }
}
