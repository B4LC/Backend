import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  DocUploaded,
  LcCreated,
  OwnershipTransferred,
  SalesContractCreated
} from "../generated/TradeFinance/TradeFinance"

export function createDocUploadedEvent(lcID: BigInt): DocUploaded {
  let docUploadedEvent = changetype<DocUploaded>(newMockEvent())

  docUploadedEvent.parameters = new Array()

  docUploadedEvent.parameters.push(
    new ethereum.EventParam("lcID", ethereum.Value.fromUnsignedBigInt(lcID))
  )

  return docUploadedEvent
}

export function createLcCreatedEvent(
  lcID: BigInt,
  salesContractID: BigInt
): LcCreated {
  let lcCreatedEvent = changetype<LcCreated>(newMockEvent())

  lcCreatedEvent.parameters = new Array()

  lcCreatedEvent.parameters.push(
    new ethereum.EventParam("lcID", ethereum.Value.fromUnsignedBigInt(lcID))
  )
  lcCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "salesContractID",
      ethereum.Value.fromUnsignedBigInt(salesContractID)
    )
  )

  return lcCreatedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createSalesContractCreatedEvent(
  salesContractID: BigInt
): SalesContractCreated {
  let salesContractCreatedEvent = changetype<SalesContractCreated>(
    newMockEvent()
  )

  salesContractCreatedEvent.parameters = new Array()

  salesContractCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "salesContractID",
      ethereum.Value.fromUnsignedBigInt(salesContractID)
    )
  )

  return salesContractCreatedEvent
}
