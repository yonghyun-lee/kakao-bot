const { By, Key, until } = require('selenium-webdriver');

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

  async getDescription(item) {
    await this.driver.get('https://naver.com');

    await this.driver.findElement(By.name('query')).sendKeys(item, Key.RETURN);
    await this.driver.wait(until.elementLocated(By.className('news_tit')), 1000);
    const news = await this.driver.findElement(By.className('news_tit'));
    const image = await this.driver.findElement(By.css('.dsc_thumb img'));

    console.log(news.getAttribute('href'), image);
    return {
      url: await news.getAttribute('href'),
      title: await news.getAttribute('title'),
      imageUrl: await image.getAttribute('src'),
    };
  }

  async makeContents() {
    const ranks = await this.getSearchRank();
    const descriptions = [];
    const links = [];
    const imageUrls = [];
    for (const rank of ranks) {
      const data = await this.getDescription(rank);
      descriptions.push(data.title);
      links.push(data.url);
      imageUrls.push(data.imageUrl);
    }
    this.content = ranks.map((text, index) => {
      return {
        title: text,
        description: descriptions[index],
        imageUrl: imageUrls[index],
        link: {
          mobileWebUrl: links[index],
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
