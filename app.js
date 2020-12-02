const dotenv = require('dotenv');
const Koa = require('koa');
const app = new Koa();
const serve = require('koa-static');
const path = require('path');
const Router = require('koa-router');
const { KakaoAuto } = require('./kakao');
const { Search } = require('./search');
const { Builder } = require('selenium-webdriver');
dotenv.config();

const router = new Router();
const driver = new Builder().forBrowser('chrome').build();
const search = new Search(driver);
const kakaoAuto = new KakaoAuto(driver, process.env.id, process.env.password);

app.use(serve('public', path.join(__dirname, '/public')))

router.get('/data', (ctx) => (ctx.body = {
  objectType: 'list',
  headerTitle: search.getTime(),
  headerLink: {
    mobileWebUrl: 'https://developers.kakao.com',
    androidExecParams: 'test',
  },
  contents: search.getContent(),
}));

app.use(router.routes());
app.listen(3000);

(async function () {
  try {
    await search.start();
    console.log(search.getContent());
    await kakaoAuto.start();
  } catch (e) {
    console.log(e);
  } finally {
    await driver.quit();
  }
})();
