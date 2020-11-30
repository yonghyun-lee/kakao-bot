const dotenv = require('dotenv');
const Koa = require('koa');
const app = new Koa();
const serve = require('koa-static');
const path = require('path');
const selenium = require('./selenium');

dotenv.config();

app.use(serve('public', path.join(__dirname, '/public')))

app.listen(3000);

selenium.login();
