import { Router, Response, Request } from "express";
import { IUser, UserModel } from "../model/user";
import { ServerError, UserError } from "../config/error";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Authenticator } from "../middleware";
const router = Router();

router.post("/login", async (req: Request, res: Response) => {
     const { email, password } = req.body;

     try {
          const user: IUser | null = await UserModel.findOne({ email });
          if (!user) {
               return res.status(404).json({ type: UserError.User_Not_Found });
          }
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
               return res
                    .status(400)
                    .json({ type: UserError.Wrong_Credential });
          }

          const token = await jwt.sign({ userId: user._id }, "secret-key-#1");

          res.status(200).json({ token, id: user._id });
     } catch (error) {
          res.status(500).json({ type: ServerError.Server_Error });
     }
});

router.post("/register", async (req: Request, res: Response) => {
     const { username, email, password } = req.body;

     try {
          const user: IUser | null = await UserModel.findOne({ email });

          if (user) {
               return res
                    .status(400)
                    .json({ type: UserError.User_Already_Exist });
          }

          const hashedPassword = await bcrypt.hash(password, 10);

          const newUser = new UserModel({
               email,
               username,
               password: hashedPassword,
          });

          await newUser.save();

          const token = await jwt.sign(
               { userId: newUser._id },
               "secret-key-#1"
          );

          res.status(200).json({ token, id: newUser._id });
     } catch (error) {
          res.status(500).json({ type: ServerError.Server_Error });
     }
});

router.get("/", Authenticator, async (req: Request | any, res: Response) => {
     const id = req?.user;

     try {
          const user = await UserModel.findById(id);

          if (!user) {
               return res.status(404).json({ error: "User not found" });
          } else {
          }

          res.status(200).json(user);
     } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Server error" });
     }
});

export { router as userRouter };
