import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { DocUploaded } from "../generated/schema"
import { DocUploaded as DocUploadedEvent } from "../generated/TradeFinance/TradeFinance"
import { handleDocUploaded } from "../src/trade-finance"
import { createDocUploadedEvent } from "./trade-finance-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let lcID = BigInt.fromI32(234)
    let newDocUploadedEvent = createDocUploadedEvent(lcID)
    handleDocUploaded(newDocUploadedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("DocUploaded created and stored", () => {
    assert.entityCount("DocUploaded", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "DocUploaded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "lcID",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
