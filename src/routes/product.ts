import { Router, Response, Request, response } from "express";
import { Authenticator } from "../middleware";
import { ProductError, ServerError, UserError } from "../config/error";
import { ProductModel } from "../model/product";
import { UserModel } from "../model/user";

const router = Router();

router.get("/", async (_, res: Response) => {
     try {
          const products = await ProductModel.find();
          if (!products) {
               return res
                    .status(400)
                    .json({ type: ProductError.Products_Not_Found });
          }

          res.status(200).json(products);
     } catch (error) {
          res.status(500).json({ type: ServerError.Server_Error });
     }
});

router.post(
     "/checkout",
     Authenticator,
     async (req: Request | any, res: Response) => {
          const cartItems = req.body;
          const id = req?.user;

          let totalPrice = 0;
          const productIDs = Object.keys(cartItems);
          try {
               const user = await UserModel.findById(id);
               if (!user) {
                    return res
                         .status(400)
                         .json({ type: UserError.User_Not_Found });
               }
               const products = await ProductModel.find({
                    _id: { $in: productIDs },
               });

               if (productIDs.length !== products.length) {
                    return res
                         .status(400)
                         .json({ type: ProductError.Products_Not_Found });
               }

               for (const item in cartItems) {
                    const product = products.find(
                         (product) => String(product._id) === item
                    );
                    if (!product) {
                         return res
                              .status(400)
                              .json({ type: ProductError.Products_Not_Found });
                    }

                    if (cartItems[item] > product.quantity) {
                         return res.status(400).json({
                              type: ProductError.Products_Out_Of_Stock,
                         });
                    }
                    totalPrice += cartItems[item] * product.price;
               }

               if (totalPrice > user.availableMoney) {
                    return res
                         .status(400)
                         .json({ type: UserError.Not_Enough_Money });
               }

               user.availableMoney -= totalPrice;
               user.puchasedItems.push(...productIDs);

               await user.save();
               await ProductModel.updateMany(
                    {
                         _id: { $in: productIDs },
                    },
                    {
                         $inc: { quantity: -1 },
                    }
               );

               res.status(200).json(user.puchasedItems);
          } catch (error) {
               res.status(500).json({ type: ServerError.Server_Error });
          }
     }
);

export { router as productRouter };
