import {
  Authorized,
  BadRequestError,
  Body,
  CurrentUser,
  Get,
  JsonController,
  NotFoundError,
  Param,
  Patch,
  Post,
} from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { LoCService } from "./letter-of-credit.service";
import { UserRole } from "../user/enums/user-role.enum";
import { User, UserDocument } from "user/user.model";
import { UpdateLCDto } from "./dtos/updateLC.dto";
import { isValidObjectId } from "mongoose";

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

  @Post("/:salescontract_id/create")
  @Authorized(UserRole.BANK)
  @OpenAPI({ security: [{ BearerAuth: [] }] })
  async createLC(
    @CurrentUser({ required: true }) user: UserDocument,
    @Param("salescontract_id") salescontract_id: string
  ) {
    try {
      return this.LoCService.createLC(user._id.toString(), salescontract_id);
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
    @Body({}) updateLCDto: UpdateLCDto
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

  @Get("")
  @OpenAPI({ security: [{ BearerAuth: [] }] })
  async getAllLC(@CurrentUser({ required: true }) user: UserDocument) {
    try {
      return this.LoCService.getAllLC(user._id.toString());
    } catch (err) {
      throw new BadRequestError(err.message);
    }
  }
}
