import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import compression from "compression";
import dotenv from "dotenv";
import userRouter from "./app/user/user.router";
import creditRouter from "./app/credit/credit.router";

if (!process.env.DB_URL || !process.env.TOKEN_SECRET) {
  throw new Error("Please set all the environment variables");
}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 3600,
  })
);
app.use(helmet());
app.use(compression());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  keyGenerator: function (req: any) {
    return req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  },
});

app.use(limiter);

app.use(morgan("combined"));

app.use("/api/user", userRouter);
app.use("/api/credit", creditRouter);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;
