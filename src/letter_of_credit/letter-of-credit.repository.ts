import {
  SalesContractModel,
  UserModel,
  LoCModel,
  InvoiceModel,
  BoEModel,
  BoLModel,
} from "../model";
import { MethodNotAllowedError, NotFoundError, UnauthorizedError } from "routing-controllers";
import { LetterOfCreditStatus } from "./enums/letter-of-credit.enum";
import { createLCDto } from "./dtos/createLC.dto";
import mongoose from "mongoose";
import { UpdateLCDto } from "./dtos/updateLC.dto";
import getContract from "../helper/contract";
import { SalesContractStatus } from "../sales_contract/enums/sales-contract.enum";

export class LoCRepository {
  async saveLCToUser(id: string, LC: any) {
    const user = await UserModel.findById(id);
    user.letterOfCredits.push(LC);
    await user.save();
  }

  async createLC(userID: string, salesContractID: string) {
    const curSalesContract = await SalesContractModel.findById(salesContractID);
    if (curSalesContract.issuingBankID.toString() != userID) {
      throw new UnauthorizedError("Unauthorized to create LC");
    }

    const startDate = new Date().getTime().toString();
    // store salescontract and LC in contract
    let contract = getContract();
    const salesContractCreatedPromise = new Promise<number>((resolve) => {
      contract.on("SalesContractCreated", (salesContractID) => {
        const contractId = parseInt(salesContractID._hex, 16);
        resolve(contractId);
      });
    });

    const LcCreatedPromise = new Promise<number>((resolve) => {
      contract.on("LcCreated", (LCID, salesContractID) => {
        const lcId = parseInt(LCID._hex, 16);
        resolve(lcId);
      });
    })

    await contract.createSalesContract(
      (await UserModel.findById(curSalesContract.importerID)).username,
      (await UserModel.findById(curSalesContract.exporterID)).username,
      (await UserModel.findById(curSalesContract.issuingBankID)).username,
      (await UserModel.findById(curSalesContract.advisingBankID)).username,
      curSalesContract.commodity,
      curSalesContract.price,
      curSalesContract.paymentMethod,
      curSalesContract.additionalInfo,
      curSalesContract.deadline
    )

    const contractId = await salesContractCreatedPromise;
    await contract.createLC(contractId, startDate);
    const lcId = await LcCreatedPromise;

    const newLC = new LoCModel({
      lcId: lcId,
      salesContract: new mongoose.Types.ObjectId(salesContractID),
      startDate: startDate,
      status: LetterOfCreditStatus.CREATED,
    });

    // save to db
    await SalesContractModel.findByIdAndUpdate(salesContractID, {
      contractId: contractId,
      status: SalesContractStatus.BANK_APPROVED,
    })

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
      const LC = await LoCModel.findById(id);
      let startDateInDate = new Date(parseInt(LC.startDate)).toDateString();
      console.log(startDateInDate);
      const result = {
        LCID: LC._id.toString(),
        salesContract: LC.salesContract.toString(),
        invoice: LC.invoice,
        billOfExchange: LC.billOfExchange,
        billOfLading: LC.billOfLading,
        otherDocument: LC.otherDocument,
        startDate: startDateInDate,
        status: LC.status,
      };
      LCs.push(result);
    }
    return LCs;
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
    );
    const curInvoice = await InvoiceModel.findById(curLC.invoice);
    const curBoE = await BoEModel.findById(curLC.billOfExchange);
    const curBoL = await BoLModel.findById(curLC.billOfLading);
    let importer = (await UserModel.findById(curSalesContract.importerID))
      .username;
    let exporter = (await UserModel.findById(curSalesContract.exporterID))
      .username;
    let issuingBank = (await UserModel.findById(curSalesContract.issuingBankID))
      .username;
    let advisingBank = (
      await UserModel.findById(curSalesContract.advisingBankID)
    ).username;
    let deadlineInDate = new Date(parseInt(curLC.startDate)).toDateString();
    const result = {
      salseContract: {
        importer: importer,
        exporter: exporter,
        issuingBank: issuingBank,
        advisingBank: advisingBank,
        commodity: curSalesContract.commodity,
        price: curSalesContract.price,
        paymentMethod: curSalesContract.paymentMethod,
        additionalInfo: curSalesContract.additionalInfo,
        deadlineInDate: deadlineInDate,
        status: curSalesContract.status,
      },
      invoice: {
        hash: curInvoice?.hash,
        file: curInvoice?.file,
        status: curInvoice?.status,
        // createdOn: new Date(parseInt(curInvoice?.createdOn)).toDateString(),
        // additionalInfo: curInvoice?.additionalInfo,
        // packageInfo: curInvoice?.packageInfo,
      },
      billOfExchange: {
        hash: curBoE?.hash,
        file: curInvoice?.file,
        status: curInvoice?.status,
        // issuingDate: new Date(parseInt(curBoE?.issuingDate)).toDateString(),
        // drawerInfo: (await UserModel.findById(curBoE?.drawerInfo))?.username,
        // paymentDeadline: new Date(parseInt(curBoE?.paymentDeadline)).toDateString(),
      },
      billOfLading: {
        hash: curBoL?.hash,
        file: curBoL?.file,
        status: curBoL?.status,
        // bookingNo: curBoL?.bookingNo,
        // voyageNo: curBoL?.voyageNo,
        // billType: curBoL?.billType,
        // freightAndCharge: curBoL?.freightAndCharge,
        // shipper: curBoL?.shipper,
        // consignee: (await UserModel.findById(curBoL?.consignee))?.username,
        // notifyParty: (await UserModel.findById(curBoL?.notifyParty))?.username,
        // sealNo: curBoL?.sealNo,
        // goodsDescription: curBoL?.goodsDescription,
        // portOfLading: curBoL?.portOfLoading,
        // portOfDischarge: curBoL?.portOfDischarge,
        // portOfDelivery: curBoL?.portOfDelivery,
        // additionalInfo: curBoL?.additionalInfo,
      }
    };
    return result;
  }

  async approveLC(userID: string, LCID: string) {
    const curLC = await LoCModel.findById(LCID);
    if(!curLC) {
      throw new NotFoundError('LC not found');
    }
    const curSalesContract = await SalesContractModel.findById(curLC.salesContract);
    if(!curSalesContract) {
      throw new NotFoundError('Salescontract not founf');
    }
    if(curSalesContract.advisingBankID.toString() != userID) throw new UnauthorizedError('Only advising bank can approve');
    let contract = getContract();
    await contract.approveLC(parseInt(curLC.lcId));
    curLC.status = LetterOfCreditStatus.ADVISING_BANK_APPROVED;
    return {message: 'LC is approved'};
  }

  async rejectLC(userID: string, LCID: string) {
    const curLC = await LoCModel.findById(LCID);
    if(!curLC) {
      throw new NotFoundError('LC not found');
    }
    const curSalesContract = await SalesContractModel.findById(curLC.salesContract);
    if(!curSalesContract) {
      throw new NotFoundError('Salescontract not founf');
    }
    if(curSalesContract.advisingBankID.toString() != userID) throw new UnauthorizedError('Only advising bank can approve');
    let contract = getContract();
    await contract.rejectLC(parseInt(curLC.lcId));
    curLC.status = LetterOfCreditStatus.ADVISING_BANK_REJECTED;
    return {message: 'LC is rejected'};
  }

  async updateLCStatus(userID: string, LCID: string, newStatus: LetterOfCreditStatus) {
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
    let contract = getContract();
    await contract.changeLcStatus(curLC.lcId, newStatus);
    await LoCModel.findByIdAndUpdate(LCID, {
      status: newStatus,
    });
    return {message: "Change LC status successfully"};
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
    }
    else if(curLC.status != LetterOfCreditStatus.ENDED) {
      throw new MethodNotAllowedError('Cannot delete ongoing LC');
    }
    try {
      await LoCModel.findByIdAndDelete(LCID);
      await SalesContractModel.updateMany({ref: curLC.salesContract}, {$unset: {ref: curLC.salesContract}});
      await InvoiceModel.updateMany({ref: curLC.invoice}, {$unset: {ref: curLC.invoice}});
      await BoEModel.updateMany({ref: curLC.billOfExchange}, {$unset: {ref: curLC.billOfExchange}});
      await BoLModel.updateMany({ref: curLC.billOfLading}, {$unset: {ref: curLC.billOfLading}});
      await UserModel.updateMany({ref: LCID}, {$pull: {ref: LCID}});
    }
    catch(err) {
      console.log(err);      
    }
  }
}
