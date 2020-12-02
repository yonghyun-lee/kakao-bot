const { Builder, By, Key, until } = require('selenium-webdriver');

class Search {
  driver;
  time = '';
  content = [];

  setDriver(driver) {
    this.driver = driver;
  }

  async start() {
    await this.makeContents();
  }

  async getSearchRank() {
    await this.driver.get('http://rank.ezme.net/diff');

    const time = await this.driver.findElement(By.css('table.mdl-data-table > tbody > tr:nth-child(1) > td:nth-child(1)'));

    this.time = await time.getText();

    let result = [];
    for (let i = 0; i < 3; i++) {
      let trIndex, tdIndex;
      trIndex = i + 1;
      if (i === 0) {
        tdIndex = 4;
      } else {
        tdIndex = 3;
      }
      const data = await this.driver.findElement(
        By.css(`table.mdl-data-table > tbody > tr:nth-child(${trIndex}) > td:nth-child(${tdIndex}) > span`)
      );
      result.push(await data.getText());
    }

    return result;
  }

  async makeContents() {
    const rank = await this.getSearchRank();
    this.content = rank.map(text => {
      return {
        title: text,
        imageUrl: '',
        link: {
          mobileWebUrl: 'https://developers.kakao.com',
        }
      }
    });
  }

  getTime() {
    return this.time;
  }

  getContent() {
    return this.content;
  }
}

exports.Search = Search;
