import { Router, Request, Response } from 'express';
import { ensureLoggedIn } from 'connect-ensure-login';

const router = Router();

router.get(
  '/profile',
  ensureLoggedIn('/login'),
  function (req: Request, res: Response) {
    // return profile data:
    // pfp, username, email, bio, etc.
    res.render('profile');
  },
);

export default router;
