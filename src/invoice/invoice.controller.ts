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
import { InvoiceService } from "./invoice.service";
import { UserRole } from "../user/enums/user-role.enum";
import { OpenAPI } from "routing-controllers-openapi";
import { UserDocument } from "../user/user.model";
import { CreateInvoiceDto } from "./dtos/createInvoice.dto";
// import { fileUploadOptions } from "../config/multer";

@JsonController("/invoices")
export class InvoiceController {
  private readonly invoiceService = new InvoiceService();

  @Post("/create")
  @Authorized(UserRole.USER)
  @OpenAPI({ security: [{ BearerAuth: [] }] })
  async createInvoice(
  //   @CurrentUser({ required: true }) user: UserDocument,
  //   @Param()
  //   createInvoice: CreateInvoiceDto
  ) {
  //   try {
  //     return this.invoiceService.createInvoice(
  //       req.body.LCID,
  //       user._id.toString(),
  //       file
  //     );
  //   } catch (err) {
  //     throw new BadRequestError(err.message);
  //   }
  }

  @Get("/:invoice_id")
  @OpenAPI({ security: [{ BearerAuth: [] }] })
  async getInvoiceDetail(@Param("invoice_id") invoiceID: string) {
    try {
      return this.invoiceService.getInvoiceDetail(invoiceID);
    }
    catch(err) {
      throw new BadRequestError(err.message);
    }
  }

  @Patch("/:letterofcredit_id/approve")
  @Authorized(UserRole.BANK)
  @OpenAPI({ security: [{ BearerAuth: [] }] })
  async approveInvoice(
    @CurrentUser({ required: true }) user: UserDocument,
    @Param("letterofcredit_id") LCID: string,
    @Body() req: any
  ) {
    try {
      return this.invoiceService.approveInvoice(LCID, user._id.toString());
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
      return this.invoiceService.rejectInvoice(LCID, user._id.toString());
    } catch (err) {
      throw new BadRequestError(err.message);
    }
  }
}
