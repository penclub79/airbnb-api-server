module.exports = function(app) {
  const notice = require('./noticeController');
  const jwtMiddleware = require('../../../config/jwtMiddleware');

  // 알림 등록
  app.post('/app/notices', jwtMiddleware, notice.postUserByAlarm);

  // 유저 알림 조회
  app.get('/app/notice/users', jwtMiddleware, notice.getUserNotice);

  // 알림 삭제
  app.patch('/app/notice/status/:userIdx/:noticeIdx', jwtMiddleware, notice.patchNoticeStatus);
}