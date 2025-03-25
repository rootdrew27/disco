var createError = require("http-errors");
var express = require("express");
var session = require("express-session");
// const RedisStore = require('connect-redis').default;
// const { createClient } = require("redis");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var passport = require("passport");

var SQLiteStore = require('connect-sqlite3')(session);

var indexRouter = require("./routes/index");
var authRouter = require("./routes/auth");

var app = express();

// const redisClient = createClient({
//   socket: {
//     host: "127.0.0.1",
//     port: 6379
//   }
// });

// redisClient.connect().catch(console.error);


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    // store: new RedisStore({ client: redisClient }),
    secret: "TODO: CHANGE ME",
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' }),
  })
);
app.use(passport.authenticate("session"));

app.use("/", indexRouter);
app.use("/", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
