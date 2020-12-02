const { By, Key, until } = require('selenium-webdriver');

class KakaoAuto {
  driver;
  id;
  password;

  constructor(driver, id, password) {
    this.driver = driver;
    this.id = id;
    this.password = password;
  }

  async start() {
    await this.login();
    await this.send('김진형');
  }

  async login() {
    await this.driver.get('http://localhost:3000/index.html');

    const emailInput = await this.driver.findElement(By.name('email'));
    emailInput.sendKeys(this.id);

    const passwordInput = await this.driver.findElement(By.name('password'));
    passwordInput.sendKeys(this.password, Key.RETURN);

    await this.driver.wait(until.titleIs('main'), 1000);
  }

  async send(chatTitle) {
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
    await this.driver.wait(until.elementLocated(By.className('link_tab')), 1000);
    const tabs = await this.driver.findElements(By.className('link_tab'));
    await tabs[1].click();

    await this.driver.wait(until.elementLocated(By.className('unit_chat')), 1000);
    const chats = await this.driver.findElements(By.className('unit_chat'));

    const chatList = [];
    for (let i = 0; i < chats.length; i++) {
      chatList.push(await chats[i].getText());
    }
    const index = chatList.findIndex(chat => {
      return chat.includes(chatTitle);
    })

    const checkboxes = await this.driver.findElements(By.css('input[type=checkbox]'));

    await checkboxes[index || 0].click();

    const button = await this.driver.findElement(By.css('button > div'));
    await this.driver.wait(until.elementTextContains(button, '공유하기'));
    await this.driver.findElement(By.css('button')).click();
  }
}

exports.KakaoAuto = KakaoAuto;
