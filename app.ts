import createError from "http-errors";
import express, { Request, Response, Express, NextFunction} from "express";
import session from "express-session";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import passport from "passport";
import connectSQLite3 from "connect-sqlite3";

import { router as indexRouter } from "./routes/index";
import { router as authRouter } from "./routes/auth";

const SQLiteStore = connectSQLite3(session);

const app = express();

// setup view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// setup middelware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "TODO: CHANGE ME",
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' }) as session.Store, // Use `new` to create an instance
  })
);
app.use(passport.authenticate("session"));

// setup routes
app.use("/", indexRouter);
app.use("/", authRouter);

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function (err: createError.HttpError, req:Request, res:Response, next:NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
