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
import { PackageListService } from "./package-list.service";
import { UserRole } from "../user/enums/user-role.enum";
import { OpenAPI } from "routing-controllers-openapi";
import { UserDocument } from "../user/user.model";
import { CreatePackageListDto } from "./dtos/createPackageList.dto";
// import { fileUploadOptions } from "../config/multer";

@JsonController("/packagelists")
export class PackageListController {
  private readonly packageListService = new PackageListService();

  @Post("/create/:lcid")
  @Authorized(UserRole.USER)
  @OpenAPI({ security: [{ BearerAuth: [] }] })
  async createPackageList(
    @CurrentUser({ required: true }) user: UserDocument,
    @Param("lcid") lcid: string,
    @Body() req: any
  ) {
    try {
      return this.packageListService.createPackageList(
        lcid,
        user._id.toString(),
        req
      );
    } catch (err) {
      throw new BadRequestError(err.message);
    }
  }

  @Get("/:packagelist_id")
  @OpenAPI({ security: [{ BearerAuth: [] }] })
  async getInvoiceDetail(@Param("packagelist_id") packageListID: string) {
    try {
      return this.packageListService.getPackageListDetail(packageListID);
    } catch (err) {
      throw new BadRequestError(err.message);
    }
  }

  @Patch("/:letterofcredit_id/approve")
  @Authorized(UserRole.BANK)
  @OpenAPI({ security: [{ BearerAuth: [] }] })
  async approvePackageList(
    @CurrentUser({ required: true }) user: UserDocument,
    @Param("letterofcredit_id") LCID: string,
    @Body() req: any
  ) {
    try {
      return this.packageListService.approvePackageList(
        LCID,
        user._id.toString()
      );
    } catch (err) {
      throw new BadRequestError(err.message);
    }
  }

  @Patch("/:letterofcredit_id/reject")
  @Authorized(UserRole.BANK)
  @OpenAPI({ security: [{ BearerAuth: [] }] })
  async rejectInvoice(
    @CurrentUser({ required: true }) user: UserDocument,
    @Param("letterofcredit_id") LCID: string,
    @Body() req: any
  ) {
    try {
      return this.packageListService.rejectPackageList(
        LCID,
        user._id.toString()
      );
    } catch (err) {
      throw new BadRequestError(err.message);
    }
  }
}
