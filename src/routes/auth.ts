import { Router, Request, Response, NextFunction } from 'express';
import { passport, signUp } from '../auth';
import DiscoUser from '../classes/DiscoUser';
const router = Router();

router.get('/login', function (_, res: Response) {
  res.render('login');
});

router.post(
  '/login/password',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureMessage: true,
  }),
);

router.post('/logout', function (req: Request, res: Response, next: NextFunction) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

router.get('/signup', function (_, res:Response) {
  res.render('signup');
});

router.post('/signup', function (req:Request, res:Response, next: NextFunction) {
  signUp(
    req.body.username,
    req.body.password,
    function (err: Error | null, user?: DiscoUser) {
      if (err || !user) return next(err);
      req.login(user, function (err) { 
        if (err) return next(err);
        res.redirect('/');  
      });
    },
  );
});

export default router;

// module.exports = router;
