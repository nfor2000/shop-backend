import express, { Express } from "express";
import cors from "cors";
import { connectDataBase } from "./config/config";
import { userRouter } from "./routes/user";
import { productRouter } from "./routes/product";

const app: Express = express();
connectDataBase();

app.use(express.json());

app.use(cors());

app.use("/user", userRouter);
app.use("/products", productRouter);

app.listen(3001, () => console.log("Server running"));
