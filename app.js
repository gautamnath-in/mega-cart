import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";

const app = express();
//once app is created then only we can use middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));//when we want to use form data

//to only allow some specefic url access the backend
app.use(cors())

app.use(cookieParser());

//morgan logger
//tells us who is requesting on what route
//print info abt our req and res in console
app.use(morgan('tiny'))


export default app;