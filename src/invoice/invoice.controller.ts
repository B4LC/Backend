import { Authorized, BadRequestError, Body, CurrentUser, JsonController, Param, Patch, Post, Req, UploadedFile } from "routing-controllers";
import { InvoiceService } from "./invoice.service";
import { UserRole } from "../user/enums/user-role.enum";
import { OpenAPI } from "routing-controllers-openapi";
import { UserDocument } from "../user/user.model";
import { fileUploadOptions } from "../config/multer";

@JsonController("/invoices")
export class InvoiceController {
  private readonly invoiceService = new InvoiceService();

  @Post("/create")
  @Authorized(UserRole.USER)
  @OpenAPI({ security: [{ BearerAuth: [] }] })
  async createInvoice(@CurrentUser({required: true}) user: UserDocument, @Req() req: any, @UploadedFile('invoice', {options: fileUploadOptions}) file: Express.Multer.File) {
    try {
        return this.invoiceService.createInvoice(req.body.LCID, user._id.toString(), file);
    }
    catch(err) {
        throw new BadRequestError(err.message);
    }
  }

  @Patch("/:id/approve")
  @Authorized(UserRole.BANK)
  @OpenAPI({ security: [{ BearerAuth: [] }] })
  async approveInvoice(@CurrentUser({required: true}) user: UserDocument, @Param("letterofcredit_id") LCID: string) {
    try {
      return this.invoiceService.approveInvoice(LCID, user._id.toString());
    }
    catch(err) {
      throw new BadRequestError(err.message);
    }
  }

  @Patch("/:id/reject")
  @Authorized(UserRole.BANK)
  @OpenAPI({ security: [{ BearerAuth: [] }] })
  async rejectInvoice(@CurrentUser({required: true}) user: UserDocument, @Param("letterofcredit_id") LCID: string) {
    try {
      return this.invoiceService.rejectInvoice(LCID, user._id.toString());
    }
    catch(err) {
      throw new BadRequestError(err.message);
    }
  }
}
