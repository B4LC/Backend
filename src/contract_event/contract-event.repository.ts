import { FetchData } from "../config/graphql";
import { LoCModel, SalesContractModel, UserModel } from "../model";
import { NotFoundError } from "routing-controllers";

export class ContractEventRepository {
  private readonly fetchData = new FetchData();

  async getAllEventByLC(userID: string, LCID: string) {
    const curUser = await UserModel.findById({ _id: userID }).exec();
    if (!curUser.letterOfCredits) throw new NotFoundError("LC not found");
    const curLCID = curUser.letterOfCredits.find((id) => {
      return id.toString() == LCID;
    });
    if (!curLCID) throw new NotFoundError("LC not found");
    const curLC = await LoCModel.findOne({ _id: curLCID })
      .select({ salesContract: 1, lcId: 1 })
      .lean();
    if (!curLC.salesContract)
      throw new NotFoundError("SalesContract not found");
    const curSalesContract = await SalesContractModel.findOne({
      _id: curLC.salesContract,
    })
      .select({ contractId: 1 })
      .lean();
    const salesContractCreatedEvent =
      await this.fetchData.salesContractCreatedEvent(
        curSalesContract.contractId
      );
      console.log(salesContractCreatedEvent);
      
    const LcCreatedEvent = await this.fetchData.LcCreatedEvent(
      curLC.lcId
    );
    const LcApprovedEvent = await this.fetchData.LcApprovedEvent(
      curLC.lcId
    );
    const LcRejectedEvent = await this.fetchData.LcRejectedEvent(
      curLC.lcId
    );
    const LcStatusChangedEvent = await this.fetchData.LcStatusChangedEvent(
      curLC.lcId
    );
    const docUploadedEvent = await this.fetchData.docUploadedEvent(
      curLC.lcId
    );
    return {
      salesContractCreatedEvent,
      LcCreatedEvent,
      LcApprovedEvent,
      LcRejectedEvent,
      LcStatusChangedEvent,
      docUploadedEvent,
    };
  }
}
