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
import { FileService } from "./file.service";
import { OpenAPI } from "routing-controllers-openapi";

@JsonController("/files")
export class FileController {
  private readonly fileService = new FileService();

  @Post("/upload")
  async createInvoice(
    @Req() req: any,
    @UploadedFile("file")
    file: Express.Multer.File
  ) {
    try {
      return this.fileService.saveToCloud(file);
    } catch (err) {
      throw new BadRequestError(err.message);
    }
  }
}
