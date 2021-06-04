module.exports = function(app) {
  const review = require('./reviewController');
  const jwtMiddleware = require('../../../config/jwtMiddleware');

  // 호스트 리뷰 등록
  app.post('/app/reviews/:userIdx', jwtMiddleware, review.postUserByReview);

  // 호스트 리뷰 조회
  app.get('/app/reviews/:userIdx/hosts', jwtMiddleware, review.getHostReview);

  // 호스트 리뷰 수정
  app.patch('/app/reviews/:userIdx/:reviewIdx', jwtMiddleware, review.patchReviewInfo);

  // 호스트 리뷰 삭제
  app.patch('/app/reviews/status/:userIdx/:reviewIdx', jwtMiddleware, review.patchMessageStatus);
}