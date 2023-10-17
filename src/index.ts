import 'reflect-metadata';
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
import { UserModel } from './model';
import { redisClient } from "./config/redis-client";
import { AuthController } from "./auth/auth.controller";
import { SalesContractController } from './sales_contract/sales-contract.controller';
import { LoCController } from './letter_of_credit/letter-of-credit.controller';
import cors from 'cors';
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
    console.log(user);
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const curUser: any = decode(token);
  try {
    // console.log(curUser);
    // TODO: in prod: add filter: del_flag:false,status: 1
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
    controllers: [AuthController, SalesContractController, LoCController],
    authorizationChecker,
    currentUserChecker,
  };
  useExpressServer(app, routingControllersOptions);
  // app.use("/", mainRouter);
  const server = http.createServer(app);
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
main();
// try {
//   mongoose.connect(process.env.MONGO_URL).then(() => console.log("connect db successfully"));
// }
// catch(err) {
//   console.log(err);
// }
