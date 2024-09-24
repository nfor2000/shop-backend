import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const Authenticator = async (
     req: Request | any,
     res: Response,
     next: NextFunction
) => {
     let token;

     if (
          req.headers.authorization &&
          req.headers.authorization.startsWith("Bearer")
     ) {
          token = req.headers.authorization.split(" ")[1];

          try {
               const decode: any = await jwt.verify(token, "secret-key-#1");
               req.user = decode.userId;
               next();
          } catch (error) {
               return res.status(401).send("Not authorised");
          }
     }

     if (!token) {
          res.status(401).send("No token , Not authorised");
     }
};
