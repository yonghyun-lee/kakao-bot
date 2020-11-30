const { Builder, By, Key, until } = require('selenium-webdriver');

class KakaoAuto {
  driver;
  id;
  password;

  async constructor(id, password) {
    this.driver = await new Builder().forBrowser('chrome').build();
    this.id = id;
    this.password = password;
  }

  start() {
    this.login()
  }

  async login() {
    await this.driver.get('http://localhost:3000/index.html');

    const emailInput = await this.driver.findElement(By.name('email'));
    emailInput.sendKeys(this.id);

    const passwordInput = await this.driver.findElement(By.name('password'));
    passwordInput.sendKeys(this.password, Key.RETURN);

    await this.driver.wait(until.titleIs('main'), 1000);
    const login = await this.driver.findElement(By.id('login'));
    await this.driver.wait(until.elementTextIs(login, 'login'), 3000);

    await this.driver.findElement(By.id('kakao-link-btn')).click();

    //Wait for the new window or tab
    await this.driver.wait(
      async () => (await this.driver.getAllWindowHandles()).length === 2,
      10000
    );

    const originalWindow = await this.driver.getWindowHandle();

    const windows = await this.driver.getAllWindowHandles();
    for (const handle of windows) {
      if (handle !== originalWindow) {
        await this.driver.switchTo().window(handle);
      }
    }

    await this.driver.wait(until.titleIs('카카오톡 공유'), 3000);

    await this.driver.findElement(By.linkText('채팅')).click();

    await this.driver.wait(until.titleIs('카카오톡 공유'), 3000);

    const chat = await this.driver.findElement(By.)
  }


}
const login = async () => {
  let driver = await new Builder().forBrowser('chrome').build();
  try {


  } finally {
    await driver.quit();
  }
};

exports.login = login;