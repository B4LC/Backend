import 'reflect-metadata';
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
import { DocumentService } from "./document.service";
import { UserDocument } from "user/user.model";
import { isValidObjectId } from "mongoose";
@JsonController("/documents")
export class DocumentController {
    private readonly DocumentService = new DocumentService()
    @Get("/:letterofcredit_id")
    @OpenAPI({security: [{BearerAuth: []}]})
    async getAllDocument(@CurrentUser({required: true}) user: UserDocument, @Param("letterofcredit_id") letterofcredit_id: string) {
        try {
            if(!isValidObjectId(letterofcredit_id)) {
                throw new BadRequestError("Invalid Letter Of Credit id");
            }
            return this.DocumentService.getAllDocument(user._id.toString(), letterofcredit_id);
        }
        catch(err) {
            if(err instanceof NotFoundError) throw new NotFoundError(err.message);
            else throw new BadRequestError(err.message);
        }
    }
}
