Kakao.init('083e598995ecb91caceef3bc8c4287eb');

class HttpClient {
  constructor() {
    this.xhr = new XMLHttpRequest();
    this.xhr.onload = () => {
      console.log(this.xhr.readyState);
    }
  }

  set onload(callback) {
    this.xhr.onload = callback;
  }

  get(url) {
    this.xhr.open('GET', url);
    this.xhr.send();
  }
}

function sendLink() {
  const httpClient = new HttpClient();

  httpClient.onload = event => {
    Kakao.Link.sendDefault(JSON.parse(event.currentTarget.response));
  };
  httpClient.get('http://localhost:3000/rank');
}

function sendLinkHotDeal() {
  const httpClient = new HttpClient();

  httpClient.onload = event => {
    Kakao.Link.sendDefault(JSON.parse(event.currentTarget.response));
  };
  httpClient.get('http://localhost:3000/hotDeal');
}

window.onload = () => {
  const code = window.location.search.split('=')[1];
  console.log(code);

  Kakao.Auth.login({
    success: (auth) => {
      document.getElementById('login').innerText = 'login';
    }
  })
}
