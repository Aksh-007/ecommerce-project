import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
const app = express();

//middleware
app.use(express.json());
// when we want to use form data we use urlencoded
app.use(express.urlencoded({ extended: true }));
// never put * in cors
app.use(cors());
// so we can access of cookies
app.use(cookieParser());
// morgan is a logger we can use many method like combined , tiny so many are there
app.use(morgan('tiny'));



export default app;