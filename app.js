const dotenv = require('dotenv');
const Koa = require('koa');
const app = new Koa();
const serve = require('koa-static');
const path = require('path');
const { KakaoAuto } = require('./selenium');
dotenv.config();
const kakaoAuto = new KakaoAuto(process.env.id, process.env.password);

app.use(serve('public', path.join(__dirname, '/public')))

app.listen(3000);

(async function () {
  await kakaoAuto.start();
})();
