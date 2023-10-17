import {
  DocUploaded as DocUploadedEvent,
  LcCreated as LcCreatedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  SalesContractCreated as SalesContractCreatedEvent
} from "../generated/TradeFinance/TradeFinance"
import {
  DocUploaded,
  LcCreated,
  OwnershipTransferred,
  SalesContractCreated
} from "../generated/schema"

export function handleDocUploaded(event: DocUploadedEvent): void {
  let entity = new DocUploaded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.lcID = event.params.lcID

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLcCreated(event: LcCreatedEvent): void {
  let entity = new LcCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.lcID = event.params.lcID
  entity.salesContractID = event.params.salesContractID

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSalesContractCreated(
  event: SalesContractCreatedEvent
): void {
  let entity = new SalesContractCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.salesContractID = event.params.salesContractID

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
