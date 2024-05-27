import {
  SalesContractModel,
  UserModel,
  LoCModel,
  InvoiceModel,
  BoEModel,
  BoLModel,
} from "../model";
import {
  MethodNotAllowedError,
  NotFoundError,
  UnauthorizedError,
} from "routing-controllers";
import { LetterOfCreditStatus } from "./enums/letter-of-credit.enum";
import { createLCDto } from "./dtos/createLC.dto";
import mongoose, { ObjectId, Types } from "mongoose";
import { UpdateLCDto } from "./dtos/updateLC.dto";
import getContract from "../helper/contract";
import { SalesContractStatus } from "../sales_contract/enums/sales-contract.enum";

export class LoCRepository {
  async saveLCToUser(id: string, LC: any) {
    const user = await UserModel.findById(id);
    user.letterOfCredits.push(LC);
    await user.save();
  }

  async createLC(userID: string, salesContractID: string, address: string) {
    const curSalesContract = await SalesContractModel.findById(
      salesContractID
    ).select({ "requiredDocument._id": 0, "shipmentInformation._id": 0 });
    if (curSalesContract.issuingBankID.toString() != userID) {
      throw new UnauthorizedError("Unauthorized to create LC");
    }

    const startDate = new Date().getTime().toString();
    // store salescontract and LC in contract
    // let contract = getContract();
    // const salesContractCreatedPromise = new Promise<number>((resolve) => {
    //   contract.on("SalesContractCreated", (salesContractID) => {
    //     const contractId = parseInt(salesContractID._hex, 16);
    //     resolve(contractId);
    //   });
    // });

    // const LcCreatedPromise = new Promise<number>((resolve) => {
    //   contract.on("LcCreated", (lcID) => {
    //     const lcId = parseInt(lcID._hex, 16);
    //     resolve(lcId);
    //   });
    // });

    // await contract.createSalesContract(
    //   (
    //     await UserModel.findById(curSalesContract.importerID)
    //   ).username,
    //   (
    //     await UserModel.findById(curSalesContract.exporterID)
    //   ).username,
    //   (
    //     await UserModel.findById(curSalesContract.issuingBankID)
    //   ).username,
    //   (
    //     await UserModel.findById(curSalesContract.advisingBankID)
    //   ).username,
    //   curSalesContract.commodity,
    //   curSalesContract.price,
    //   curSalesContract.paymentMethod,
    //   curSalesContract.additionalInfo,
    //   curSalesContract.deadline
    // );

    // const contractId = await salesContractCreatedPromise;
    // await contract.createLC(contractId, startDate);
    // const lcId = await LcCreatedPromise;
    const fieldsWithEmptyString: { [key: string]: Types.ObjectId } = {};
    for (const [key, value] of Object.entries(
      curSalesContract.requiredDocument
    )) {
      if (key === "_doc") {
        for (const [key, v] of Object.entries(value)) {
          if (typeof v === "boolean" && v === true) {
            fieldsWithEmptyString[key] = new Types.ObjectId(
              "000000000000000000000000"
            );
          }
        }
      }
    }

    const newLC = new LoCModel({
      LcAddress: address,
      salesContract: new mongoose.Types.ObjectId(salesContractID),
      startDate: startDate,
      status: LetterOfCreditStatus.CREATED,
      document: fieldsWithEmptyString,
    });

    // save to db
    await SalesContractModel.findByIdAndUpdate(salesContractID, {
      status: SalesContractStatus.BANK_APPROVED,
    });

    await curSalesContract.save();
    await newLC.save();
    await this.saveLCToUser(curSalesContract.exporterID.toString(), newLC);
    await this.saveLCToUser(curSalesContract.importerID.toString(), newLC);
    await this.saveLCToUser(curSalesContract.issuingBankID.toString(), newLC);
    await this.saveLCToUser(curSalesContract.advisingBankID.toString(), newLC);

    return { message: "Create LC successfully" };
  }

  async updateLC(userID: string, LCID: string, updateLCDto: UpdateLCDto) {
    const curLC = await LoCModel.findById(LCID);
    const curSalesContract = await SalesContractModel.findById(
      curLC.salesContract
    );
    if (
      curSalesContract.issuingBankID.toString() != userID &&
      curSalesContract.advisingBankID.toString() != userID
    ) {
      throw new UnauthorizedError("Unauthorized to update LC");
    }
    await LoCModel.findByIdAndUpdate(LCID, {
      updateLCDto,
    });
    return { message: "Update LC successfully" };
  }

  async getAllLC(userID: string) {
    const LCs: Array<any> = [];
    const curUser = await UserModel.findById({ _id: userID }).exec();
    if (!curUser.letterOfCredits) throw new NotFoundError("LC not found");
    for (let id of curUser.letterOfCredits) {
      const LC = await LoCModel.findById(id).select({ "document._id": 0 });
      const curSalesContract = await SalesContractModel.findById(
        LC.salesContract
      ).select({ "requiredDocument._id": 0, "shipmentInformation._id": 0 });
      let startDateInDate = new Date(parseInt(LC.startDate)).toDateString();
      let importer = await UserModel.findById(curSalesContract.importerID);
      let exporter = await UserModel.findById(curSalesContract.exporterID);
      let issuingBank = await UserModel.findById(
        curSalesContract.issuingBankID
      );
      let advisingBank = await UserModel.findById(
        curSalesContract.advisingBankID
      );
      const result = {
        _id: LC._id.toString(),
        LcAddress: LC.LcAddress,
        salesContract: LC.salesContract.toString(),
        importerName: importer.username,
        exporterName: exporter.username,
        issuingBankName: issuingBank.username,
        advisingBankName: advisingBank.username,
        commodity: curSalesContract.commodity,
        price: curSalesContract.price,
        currency: curSalesContract.currency,
        startDate: startDateInDate,
        status: LC.status,
      };
      LCs.push(result);
    }
    return LCs.reverse();
  }

  async getLCDetail(userID: string, LCID: string) {
    const curUser = await UserModel.findById(userID).exec();
    if (!curUser) throw new NotFoundError("User not found");
    const curLCID = curUser.letterOfCredits.find((id) => {
      return id.toString() == LCID;
    });
    if (!curLCID) throw new NotFoundError("LC not found");
    const curLC = await LoCModel.findById(curLCID);
    const curSalesContract = await SalesContractModel.findById(
      curLC.salesContract
    ).select({ "requiredDocument._id": 0, "shipmentInformation._id": 0 });
    if (!curSalesContract) throw new NotFoundError("Sales contract not found");
    const curInvoice = await InvoiceModel.findById(curLC.invoice);
    const curBoE = await BoEModel.findById(curLC.billOfExchange);
    const curBoL = await BoLModel.findById(curLC.billOfLading);
    let importer = await UserModel.findById(curSalesContract.importerID);
    let exporter = await UserModel.findById(curSalesContract.exporterID);
    let issuingBank = await UserModel.findById(curSalesContract.issuingBankID);
    let advisingBank = await UserModel.findById(
      curSalesContract.advisingBankID
    );
    let deadlineInDate = new Date(
      parseInt(curSalesContract.deadline)
    ).toDateString();
    let startDateInDate = new Date(parseInt(curLC.startDate)).toDateString();
    curSalesContract.shipmentInformation.latestShipmentDate ??
      (curSalesContract.shipmentInformation.latestShipmentDate = new Date(
        parseInt(curSalesContract.shipmentInformation.latestShipmentDate)
      ).toDateString());
    let doc =
      curSalesContract.requiredDocument != undefined
        ? JSON.parse(JSON.stringify(curSalesContract.requiredDocument))
        : {};
    const result = {
      letterOfCredit: {
        LcAddress: curLC.LcAddress,
        status: curLC.status,
        startDate: startDateInDate,
        rejectedReason: curLC.rejectedReason,
      },
      salesContract: {
        importerName: importer.username,
        importerAddress: importer.address,
        exporterName: exporter.username,
        exporterAddress: exporter.address,
        issuingBankName: issuingBank.username,
        issuingBankAddress: issuingBank.address,
        advisingBankName: advisingBank.username,
        advisingBankAddress: advisingBank.address,
        commodity: curSalesContract.commodity,
        price: curSalesContract.price,
        currency: curSalesContract.currency,
        paymentMethod: curSalesContract.paymentMethod,
        requiredDocument: doc,
        shipmentInformation: curSalesContract.shipmentInformation,
        additionalInfo: curSalesContract.additionalInfo,
        deadlineInDate: deadlineInDate,
        status: curSalesContract.status,
      },
    };
    return result;
  }

  async approveLC(userID: string, LCID: string) {
    const curLC = await LoCModel.findById(LCID);
    if (!curLC) {
      throw new NotFoundError("LC not found");
    }
    const curSalesContract = await SalesContractModel.findById(
      curLC.salesContract
    );
    if (!curSalesContract) {
      throw new NotFoundError("Salescontract not found");
    }
    if (curSalesContract.advisingBankID.toString() != userID)
      throw new UnauthorizedError("Only advising bank can approve");
    // let contract = getContract();
    // await contract.approveLC(parseInt(curLC.lcId));
    curLC.status = LetterOfCreditStatus.ADVISING_BANK_APPROVED;
    curLC.rejectedReason = "";
    await curLC.save();
    return { message: "LC is approved" };
  }

  async rejectLC(userID: string, LCID: string, reason: string) {
    const curLC = await LoCModel.findById(LCID);
    if (!curLC) {
      throw new NotFoundError("LC not found");
    }
    const curSalesContract = await SalesContractModel.findById(
      curLC.salesContract
    );
    if (!curSalesContract) {
      throw new NotFoundError("Salescontract not found");
    }
    if (curSalesContract.advisingBankID.toString() != userID)
      throw new UnauthorizedError("Only advising bank can approve");
    // let contract = getContract();
    // await contract.rejectLC(parseInt(curLC.lcId));
    curLC.status = LetterOfCreditStatus.ADVISING_BANK_REJECTED;
    curLC.rejectedReason = reason;
    await curLC.save();
    return { message: "LC is rejected" };
  }

  async updateLCStatus(
    userID: string,
    LCID: string,
    newStatus: LetterOfCreditStatus
  ) {
    const curLC = await LoCModel.findById(LCID);
    const curSalesContract = await SalesContractModel.findById(
      curLC.salesContract
    );
    if (
      curSalesContract.issuingBankID.toString() != userID &&
      curSalesContract.advisingBankID.toString() != userID
    ) {
      throw new UnauthorizedError("Unauthorized to update LC");
    }
    // let contract = getContract();
    // await contract.changeLcStatus(curLC.lcId, newStatus);
    await LoCModel.findByIdAndUpdate(LCID, {
      status: newStatus,
    });
    return { message: "Change LC status successfully" };
  }

  async deleteLC(userID: string, LCID: string) {
    const curLC = await LoCModel.findById(LCID);
    const curSalesContract = await SalesContractModel.findById(
      curLC.salesContract
    );
    if (
      curSalesContract.issuingBankID.toString() != userID &&
      curSalesContract.advisingBankID.toString() != userID
    ) {
      throw new UnauthorizedError("Unauthorized to delete LC");
    } else if (curLC.status != LetterOfCreditStatus.ENDED) {
      throw new MethodNotAllowedError("Cannot delete ongoing LC");
    }
    try {
      await LoCModel.findByIdAndDelete(LCID);
      await SalesContractModel.updateMany(
        { ref: curLC.salesContract },
        { $unset: { ref: curLC.salesContract } }
      );
      await InvoiceModel.updateMany(
        { ref: curLC.invoice },
        { $unset: { ref: curLC.invoice } }
      );
      await BoEModel.updateMany(
        { ref: curLC.billOfExchange },
        { $unset: { ref: curLC.billOfExchange } }
      );
      await BoLModel.updateMany(
        { ref: curLC.billOfLading },
        { $unset: { ref: curLC.billOfLading } }
      );
      await UserModel.updateMany({ ref: LCID }, { $pull: { ref: LCID } });
    } catch (err) {
      console.log(err);
    }
  }

  async getLCActor(userID: string, LCID: string) {
    const curUser = await UserModel.findById(userID).exec();
    if (!curUser) throw new NotFoundError("User not found");
    const curLCID = curUser.letterOfCredits.find((id) => {
      return id.toString() == LCID;
    });
    if (!curLCID) throw new NotFoundError("LC not found");
    const curLC = await LoCModel.findById(curLCID);
    const curSalesContract = await SalesContractModel.findById(
      curLC.salesContract
    ).select({ "requiredDocument._id": 0, "shipmentInformation._id": 0 });
    if (!curSalesContract) throw new NotFoundError("Sales contract not found");
    const importer = await UserModel.findById(curSalesContract.importerID)
      .select({
        username: 1,
        address: 1,
        role: 1,
      })
      .lean()
      .exec();
    const exporter = await UserModel.findById(curSalesContract.exporterID)
      .select({
        username: 1,
        address: 1,
        role: 1,
      })
      .lean()
      .exec();
    const issuingBank = await UserModel.findById(curSalesContract.issuingBankID)
      .select({
        username: 1,
        address: 1,
        role: 1,
      })
      .lean()
      .exec();
    const advisingBank = await UserModel.findById(
      curSalesContract.advisingBankID
    )
      .select({
        username: 1,
        address: 1,
        role: 1,
      })
      .lean()
      .exec();
    return {
      importer,
      exporter,
      issuingBank,
      advisingBank,
    };
  }
}
