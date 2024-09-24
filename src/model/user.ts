import { Schema, model } from "mongoose";

export interface IUser {
     _id?: string;
     username: string;
     password: string;
     email: string;
     availableMoney: number;
     puchasedItems: string[];
}

const UserSchema = new Schema<IUser>({
     username: {
          type: String,
          required: true,
     },
     email: {
          type: String,
          required: true,
     },
     password: {
          type: String,
          required: true,
     },

     availableMoney: {
          type: Number,
          default: 500,
     },
     puchasedItems: [
          {
               type: Schema.Types.ObjectId,
               ref: "prodct",
               default: [],
          },
     ],
});

export const UserModel = model<IUser>("user", UserSchema);
