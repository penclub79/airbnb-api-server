module.exports = function(app){
  const users = require('./usersController');
  const jwtMiddleware = require('../../../config/jwtMiddleware');

  // 0. 테스트 API
  // app.get('/app/test', user.getTest)

  // 1. 유저 생성 (email - 회원가입) API
  app.post('/app/join-users', users.postUsers);

  // 2. 이메일 & 폰 로그인
  app.post('/app/users/login', users.login);

  // 3. 유저 조회 API (+ 검색)
  app.get('/app/users', users.getUsers);

  // 4. 사용자 정보 수정 API
  app.patch('/app/users/:userIdx', jwtMiddleware, users.patchUsers);

  // 5. 특정 유저 상태 변경 API
  app.patch('/app/users/status/:userIdx', jwtMiddleware, users.patchUsersStatus);

  // TODO: After 로그인 인증 방법 (JWT)
  // 로그인 하기 API (JWT 생성)
  // app.post('/app/login', user.login);
  //
  // // 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
  // app.patch('/app/users/:userId', jwtMiddleware, user.patchUsers)

  // TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
  // JWT 검증 API
  app.get('/app/auto-login', jwtMiddleware, users.check);

};




// TODO: 탈퇴하기 API