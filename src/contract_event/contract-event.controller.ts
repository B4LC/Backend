import { BadRequestError, CurrentUser, Get, JsonController, Param } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { UserDocument } from "user/user.model";
import { ContractEventService } from "./contract-event.service";

@JsonController("/contractevents")
export class ContractEventController {
    private readonly contractEventService = new ContractEventService();
    @Get("/:letterofcredit_id")
    @OpenAPI({security: [{BearerAuth: []}]})
    async getAllEvent(@CurrentUser({required: true}) user: UserDocument, @Param("letterofcredit_id") LCID: string) {
        try {
            return this.contractEventService.getAllEventByLC(user._id.toString(), LCID);
        }
        catch(err) {
            throw new BadRequestError(err.message);
        }
    }
}