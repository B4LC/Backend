import { PackageInfo } from "invoice/invoice.model";

export class CreateInvoiceDto {
  success: boolean;
  file_path: string;
  results: {
    from_name: string;
    from_address: string;
    from_phone: string;
    from_fax: string;
    title: string;
    no: string;
    date: string;
    consignee: string;
    notify_party_name: string;
    notify_party_address: string;
    notify_party_phone: string;
    notify_party_fax: string;
    lc_no: string;
    transport: string;
    transport_no: string;
    bill_no: string;
    cont_seal_no: string;
    from: string;
    to: string;
    0: {
      0: string;
      1: string;
      2: string;
      3: string;
    };
    1: {
      0: string;
      1: string;
      2: string;
      3: string;
    };
    2: {
      0: string;
      1: string;
      2: string;
      3: string;
    };
    3: {
      0: string;
      1: string;
      2: string;
      3: string;
    };
    4: {
      0: string;
      1: string;
      2: string;
      3: string;
    };
    5: {
      0: string;
      1: string;
      2: string;
      3: string;
    };
  };
}
