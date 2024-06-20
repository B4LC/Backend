import {
  BoEModel,
  BoLModel,
  CertificateOfOriginModel,
  InsuranceModel,
  InvoiceModel,
  LoCModel,
  PackageListModel,
  QuantityQualityCertificateModel,
  UserModel,
} from "../model";
import { NotFoundError } from "routing-controllers";

export class DocumentRepository {
  async getAllDocument(userID: string, LCID: string) {
    const curUser = await UserModel.findById(userID).exec();
    if (!curUser) throw new NotFoundError("User not found");
    const curLCID = curUser.letterOfCredits.find((id) => {
      return id.toString() == LCID;
    });
    if (!curLCID) throw new NotFoundError("LC not found");
    const curLC = await LoCModel.findById(curLCID);
    const curInvoice = await InvoiceModel.findById(curLC.document.invoice)
      .select({ _id: 0, __v: 0 })
      .lean()
      .exec();
    const curBoE = await BoEModel.findById(curLC.document.bill_of_exchange)
      .select({ _id: 0, __v: 0 })
      .lean()
      .exec();
    const curBoL = await BoLModel.findById(curLC.document.bill_of_lading)
      .select({ _id: 0, __v: 0 })
      .lean()
      .exec();
    const curInsurance = await InsuranceModel.findById(curLC.document.insurance)
      .select({ _id: 0, __v: 0 })
      .lean()
      .exec();
    const curPackageList = await PackageListModel.findById(
      curLC.document.package_list
    )
      .select({ _id: 0, __v: 0 })
      .lean()
      .exec();
    const curQuantityQualityCer =
      await QuantityQualityCertificateModel.findById(
        curLC.document.quantity_quality_certificate
      )
        .select({ _id: 0, __v: 0 })
        .lean()
        .exec();
    const curCoO = await CertificateOfOriginModel.findById(
      curLC.document.certificate_of_origin
    )
      .select({ _id: 0, __v: 0 })
      .lean()
      .exec();
    return {
      invoice: curInvoice,
      billOfExchange: curBoE,
      billOfLading: curBoL,
      quantityQualityCertificate: curQuantityQualityCer,
      certificateOfOrigin: curCoO,
      insurance: curInsurance,
      packageList: curPackageList,
    };
  }
}
