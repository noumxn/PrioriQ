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
    let email = req.body.emailAddressInput;
    let password = req.body.passwordInput;
    let first = req.body.firstNameInput;
    let last = req.body.lastNameInput;
    let user = req.body.usernameInput;
    let confirm = req.body.confirmPasswordInput;
    let dob = req.body.dobInput;
    if(email === null){
      return res.status(400).render("../views/register", {error:true, e:"Email is missing a value"});
    }
    if(password === null){
      return res.status(400).render("../views/register", {error:true, e:"Password is missing a value"});
    }
    if(first === null){
      return res.status(400).render("../views/register", {error:true, e:"First name is missing a value"});
    }
    if(last === null){
      return res.status(400).render("../views/register", {error:true, e:"Last name is missing a value"});
    }
    if(user === null){
      return res.status(400).render("../views/register", {error:true, e:"User is missing a value"});
    }
    if(confirm === null){
      return res.status(400).render("../views/register", {error:true, e:"Confirm Password is missing a value"});
    }
    if(dob === null){
      return res.status(400).render("../views/register", {error:true, e:"Confirm Password is missing a value"});
    }
    let year = dob.substring(0,4); let month=dob.substring(5,7); let day=dob.substring(8);
    first = first.trim(); last = last.trim(); email = email.trim().toLowerCase(); password = password.trim(); confirm = confirm.trim();
    user = user.trim().toLowerCase(); dob=month+"/"+day+"/"+year;
    console.log(dob);
    try{
      await userData.createUser(first, last, dob, email, user, password);
      res.redirect("/login");
    }catch(e){
      return res.status(400).render("../views/register", {error:true, e:"Failed to create"});
    }
  });

router
  .route('/login')
  .get(async (req, res) => {
    return res.status(200).render("../views/login");
  })
  .post(async (req, res) => {
    let user = req.body.usernameInput;
    let password = req.body.passwordInput;
    if(user === null){
      return res.status(400).render("../views/login", {error:true, e:"User is missing a value"});
    }
    if(password === null){
      return res.status(400).render("../views/login", {error:true, e:"Password is missing a value"});
    }
    try{
      req.session.user = await userData.authenticateUser(user, password);
      res.status(200).redirect("/homepage");
    }catch(e){
      return res.status(400).render("../views/login", {error:true, e:e});
    }
  });

  router.route('/error').get(async (req, res) => {
    res.status(403).render("../views/error");
  });
  
  router.route('/logout').get(async (req, res) => {
    req.session.destroy();
    res.status(200).render("../views/logout");
  });

  export default router;