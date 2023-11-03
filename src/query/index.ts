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
  query LcStatusChangeds($value: BigInt) {
    lcStatusChangeds(where: { lcID: $value }) {
      lcID
      status
      transactionHash
      blockTimestamp
    }
  }
`;
export const GET_DOC_UPLOADED_EVENT_DETAIL = gql`
  query docUploadeds($value: BigInt) {
    docUploadeds(where: { lcID: $value }) {
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
  query LcApproveds($value: BigInt) {
    lcApproveds(where: { lcID: $value }) {
      lcID
      transactionHash
      blockTimestamp
    }
  }
`;
export const GET_LC_REJECTED_EVENT_DETAIL = gql`
  query LcRejecteds($value: BigInt) {
    lcRejecteds(where: { lcID: $value }) {
      lcID
      transactionHash
      blockTimestamp
    }
  }
`;
