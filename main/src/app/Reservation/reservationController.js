const jwtMiddleware = require("../../../config/jwtMiddleware");
const reservationProvider = require("../../app/Reservation/reservationProvider");
const reservationService = require("../../app/Reservation/reservationService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const moment = require('moment');

// 숙박 예약 등록
exports.postReservation = async function (req, res) {
  const googleToken = req.headers['authorization'];
  const googleTokenHeader = req.query.token;
  const userIdxFromJWT = req.verifiedToken.userIdx;
  const userIdx = req.params.userIdx;
  let { hostIdx, startDate, endDate, checkInTime, guestCnt, message } = req.body;
  const birthRegex = /^(20[0-9][0-9]|20\\d{2})-(0[0-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
  // 유저 빈 값 체크
  if (!userIdx)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

  // 구글 인증
  if (googleTokenHeader) {
    if (!googleToken)
      return res.send(errResponse(baseResponse.TOKEN_GOOGLE_EMPTY));

    if (googleTokenHeader != googleToken)
      return res.send(errResponse(baseResponse.GOOGLE_TOKEN_NOT_EXIST));
  }

  if (userIdxFromJWT != userIdx) {
    res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
  } else {

    // 호스트 빈 값 체크
    if (!hostIdx)
      res.send(errResponse(baseResponse.HOST_ID_NOT_MATCH));

    // 시작 날짜 빈 값 체크
    if (!startDate)
      res.send(errResponse(baseResponse.SIGNIN_STARTDATE_EMPTY));

    // 시작 날짜 형식 체크
    if (!birthRegex.test(startDate))
      res.send(errResponse(baseResponse.SIGNIN_STARTDATE_ERROR_TYPE));

    // 이전 날짜 체크
    // if (startDate < )
    //   res.send(errResponse(baseResponse.SIGNIN_STARTDATE_ERROR_MATCH));

    // 끝 날짜 빈 값 체크
    if (!endDate)
      res.send(errResponse(baseResponse.SIGNIN_ENDDATE_EMPTY));

    // 끝 날짜 형식 체크
    if (!birthRegex.test(endDate))
      res.send(errResponse(baseResponse.SIGNIN_ENDDATE_ERROR_TYPE));

    // 시작 날짜의 이전 날짜 체크
    if (startDate > endDate)
      res.send(errResponse(baseResponse.SIGNIN_ENDDATE_ERROR_MATCH));

    // 체크인 시간이 빈 값이면 조정가능으로 들어감
    if (!checkInTime)
      checkInTime = 'adjustment'

    // 게스트 수 빈 값 체크
    if (!guestCnt)
      res.send(errResponse(baseResponse.SIGNIN_USER_RESERVATION_GUESTCNT_EMPTY));

    // 게스트 수 21 미만 체크
    if (guestCnt > 21)
      res.send(errResponse(baseResponse.SIGNIN_SEARCH_GUESTCNT_LENGTH));


    const signUpReservation = await reservationService.createReservation(
        hostIdx, userIdx, startDate, endDate, checkInTime, guestCnt, message
    );

    return res.send(signUpReservation);
  }
};

// 예약한 숙박 조회
exports.getUserByReservation = async function (req, res) {
  const googleToken = req.headers['authorization'];
  const googleTokenHeader = req.query.token;
  const userIdxFromJWT = req.verifiedToken.userIdx;
  const userIdx = req.query.id;

  if (!userIdx)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

  // 구글 인증
  if (googleTokenHeader) {
    if (!googleToken)
      return res.send(errResponse(baseResponse.TOKEN_GOOGLE_EMPTY));

    if (googleTokenHeader != googleToken)
      return res.send(errResponse(baseResponse.GOOGLE_TOKEN_NOT_EXIST));
  }

  if (userIdxFromJWT != userIdx) {
    res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
  } else {

    // 유저 예약 조회
    const reservationListResult = await reservationProvider.retrieveReservation(userIdx);

    for (i = 0; i < reservationListResult.length; i++) {
      reservationListResult[i].hostInfo = await reservationProvider.retrieveReservationHost(reservationListResult[i].hostInfo)
      console.log(reservationListResult[i]);
      // 날짜 차이 계산 * 숙박 금액
      const startAccommodation = moment(reservationListResult[i].startDate);
      const endAccommodation = moment(reservationListResult[i].endDate);
      const diff = endAccommodation.diff(startAccommodation, 'days');

      // 사용자 총 숙박일
      {reservationListResult[i].totalDay =  diff}

      // 총 요금
      {reservationListResult[i].totalPrice = reservationListResult[i].guestCnt * reservationListResult[i].hostInfo[0].price}
    }

    return res.send(response(baseResponse.SUCCESS_USER_RESERVATION_SELECT, reservationListResult));
  }
};

// 숙박업체 이용 여부 수정
exports.patchIsLastReservation = async function (req, res) {
  const tripIdx = req.params.tripIdx;
  const { isLastTrip } = req.body;

  if (!tripIdx)
    return res.send(errResponse(baseResponse.TRIP_ID_NOT_MATCH));

    // 숙박업체 사용 이후인지에 대한 여부 빈 값 체크
    if (!isLastTrip)
      return res.send(errResponse(baseResponse.SIGNUP_TRIP_ISLAST_EMPTY));

    // 숙박업체 사용 여부는 Y만 가능
    if (isLastTrip != 'Y' && isLastTrip != 'N')
      return res.send(errResponse(baseResponse.SIGNUP_TRIP_ISLAST_ERROR_TYPE));

    const patchIsLastTripResult = await reservationService.editIsLastTrip(
        isLastTrip, tripIdx
    );

    return res.send(patchIsLastTripResult);
};

// 예약 삭제
exports.patchReservationStatus = async function (req, res) {
  const googleToken = req.headers['authorization'];
  const googleTokenHeader = req.query.token;
  const userIdxFromJWT = req.verifiedToken.userIdx;
  const userIdx = req.params.userIdx;
  const tripIdx = req.params.tripIdx;
  const { status } = req.body;

  if (!userIdx)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

  if (!tripIdx)
    return res.send(errResponse(baseResponse.TRIP_ID_NOT_MATCH));
  // 구글 인증
  if (googleTokenHeader) {
    if (!googleToken)
      return res.send(errResponse(baseResponse.TOKEN_GOOGLE_EMPTY));

    if (googleTokenHeader != googleToken)
      return res.send(errResponse(baseResponse.GOOGLE_TOKEN_NOT_EXIST));
  }

  if (userIdxFromJWT != userIdx) {
    res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
  } else {
    // 상태 빈 값 체크
    if (!status)
      return res.send(errResponse(baseResponse.SIGNIN_TRIP_STATUS_EMPTY));

    // 형식 체크
    if (status != 'N' && status != 'Y')
      return res.send(errResponse(baseResponse.SIGNIN_TRIP_STATUS_DELETE_ERROR_TYPE));

    const patchTripStatusResult = await reservationService.editTripStatus(
        status, userIdx, tripIdx
    );

    return res.send(patchTripStatusResult);
  }
};