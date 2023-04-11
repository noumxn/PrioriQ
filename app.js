import express from 'express';
import exphbs from 'express-handlebars';
import {dirname} from 'path';
import {fileURLToPath} from 'url';
import configRoutes from './routes/index.js';
import dotenv from 'dotenv';
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
app.use(express.urlencoded({extended: true}));
app.use(rewriteUnsupportedBrowserMethods);

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.json());

configRoutes(app);

app.listen(process.env.PORT, () => {
  console.log("We've now got a server!");
});

