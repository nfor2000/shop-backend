import { Schema, model } from "mongoose";

interface IProduct {
     title: string;
     image: string;
     price: number;
     description: string;
     brand: string;
     model: string;
     color: string;
     category: string;
     quantity: number;
}

const ProductSchema = new Schema<IProduct>({
     title: {
          type: String,
     },
     price: {
          type: Number,
     },
     description: {
          type: String,
     },
     image: {
          type: String,
     },
     color: {
          type: String,
     },
     brand: {
          type: String,
     },
     quantity: {
          type: Number,
          min: 0,
     },
     category: {
          type: String,
     },
});

export const ProductModel = model("product", ProductSchema);
