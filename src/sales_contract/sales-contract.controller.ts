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
  Put,
  Req,
  Res,
} from "routing-controllers";
import { SalesContractService } from "./sales-contract.service";
import { OpenAPI } from "routing-controllers-openapi";
import { SalesContractDto } from "./dtos/createSalesContract.dto";
import { UserRole } from "../user/enums/user-role.enum";
import { UserDocument } from "user/user.model";
import { isValidObjectId } from "mongoose";

@JsonController("/salescontracts")
export class SalesContractController {
  private readonly salesContractService = new SalesContractService();

  @Get('/:salescontract_id')
  @OpenAPI({ security: [{ BearerAuth: [] }] })
  async getSalesContractDetail(
    @CurrentUser({ required: true }) user: UserDocument,
    @Param('salescontract_id') salescontract_id: string
  ) {
    try {
      if (!isValidObjectId(salescontract_id)) {
        throw new BadRequestError("Invalid salescontract_id");
      }
      return this.salesContractService.getSalesContractDetail(
        user._id.toString(),
        salescontract_id
      );
    } catch (err) {
      if (err instanceof NotFoundError) throw new NotFoundError(err.message);
      else throw new BadRequestError(err.message);
    }
  }

  @Post("/create")
  @Authorized(UserRole.USER)
  @OpenAPI({ security: [{ BearerAuth: [] }] })
  async createSalesContract(@Req() req: any, res: any) {
    try {
      console.log(req.body);

      return this.salesContractService.createSalesContract(req.body);
    } catch (err) {
      throw new BadRequestError(err.message);
    }
  }

  @Patch("/:id")
  @Authorized(UserRole.USER)
  @OpenAPI({ security: [{ BearerAuth: [] }] })
  async updateSalesContract(
    // @Param("id") id: string,
    // @Body() createSalesContractDto: SalesContractDto
    @Req() req: any,
    @Res() res: any
  ) {
    try {
      console.log(req.params.id, req.body);
      return this.salesContractService.updateSalesContract(
        // id,
        // createSalesContractDto
        req.params.id,
        req.body
      );
    } catch (err) {
      throw new BadRequestError(err.message);
    }
  }

  @Get("")
  @OpenAPI({ security: [{ BearerAuth: [] }] })
  async getAllSalesContract(
    @CurrentUser({ required: true }) user: UserDocument
  ) {
    try {
      return this.salesContractService.getAllSalesContract(user._id.toString());
    } catch (err) {
      if (err instanceof NotFoundError) throw new NotFoundError(err.message);
      else throw new BadRequestError(err.message);
    }
  }

  @Patch("/:salescontract_id/approve")
  @OpenAPI({ security: [{ BearerAuth: [] }] })
  @Authorized(UserRole.USER)
  async approveSalesContract(@CurrentUser({required: true}) user: UserDocument, @Param('salescontract_id') salescontract_id: string, @Body() req: any) {
    try {
      return this.salesContractService.approveSalesContract(user._id.toString(), salescontract_id);
    } catch(err) {
      throw new BadRequestError(err.message);
    }
  }

  @Delete("/:salescontract_id")
  @OpenAPI({ security: [{ BearerAuth: [] }] })
  @Authorized(UserRole.USER)
  async deleteSalesContract(@CurrentUser({required: true}) user: UserDocument, @Param('salescontract_id') salescontract_id: string)  {
    try {
      return this.salesContractService.deleteSalesContract(user._id.toString(), salescontract_id);
    }
    catch(err) {
      throw new BadRequestError(err.message);
    }
  }
}
