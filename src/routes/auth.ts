import { Router, Request, Response, NextFunction } from 'express';
import { passport, signUp } from '../auth';
import DiscoUser from '../classes/DiscoUser';

const router = Router();

router.get('/login', function (_, res: Response) {
  res.render('login');
});

router.post(
  '/login/password',
  (req: Request, res: Response, next: NextFunction) => {
    const returnTo = req.session.returnTo; // Save the returnTo property

    passport.authenticate('local', (err: Error | null, user: Express.User) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect('/login');
      }

      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }

        // Redirect to the original page or fallback to '/'
        const redirectUrl = returnTo ? returnTo : '/';
        res.redirect(redirectUrl);
      });
    })(req, res, next);
  },
);

router.post(
  '/logout',
  function (req: Request, res: Response, next: NextFunction) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  },
);

router.get('/signup', function (_, res: Response) {
  res.render('signup');
});

router.post(
  '/signup',
  function (req: Request, res: Response, next: NextFunction) {
    signUp(
      req.body.username,
      req.body.password,
      function (err: Error | null, user?: DiscoUser) {
        if (err) {
          if ('errno' in err) {
            return res
              .status(430)
              .send('Username already exists. Please choose another.');
          }
        } else if (!user) {
          return next(err);
        } else {
          req.login(user, function (err) {
            if (err) {
              return next(err);
            }
            res.redirect('/');
          });
        }
      },
    );
  },
);
export default router;

// module.exports = router;
