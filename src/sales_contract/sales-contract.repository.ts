import { SalesContractDto } from "./dtos/createSalesContract.dto";
import { UserDocument } from "../user/user.model";
import { SalesContract, SalesContractDocument } from "./sales-contract.model";
import { SalesContractStatus } from "./enums/sales-contract.enum";
import { UserModel, SalesContractModel } from "../model";
import mongoose, { ObjectId } from "mongoose";
import moment from "moment";
import {
  MethodNotAllowedError,
  NotFoundError,
  UnauthorizedError,
} from "routing-controllers";

export class SalesContractRepository {
  async findByEmail(email: string): Promise<UserDocument | null> {
    return UserModel.findOne({ email: email });
  }
  async findIdByUsername(username: string): Promise<string | null> {
    try {
      const user = await UserModel.findOne({ username: username });
      if (!user) return null;
      return user._id.toString();
    } catch (err) {
      return err;
    }
  }
  async saveSalesContractToUser(
    userID: string,
    salesContract: SalesContractDocument
  ) {
    const user = await UserModel.findById(userID);
    user.salesContracts.push(salesContract);
    await user.save();
  }
  async createSalesContract(createSalesContractDto: SalesContractDto) {
    // console.log(createSalesContractDto);
    const importerID = await this.findIdByUsername(
      createSalesContractDto.importer
    );

    const exporterID = await this.findIdByUsername(
      createSalesContractDto.exporter
    );
    const issuingBankID = await this.findIdByUsername(
      createSalesContractDto.issuingBank
    );
    const advisingBankID = await this.findIdByUsername(
      createSalesContractDto.advisingBank
    );
    if (!importerID || !exporterID || !issuingBankID || !advisingBankID) {
      throw new NotFoundError("User not found");
    }
    const deadlineTimestamp = new Date(createSalesContractDto.deadline)
      .getTime()
      .toString();
    const newSaleContract = new SalesContractModel({
      exporterID: new mongoose.Types.ObjectId(exporterID),
      importerID: new mongoose.Types.ObjectId(importerID),
      issuingBankID: new mongoose.Types.ObjectId(issuingBankID),
      advisingBankID: new mongoose.Types.ObjectId(advisingBankID),
      commodity: createSalesContractDto.commodity,
      price: createSalesContractDto.price,
      paymentMethod: createSalesContractDto.paymentMethod,
      additionalInfo: createSalesContractDto.additionalInfo,
      deadline: deadlineTimestamp,
      status: SalesContractStatus.CREATED,
    });
    await newSaleContract.save();
    await this.saveSalesContractToUser(exporterID, newSaleContract);
    await this.saveSalesContractToUser(importerID, newSaleContract);
    await this.saveSalesContractToUser(issuingBankID, newSaleContract);
    await this.saveSalesContractToUser(advisingBankID, newSaleContract);
    return { message: "Create salescontract successfully" };
  }

  async updateSalesContract(
    id: string,
    updateSalesContractDto: SalesContractDto
  ) {
    const importerID = await this.findIdByUsername(
      updateSalesContractDto.importer
    );
    const exporterID = await this.findIdByUsername(
      updateSalesContractDto.exporter
    );
    const issuingBankID = await this.findIdByUsername(
      updateSalesContractDto.issuingBank
    );
    const advisingBankID = await this.findIdByUsername(
      updateSalesContractDto.advisingBank
    );
    const deadlineTimestamp = new Date(updateSalesContractDto.deadline)
      .getTime()
      .toString();
    if (!importerID || !exporterID || !issuingBankID || !advisingBankID) {
      return { message: "Username not found" };
    }
    try {
      await SalesContractModel.findByIdAndUpdate(id, {
        importerID: importerID,
        exporterID: exporterID,
        issuingBankID: issuingBankID,
        advisingBankID: advisingBankID,
        commodity: updateSalesContractDto.commodity,
        price: updateSalesContractDto.price,
        paymentMethod: updateSalesContractDto.paymentMethod,
        additionalInfo: updateSalesContractDto.additionalInfo,
        deadline: deadlineTimestamp,
      });
      return { message: "Update salescontract successfully" };
    } catch (err) {
      console.log(err);
    }
  }

  async getAllSalesContract(userID: string) {
    // console.log(userID);
    const agreements = [];
    const curUser = await UserModel.findById({ _id: userID }).exec();
    for (let salesContractID of curUser.salesContracts) {
      const salesContract = await SalesContractModel.findById(salesContractID);
      // console.log(salesContract);
      const {
        importerID,
        exporterID,
        issuingBankID,
        advisingBankID,
        commodity,
        price,
        paymentMethod,
        additionalInfo,
        deadline,
        status,
      } = salesContract;
      // console.log(importerID);
      let importer = (await UserModel.findById(importerID)).username;
      let exporter = (await UserModel.findById(exporterID)).username;
      let issuingBank = (await UserModel.findById(issuingBankID)).username;
      let advisingBank = (await UserModel.findById(advisingBankID)).username;
      let deadlineInDate = new Date(parseInt(deadline)).toDateString();
      // console.log(importer);
      const result = {
        salescontract_id: salesContractID.toString(),
        importer: importer,
        exporter: exporter,
        issuingBank: issuingBank,
        advisingBank: advisingBank,
        commodity: commodity,
        price: price,
        paymentMethod: paymentMethod,
        additionalInfo: additionalInfo,
        deadlineInDate: deadlineInDate,
        status: status,
      };
      agreements.push(result);
      // console.log(salesContract);
    }
    return agreements;
  }

  async getSalesContractDetail(userID: string, salesContractID: string) {
    const curUser = await UserModel.findById(userID).exec();
    if (!curUser) throw new NotFoundError("User not found");
    // console.log(curUser);
    // console.log(salesContractID);
    const curSalesContractID = curUser.salesContracts.find((salesContract) => {
      // console.log(salesContract.toString());
      return salesContract.toString() == salesContractID;
    });
    if (!curSalesContractID) throw new NotFoundError("Salescontract not found");
    const salesContract = await SalesContractModel.findById(curSalesContractID);
    const {
      importerID,
      exporterID,
      issuingBankID,
      advisingBankID,
      commodity,
      price,
      paymentMethod,
      additionalInfo,
      deadline,
      status,
    } = salesContract;
    // console.log(importerID);
    let importer = (await UserModel.findById(importerID)).username;
    let exporter = (await UserModel.findById(exporterID)).username;
    let issuingBank = (await UserModel.findById(issuingBankID)).username;
    let advisingBank = (await UserModel.findById(advisingBankID)).username;
    let deadlineInDate = new Date(parseInt(deadline)).toDateString();
    // console.log(importer);
    const result = {
      importer: importer,
      exporter: exporter,
      issuingBank: issuingBank,
      advisingBank: advisingBank,
      commodity: commodity,
      price: price,
      paymentMethod: paymentMethod,
      additionalInfo: additionalInfo,
      deadlineInDate: deadlineInDate,
      status: status,
    };
    return result;
  }

  async approveSalesContract(userID: string, salesContractID: string) {
    const curSalesContract = await SalesContractModel.findById(salesContractID);
    if (curSalesContract.exporterID.toString() != userID)
      throw new UnauthorizedError("Only exporter can approve");
    curSalesContract.status = SalesContractStatus.EXPORTER_APPROVED;
    return { message: "Salescontract is approved" };
  }

  async deleteSalesContract(userID: string, salesContractID: string) {
    const curSalesContract = await SalesContractModel.findById(salesContractID);
    if (
      curSalesContract.status == SalesContractStatus.EXPORTER_APPROVED ||
      curSalesContract.status == SalesContractStatus.BANK_APPROVED
    )
      throw new MethodNotAllowedError("Cannot delete approved salescontract");
    if (
      curSalesContract.exporterID.toString() != userID ||
      curSalesContract.importerID.toString() != userID
    )
      throw new UnauthorizedError("Unauthorized to delete");
    try {
      await SalesContractModel.findByIdAndDelete(salesContractID);
      await UserModel.updateMany(
        { ref: salesContractID },
        { $pull: { ref: salesContractID } }
      );
    } catch (err) {
      console.log(err);
    }
  }
}
