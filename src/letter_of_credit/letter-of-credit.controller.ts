import {
  Authorized,
  BadRequestError,
  Body,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  NotFoundError,
  Param,
  Patch,
  Post,
  Req,
} from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { LoCService } from "./letter-of-credit.service";
import { UserRole } from "../user/enums/user-role.enum";
import { User, UserDocument } from "user/user.model";
import { UpdateLCDto } from "./dtos/updateLC.dto";
import { isValidObjectId } from "mongoose";
import { LetterOfCreditStatus } from "./enums/letter-of-credit.enum";

@JsonController("/letterofcredits")
export class LoCController {
  private readonly LoCService = new LoCService();

  @Get("/:letterofcredit_id")
  @OpenAPI({ security: [{ BearerAuth: [] }] })
  async getLCDetail(
    @CurrentUser({ required: true }) user: UserDocument,
    @Param("letterofcredit_id") letterofcredit_id: string
  ) {
    try {
      if (!isValidObjectId(letterofcredit_id)) {
        throw new BadRequestError("Invalid letterofcredit_id");
      }
      return this.LoCService.getLCDetail(
        user._id.toString(),
        letterofcredit_id
      );
    } catch (err) {
      if (err instanceof NotFoundError) throw new NotFoundError(err.message);
      else throw new BadRequestError(err.message);
    }
  }

  @Post("/create")
  @Authorized(UserRole.BANK)
  @OpenAPI({ security: [{ BearerAuth: [] }] })
  async createLC(
    @CurrentUser({ required: true }) user: UserDocument,
    @Req() req: any
  ) {
    try {
      const { salescontractID } = req.body;
      return this.LoCService.createLC(user._id.toString(), salescontractID);
    } catch (err) {
      throw new BadRequestError(err.message);
    }
  }

  @Patch("/:letterofcredit_id")
  @Authorized(UserRole.BANK)
  @OpenAPI({ security: [{ BearerAuth: [] }] })
  async updateLC(
    @CurrentUser({ required: true }) user: UserDocument,
    @Param("letterofcredit_id") letterofcredit_id: string,
    @Body() updateLCDto: UpdateLCDto
  ) {
    try {
      return this.LoCService.updateLC(
        user._id.toString(),
        letterofcredit_id,
        updateLCDto
      );
    } catch (err) {
      throw new BadRequestError(err.message);
    }
  }

  @Patch("/:letterofcredit_id/status")
  @Authorized(UserRole.BANK)
  @OpenAPI({ security: [{ BearerAuth: [] }] })
  async updateLCStatus(
    @CurrentUser({ required: true }) user: UserDocument,
    @Param("letterofcredit_id") letterofcredit_id: string,
    @Req() req: any
  ) {
    try {      
      return this.LoCService.updateLCStatus(
        user._id.toString(),
        letterofcredit_id,
        req.body.status
      );
    } catch (err) {
      throw new BadRequestError(err.message);
    }
  }

  @Get("")
  @OpenAPI({ security: [{ BearerAuth: [] }] })
  async getAllLC(@CurrentUser({ required: true }) user: UserDocument) {
    try {
      return this.LoCService.getAllLC(user._id.toString());
    } catch (err) {
      throw new BadRequestError(err.message);
    }
  }

  @Patch("/:letterofcredit_id/approve")
  @Authorized(UserRole.BANK)
  @OpenAPI({ security: [{ BearerAuth: [] }] })
  async approveLC(@CurrentUser({required: true}) user: UserDocument, @Param('letterofcredit_id') LCID: string, @Body() req: any) {
    try {
      return this.LoCService.approveLC(user._id.toString(), LCID);
    }
    catch(err) {
      throw new BadRequestError(err.message);
    }
  }

  @Patch("/:letterofcredit_id/reject")
  @Authorized(UserRole.BANK)
  @OpenAPI({ security: [{ BearerAuth: [] }] })
  async rejectLC(@CurrentUser({required: true}) user: UserDocument, @Param('letterofcredit_id') LCID: string, @Body() req: any) {
    try {
      return this.LoCService.rejectLC(user._id.toString(), LCID);
    }
    catch(err) {
      throw new BadRequestError(err.message);
    }
  }

  @Delete("/:letterofcredit_id")
  @Authorized(UserRole.BANK)
  @OpenAPI({ security: [{ BearerAuth: [] }] })
  async deleteLC(@CurrentUser({required: true}) user: UserDocument, @Param('letterofcredit_id') LCID: string) {
    try {
      return this.LoCService.deleteLC(user._id.toString(), LCID);
    }
    catch(err) {
      throw new BadRequestError(err.message);
    }
  }
}
