import mongoose from "mongoose";

export const connectDataBase = async () => {
     try {
          await mongoose.connect("mongodb://localhost:27017/shop");
          console.log("Connected to database");
     } catch (error) {
          console.log("Failed to connect to database");
     }
};
