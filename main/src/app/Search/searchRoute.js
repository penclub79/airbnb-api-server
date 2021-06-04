module.exports = function(app) {
  const search = require('./searchController');
  const jwtMiddleware = require('../../../config/jwtMiddleware');

  // 유저 호스트 검색(예약 전 검색)
  app.get('/app/:userIdx/hosts', jwtMiddleware, search.getUserByHost);
};