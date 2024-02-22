import { gql } from "@apollo/client";
export const GET_SALESCONTRACT_EVENT_DETAIL = gql`
  query salesContractCreated($id: BigInt) {
    salesContractCreateds(where: { salesContractID: $id }) {
      salesContractID
      importer
      exporter
      issuingBank
      advisingBank
      commodity
      price
      paymentMethod
      additionalInfo
      deadline
      transactionHash
      blockTimestamp
    }
  }
`;
export const GET_LC_CREATED_EVENT_DETAIL = gql`
  query lcCreated($lcid: BigInt) {
    lcCreateds(where: { lcID: $lcid }) {
      id
      lcID
      salesContractID
      invoiceHash
      billOfExchangeHash
      billOfLadingHash
      otherDocHash
      lcStatus
      startDate
      blockTimestamp
      transactionHash
    }
  }
`;
export const GET_LC_STATUS_CHANGED_EVENT_DETAIL = gql`
  query LcStatusChangeds($lcid: BigInt) {
    lcStatusChangeds(where: { lcID: $lcid }) {
      lcID
      status
      transactionHash
      blockTimestamp
    }
  }
`;
export const GET_DOC_UPLOADED_EVENT_DETAIL = gql`
  query docUploadeds($lcid: BigInt) {
    docUploadeds(where: { lcID: $lcid }) {
      lcID
      invoice
      BoE
      BoL
      other
      transactionHash
      blockTimestamp
    }
  }
`;
export const GET_LC_APPROVED_EVENT_DETAIL = gql`
  query LcApproveds($lcid: BigInt) {
    lcApproveds(where: { lcID: $lcid }) {
      lcID
      transactionHash
      blockTimestamp
    }
  }
`;
export const GET_LC_REJECTED_EVENT_DETAIL = gql`
  query LcRejecteds($lcid: BigInt) {
    lcRejecteds(where: { lcID: $lcid }) {
      lcID
      transactionHash
      blockTimestamp
    }
  }
`;
