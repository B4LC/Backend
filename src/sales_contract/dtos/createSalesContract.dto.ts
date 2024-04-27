import { RequiredDocument } from "sales_contract/sales-contract.model";

export class SalesContractDto {
  importer: string;
  exporter: string;
  issuingBank: string;
  advisingBank: string;
  commodity: [
    {
      description: string;
      quantity: string;
      unit: string;
    }
  ];
  price: string;
  currency: string;
  paymentMethod: string;
  requiredDocument: {
    invoice: boolean;
    bill_of_exchange: boolean;
    bill_of_lading: boolean;
    insurance: boolean;
    quality_quantity_certificate: boolean;
    certificate_of_origin: boolean;
    package_list: boolean;
  };
  shipmentInformation: {
    from: string;
    to: string;
    partialShipment: boolean;
    transhipment: boolean;
    latestShipmentDate: string;
  }
  additionalInfo: string;
  deadline: string;
}
