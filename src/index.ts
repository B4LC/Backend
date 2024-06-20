import "reflect-metadata";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import * as http from "http";
import {
  Action,
  RoutingControllersOptions,
  UnauthorizedError,
  useExpressServer,
} from "routing-controllers";
import { UserModel } from "./model";
import { SalesContractController } from "./sales_contract/sales-contract.controller";
import { LoCController } from "./letter_of_credit/letter-of-credit.controller";
import cors from "cors";
import { InvoiceController } from "./invoice/invoice.controller";
import { UserController } from "./user/user.controller";
import { BoLController } from "./bill_of_lading/bill-of-lading.controller";
import { BoEController } from "./bill_of_exchange/bill-of-exchange.controller";
import { FileController } from "./file/file.controller";
import { DocumentController } from "./document/document.controller";
import { PackageListController } from "./package_list/package-list.controller";
require("dotenv").config();

async function authorizationChecker(action: Action) {
  const req: Request = action.request;
  const authHeader = req.headers.authorization || "";
  const [type, address] = authHeader.split(" ");
  if (type !== "Bearer") {
    throw new UnauthorizedError("Unauthorized Error !");
  }
  try {
    // const user = await UserModel.findOne({ address: address }).lean();
    // if(!user) {
    //   return false;
    // }
    // if (!roles.includes(user.role)) {
    //   return false;
    // }
    return true;
  } catch (e) {
    throw new UnauthorizedError(e.message);
  }
}
async function currentUserChecker(action: Action) {
  const req: Request = action.request;
  const authHeader = req.headers.authorization;
  const [, address] = authHeader.split(" ");
  // const curUser: any = decode(token);
  try {
    const user = await UserModel.findOne({ address: address }).lean();
    return user;
  } catch (e) {
    console.log(e);
    return null;
  }
}

function main() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  // app.use(cors());
  app.use(cors({ origin: "http://localhost:3000" }));
  const port = 8000;
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("connect db successfully");
    })
    .catch((err) => {
      console.log(err);
    });
  const routingControllersOptions: RoutingControllersOptions = {
    plainToClassTransformOptions: {
      excludeExtraneousValues: true,
    },
    controllers: [
      UserController,
      SalesContractController,
      LoCController,
      InvoiceController,
      BoLController,
      BoEController,
      PackageListController,
      FileController,
      DocumentController,
    ],
    authorizationChecker,
    currentUserChecker,
  };
  useExpressServer(app, routingControllersOptions);
  const server = http.createServer(app);
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
main();
process.on("exit", () => {
  mongoose.disconnect();
});
