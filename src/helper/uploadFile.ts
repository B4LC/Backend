import {
  BoEModel,
  BoLModel,
  CertificateOfOriginModel,
  InsuranceModel,
  InvoiceModel,
  PackageListModel,
  QuantityQualityCertificateModel,
} from "../model";
import saveToIPFS from "../config/ipfs";
import getContract from "./contract";
import { LoCDocument } from "../letter_of_credit/letter-of-credit.model";
import { InvoiceStatus } from "../invoice/enums/invoiceStatus.enum";
import { BoEStatus } from "../bill_of_exchange/enums/bill-of-exchange-status.enum";
import { BoLStatus } from "../bill_of_lading/enums/bill-of-lading.enum";
import { LetterOfCreditStatus } from "../letter_of_credit/enums/letter-of-credit.enum";
import { PackageListStatus } from "../package_list/enums/packageListStatus.enum";
import { InsuranceStatus } from "../insurance/enums/insuranceStatus.enum";
import { CertificateOfOriginStatus } from "../certificate_of_origin/enums/CertificateOfOriginStatus.enum";
import { QuanQualCertificateStatus } from "../quantity_quality_certificate/enums/QuanQualCertificate.enum";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
require("dotenv").config();
const JWT = process.env.PINATA_JWT;

// save to ipfs
export async function uploadFile(filePath: string) {
  const cid = await saveToIPFS(filePath);
  return cid;
}

// save to contract
export async function uploadDocument(curLC: LoCDocument) {
  let allDocStatus: boolean = false;
  let files: string[] = [];

  const curInvoice = await InvoiceModel.findById(curLC.document.invoice).lean();
  if (curInvoice && curInvoice.status == InvoiceStatus.APRROVED) {
    allDocStatus = true;
    files.push(curInvoice.file_path);
  }

  const curBoE = await BoEModel.findById(
    curLC.document.bill_of_exchange
  ).lean();
  if (curBoE && curBoE.status == BoEStatus.APRROVED) {
    allDocStatus = true;
    files.push(curBoE.file_path);
  }

  const curBoL = await BoLModel.findById(curLC.document.bill_of_lading).lean();
  if (curBoL && curBoL.status == BoLStatus.APRROVED) {
    allDocStatus = true;
    files.push(curBoL.file_path);
  }

  const curPackageList = await PackageListModel.findById(
    curLC.document.package_list
  ).lean();
  if (curPackageList && curPackageList.status == PackageListStatus.APRROVED) {
    allDocStatus = true;
    files.push(curPackageList.file_path);
  }

  const curInsurance = await InsuranceModel.findById(
    curLC.document.insurance
  ).lean();
  if (curInsurance && curInsurance.status == InsuranceStatus.APRROVED) {
    allDocStatus = true;
    files.push(curInsurance.file_path);
  }

  const curOrigin = await CertificateOfOriginModel.findById(
    curLC.document.bill_of_lading
  ).lean();
  if (curOrigin && curOrigin.status == CertificateOfOriginStatus.APRROVED) {
    allDocStatus = true;
    files.push(curOrigin.file_path);
  }

  const curQuanQualCer = await QuantityQualityCertificateModel.findById(
    curLC.document.quantity_quality_certificate
  ).lean();
  if (
    curQuanQualCer &&
    curQuanQualCer.status == QuanQualCertificateStatus.APRROVED
  ) {
    allDocStatus = true;
    files.push(curQuanQualCer.file_path);
  }

  if (allDocStatus == true) {
    const data = new FormData();
    for (let file_path of files) {
      const fileName = file_path.split("/").pop();
      try {
        const res = await axios.get(file_path, { responseType: "arraybuffer" });
        const fileData = Buffer.from(res.data);
        fs.writeFileSync(fileName, fileData);
      } catch (e) {
        console.log(e);
      }
      const file = fs.createReadStream(fileName);
      // const file = fs.readFileSync(url);
      data.append("file", file, { filepath: `${curLC.LcAddress}/${fileName}` });
    }
    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data,
        {
          headers: {
            // "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: JWT,
          },
        }
      );
      if (res.data.IpfsHash) {
        let contract = getContract();
        const tx = await contract.uploadDocument(
          curLC.LcAddress,
          res.data.IpfsHash
        );
        await tx.wait();
        if (tx) {
          curLC.status = LetterOfCreditStatus.DOCUMENT_APPROVED;
          await curLC.save();
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
