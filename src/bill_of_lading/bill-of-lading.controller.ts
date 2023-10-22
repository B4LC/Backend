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
import { BoLService } from "./bill-of-lading.service";

@JsonController("/billofladings")
export class BoLController {
  private readonly BoLService = new BoLService();

  @Post("/create")
  @Authorized(UserRole.USER)
  @OpenAPI({ security: [{ BearerAuth: [] }] })
  async createBoL(
    @CurrentUser({ required: true }) user: UserDocument,
    @Req() req: any,
    @UploadedFile("bill_of_lading", { options: fileUploadOptions })
    file: Express.Multer.File
  ) {
    try {
      return this.BoLService.createBoL(
        req.body.LCID,
        user._id.toString(),
        file
      );
    } catch (err) {
      throw new BadRequestError(err.message);
    }
  }

  @Get("/:billoflading_id")
  @OpenAPI({ security: [{ BearerAuth: [] }] })
  async getInvoiceDetail(@Param("billoflading_id") BoLID: string) {
    try {
      return this.BoLService.getBoLDetail(BoLID);
    } catch (err) {
      throw new BadRequestError(err.message);
    }
  }

  @Patch("/:letterofcredit_id/approve")
  @Authorized(UserRole.BANK)
  @OpenAPI({ security: [{ BearerAuth: [] }] })
  async approveBoL(
    @CurrentUser({ required: true }) user: UserDocument,
    @Param("letterofcredit_id") LCID: string,
    @Body() req: any
  ) {
    try {
      return this.BoLService.approveBoL(LCID, user._id.toString());
    } catch (err) {
      throw new BadRequestError(err.message);
    }
  }

  @Patch("/:billoflading_id/reject")
  @Authorized(UserRole.BANK)
  @OpenAPI({ security: [{ BearerAuth: [] }] })
  async rejectInvoice(
    @CurrentUser({ required: true }) user: UserDocument,
    @Param("billoflading_id") LCID: string,
    @Body() req: any
  ) {
    try {
      return this.BoLService.rejectBoL(LCID, user._id.toString());
    } catch (err) {
      throw new BadRequestError(err.message);
    }
  }
}
