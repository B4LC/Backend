import { BadRequestError, Body, CurrentUser, Get, JsonController, Put, Req } from "routing-controllers";
import { UserService } from "./user.service";
import { OpenAPI } from "routing-controllers-openapi";
import { UserDocument } from "./user.model";
import { ChangeProfile } from "./dtos/changeProfile.dto";

@JsonController("/user")
export class UserController {
    private readonly userService = new UserService();
    
    @Get("")
    @OpenAPI({security: [{ BearerAuth: [] }]})
    async getUserInfo(@CurrentUser({required: true}) user: UserDocument) {
        try {
            return this.userService.getUserInfo(user._id.toString());
        }
        catch(err) {
            throw new BadRequestError(err.message);
        }
    }

    @Get("/banks")
    @OpenAPI({security: [{ BearerAuth: [] }]})
    async getAllBank() {
        try {
            return this.userService.getAllBank();
        }
        catch(err) {
            throw new BadRequestError(err.message);
        }
    }

    @Put("/change/profile")
    @OpenAPI({security: [{ BearerAuth: [] }]})
    async changeProfile(@CurrentUser({required: true}) user: UserDocument, @Req() req: any) {
        try {
            return this.userService.changeProfile(user._id.toString(), req.body);
        }
        catch(err) {
            throw new BadRequestError(err.message);
        }
    }
}