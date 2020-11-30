Kakao.init('083e598995ecb91caceef3bc8c4287eb');

window.onload = () => {
  Kakao.Auth.authorize({
    redirectUri: 'http://localhost:3000/main.html'
  });
}
