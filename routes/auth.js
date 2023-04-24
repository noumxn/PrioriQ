import {Router} from 'express';
const router = Router();
import userData from '../data/users.js'

router.route('/').get(async (req, res) => {
  //code here for GET THIS ROUTE SHOULD NEVER FIRE BECAUSE OF MIDDLEWARE #1 IN SPECS.
  return res.json({error: 'YOU SHOULD NOT BE HERE!'});
});

router
  .route('/register')
  .get(async (req, res) => {
    res.status(200).render("../views/register");
  })
  .post(async (req, res) => {

  });

router
  .route('/login')
  .get(async (req, res) => {
    return res.status(200).render("../views/login");
  })
  .post(async (req, res) => {
  });

  router.route('/error').get(async (req, res) => {
    res.status(403).render("../views/error");
  });
  
  router.route('/logout').get(async (req, res) => {
    req.session.destroy();
    res.status(200).render("../views/logout");
  });

  export default router;