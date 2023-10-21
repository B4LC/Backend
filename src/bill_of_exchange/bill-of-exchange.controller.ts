import {
  Authorized,
  BadRequestError,
  Body,
  CurrentUser,
  Get,
  JsonController,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
} from "routing-controllers";
import { UserRole } from "../user/enums/user-role.enum";
import { OpenAPI } from "routing-controllers-openapi";
import { UserDocument } from "../user/user.model";
import { fileUploadOptions } from "../config/multer";
import { BoEService } from "./bill-of-exchange.service";

@JsonController("/billofexchanges")
export class BoEController {
  private readonly BoEService = new BoEService();

  @Post("/create")
  @Authorized(UserRole.USER)
  @OpenAPI({ security: [{ BearerAuth: [] }] })
  async createBoE(
    @CurrentUser({ required: true }) user: UserDocument,
    @Req() req: any,
    @UploadedFile("bill_of_exchange", { options: fileUploadOptions })
    file: Express.Multer.File
  ) {
    try {
      return this.BoEService.createBoE(
        req.body.LCID,
        user._id.toString(),
        file
      );
    } catch (err) {
      throw new BadRequestError(err.message);
    }
  }

  @Get("/:billofexchange_id")
  @OpenAPI({ security: [{ BearerAuth: [] }] })
  async getInvoiceDetail(@Param("billofexchange_id") BoEID: string) {
    try {
      return this.BoEService.getBoEDetail(BoEID);
    } catch (err) {
      throw new BadRequestError(err.message);
    }
  }

  @Patch("/:letterofcredit_id/approve")
  @Authorized(UserRole.BANK)
  @OpenAPI({ security: [{ BearerAuth: [] }] })
  async approveBoE(
    @CurrentUser({ required: true }) user: UserDocument,
    @Param("letterofcredit_id") LCID: string,
    @Body() req: any
  ) {
    try {
      return this.BoEService.approveBoE(LCID, user._id.toString());
    } catch (err) {
      throw new BadRequestError(err.message);
    }
  }

  @Patch("/:letterofcredit_id/reject")
  @Authorized(UserRole.BANK)
  @OpenAPI({ security: [{ BearerAuth: [] }] })
  async rejectBoE(
    @CurrentUser({ required: true }) user: UserDocument,
    @Param("letterofcredit_id") LCID: string,
    @Body() req: any
  ) {
    try {
      return this.BoEService.rejectBoE(LCID, user._id.toString());
    } catch (err) {
      throw new BadRequestError(err.message);
    }
  }
}
