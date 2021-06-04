module.exports = function(app) {
  const auth = require('./authController');

  // 구글 인증
  app.get('/app/auth/google', auth.getGoogleLogin);

  // 사용자 정보 가져오기
  // app.get('/oauth', auth.getGoogleUserInfo);

};