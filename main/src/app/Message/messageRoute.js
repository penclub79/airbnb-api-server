module.exports = function(app) {
  const message = require('./messageController');
  const jwtMiddleware = require('../../../config/jwtMiddleware');

  // 메세지 등록
  app.post('/app/messages/:userIdx', jwtMiddleware, message.postUserByMessage);

  // 사용자 메세지 조회
  app.get('/app/messages', message.getUserMessage);

  // 메세지 삭제
  app.patch('/app/messages/status/:userIdx/:messageIdx', jwtMiddleware, message.patchMessageStatus);
}