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
import { verify, decode } from "jsonwebtoken";
import { isJWT } from "class-validator";
import { UserModel } from "./model";
import { redisClient } from "./config/redis-client";
import { AuthController } from "./auth/auth.controller";
import { SalesContractController } from "./sales_contract/sales-contract.controller";
import { LoCController } from "./letter_of_credit/letter-of-credit.controller";
import cors from "cors";
import { InvoiceController } from "./invoice/invoice.controller";
import { UserController } from "./user/user.controller";
import { BoEController } from "./bill_of_exchange/bill-of-exchange.controller";
require("dotenv").config();

async function authorizationChecker(action: Action, roles: string[]) {
  const req: Request = action.request;
  const authHeader = req.headers.authorization || "";
  const [type, token] = authHeader.split(" ");
  if (type !== "Bearer" || !isJWT(token)) {
    throw new UnauthorizedError("Unauthorized Error !");
  }
  try {
    const user = verify(token, process.env.JWT_SECRET);
    const { username, email, role } = user as Record<string, string>;
    const userTokens = await redisClient.keys(`auth:${email}*`);
    if (!roles.includes(role)) {
      return false;
    }
    return userTokens.some(async (key: any) => {
      const currentToken = await redisClient.get(key);
      return currentToken === token;
    });
  } catch (e) {
    throw new UnauthorizedError(e.message);
  }
}
async function currentUserChecker(action: Action) {
  const req: Request = action.request;
  const authHeader = req.headers.authorization;
  const [, token] = authHeader.split(" ");
  const curUser: any = decode(token);
  try {
    const user = await UserModel.findOne({ email: curUser.email }).lean();
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
  app.use(cors());
  const port = 3000;
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
      AuthController,
      UserController,
      SalesContractController,
      LoCController,
      InvoiceController,
      BoEController,
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

