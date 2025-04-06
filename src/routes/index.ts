import { Router, Request, Response } from 'express';
import { ensureLoggedIn } from 'connect-ensure-login'; // eslint-disable-line

// var ensureLoggedIn = ensureLoggedIn();

const router = Router();

/* GET home page. */
router.get('/', function (req: Request, res: Response) {
  if (!req.user) {
    res.render('index');
  } else {
    res.render('index', { username: req.user.username });
  }
});

router.get('/disco', function (req: Request, res: Response) {
  res.render('disco');
});

router.get('/disco/:discoID', function (req: Request, res: Response) {
  res.render('disco');
});

export default router;
