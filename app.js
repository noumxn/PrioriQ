import express from 'express';
import exphbs from 'express-handlebars';
import {dirname} from 'path';
import {fileURLToPath} from 'url';
import configRoutes from './routes/index.js';
import dotenv from 'dotenv';
import session from 'express-session';
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

const staticDir = express.static(__dirname + '/public');

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  next();
};

app.use('/public', staticDir);
app.use(express.json());
//cookie set up
app.use(
  session({
    name: 'AwesomeWebApp',
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: false,
    resave: false,
    cookie: {maxAge: 600000000000}
  })
);

app.all('/', (req, res, next) => {
  //console.log(req.session.id);
  if(!req.session.user){
    return res.redirect('/login');
  }else if(req.session.user){
    return res.redirect('/homepage');
  }else{
    next();
  }
});
app.get('/login', (req, res, next) => {
  if(req.session.user){
    return res.redirect('/homepage');
  }else{
    next();
  }
});
app.get('/register', (req,res,next) =>{
  if(req.session.user){
    return res.redirect('/homepage');
  }else{
    next();
  }
});
app.get('/usersettings', (req,res,next) =>{
  if(!req.session.user){
    return res.redirect('/login');
  }else{
    next();
  }
});
app.get('/boards/:id', (req,res,next) =>{
  if(!req.session.user){
    return res.redirect('/login');
  }else{
    next();
  }
});
app.get('/boardsettings', (req,res,next) =>{
  if(!req.session.user){
    return res.redirect('/login');
  }else{
    next();
  }
});
app.get('/homepage', (req,res,next) =>{
  if(!req.session.user){
    return res.redirect('/login');
  }else{
    next();
  }
});


app.use(express.urlencoded({extended: true}));
app.use(rewriteUnsupportedBrowserMethods);

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.json());

configRoutes(app);

app.listen(process.env.PORT, () => {
  console.log("We've now got a server!");
});

