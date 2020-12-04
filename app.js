const dotenv = require('dotenv');
const Koa = require('koa');
const app = new Koa();
const serve = require('koa-static');
const path = require('path');
const Router = require('koa-router');
const { KakaoAuto } = require('./kakao');
const { Search } = require('./search');
const { Builder } = require('selenium-webdriver');
const cron = require('node-cron');
dotenv.config();

const router = new Router();
const search = new Search();
const kakaoAuto = new KakaoAuto(process.env.id, process.env.password);

app.use(serve('public', path.join(__dirname, '/public')))

router.get('/rank', (ctx) => (ctx.body = {
  objectType: 'list',
  headerTitle: search.getTime(),
  headerLink: {
    mobileWebUrl: 'https://naver.com',
    webUrl: 'https://naver.com',
  },
  contents: search.getContent('rank'),
}));

router.get('/hotDeal', (ctx) => (ctx.body = {
  objectType: 'list',
  headerTitle: '핫딜 정보',
  headerLink: {
    mobileWebUrl: 'https://algumon.com/deal/rank',
    webUrl: 'https://algumon.com/deal/rank',
  },
  contents: search.getContent('hotDeal'),
}));

app.use(router.routes());
app.listen(3000);

cron.schedule('0 1 10-23/3 * * *', async () => {
  const driver = new Builder().forBrowser('chrome').build();
  search.setDriver(driver);
  kakaoAuto.setDriver(driver);

  try {
    await search.start('rank');
    if (new Date().getHours() === 9) {
      await search.start('hotDeal');
    }
    await kakaoAuto.start();
  } catch (e) {
    console.log(e);
  } finally {
    await driver.quit();
  }
})
