module.exports = function(app) {
  const reservation = require('./reservationController');
  const jwtMiddleware = require('../../../config/jwtMiddleware');

  // 예약 등록
  app.post('/app/reservations/:userIdx', jwtMiddleware, reservation.postReservation);

  // 예약 조회
  app.get('/app/reservations/users', jwtMiddleware, reservation.getUserByReservation);

  // 예약 사용 여부 수정
  app.patch('/app/reservations/:tripIdx', jwtMiddleware, reservation.patchIsLastReservation);

  // 예약 삭제
  app.patch('/app/reservations/status/:userIdx/:tripIdx', jwtMiddleware, reservation.patchReservationStatus);
}