import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import path from 'path';
import logger from 'morgan';
import passport from 'passport';
import connectSQLite3 from 'connect-sqlite3';
// import csrf from 'csurf';

import indexRouter from './routes/index';
import authRouter from './routes/auth';

const SQLiteStore = connectSQLite3(session); // returns a class

export const app = express();

// setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// setup middelware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    name: 'connect.sid', // default
    secret: 'TODO: CHANGE ME',
    resave: false,
    cookie: {
      sameSite: 'strict',
      secure: false, // TODO: set to true
    },
    saveUninitialized: false,
    // @ts-expect-error the sqlitestore types are not compatible with express-session
    store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' }), //
  }),
);
// app.use(csrf());
app.use(passport.authenticate('session'));
// app.use(function(req, res, next) {
//   res.locals.csrfToken = req.csrfToken();
//   next();
// });
// setup routes
app.use('/', indexRouter);
app.use('/', authRouter);

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function (
  err: createError.HttpError,
  req: Request,
  res: Response,
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
