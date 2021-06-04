const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const reservationProvider = require("./reservationProvider");
const reservationDao = require("./reservationDao");
const hostProvider = require("../Host/hostProvider");
const searchProvider = require("../Search/searchProvider");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");
const moment = require("moment");

exports.createReservation = async function (hostIdx, userIdx, startDate, endDate, checkInTime, guestCnt, message) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    // ACTIVE인 호스트 체크
    const hostRows = await hostProvider.perfactHostCheck(hostIdx);

    // 해당 호스트 조회 없을때
    if (hostRows.length == 0)
      return errResponse(baseResponse.SIGNUP_HOST_NOT_MATCH);

    // 유저 검색 조건 체크
    const userSearchRows = await searchProvider.retrieveUserByHost({hostIdx:hostIdx}, startDate, guestCnt);

    // 검색 조건 없을때
    if (userSearchRows.length == 0)
      return errResponse(baseResponse.SIGNUP_HOST_NOT_MATCH);

    // 예약 등록 중복 체크
    const reservationRows = await reservationProvider.reservationCheck(hostIdx, userIdx);

    if (reservationRows.length > 0)
      return errResponse(baseResponse.SIGNUP_REDUNDANT_USER_RESERVATION);

    // 예약 등록
    const insertReservationParams = [hostIdx, userIdx, startDate, endDate, checkInTime, guestCnt, message];
    const reservationResult = await reservationDao.insertReservation(connection, insertReservationParams);

    return response(baseResponse.SUCCESS_USER_RESERVATION, `추가된 예약 idx: ${reservationResult[0].insertId}`);

  } catch (err) {
    logger.error(`App - createReservation Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.editIsLastTrip = async function (isLastTrip, tripIdx) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    // 여행 등록 여부 체크
    const tripRows = await reservationProvider.tripCheck(tripIdx);

    // 등록된 여행이 없다면
    if (tripRows.length == 0)
      return errResponse(baseResponse.SIGNUP_TRIP_NOT_REGISTER);

    // 이용한 예약인지 체크
    if (tripRows[0].isLastTrip == isLastTrip)
      return errResponse(baseResponse.SIGNUP_REDUNDANT_TRIP_DELETE);

    // 지난 여행으로 업데이트
    const isLastTripResult = await reservationDao.updateIsLastTrip(connection, isLastTrip, tripIdx);

    return response(baseResponse.SUCCESS_LASTTRIP_MODIFY, `수정된 여행Idx: ${tripIdx}`)

  } catch (err) {
    logger.error(`App - editIsLastTrip Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.editTripStatus = async function (status, userIdx, tripIdx) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    // 여행 등록 여부 체크
    const tripRows = await reservationProvider.tripCheck(tripIdx);

    // 등록된 여행이 없다면
    if (tripRows.length == 0)
      return errResponse(baseResponse.SIGNUP_TRIP_NOT_REGISTER);

    // 여행 상태 중복값 체크
    const isTripDelete = await reservationProvider.deleteTripCheck(tripIdx);
    if (isTripDelete[0].status == status)
      return errResponse(baseResponse.SIGNUP_REDUNDANT_TRIP_DELETE);

    // 여행 삭제 업데이트
    const updateTripStatus = await reservationDao.updateTripStatus(connection, status, userIdx, tripIdx);


    return response(baseResponse.SUCCESS_LASTTRIP_DELETE, `삭제된 여행Idx: ${tripIdx}`)

  } catch (err) {
    logger.error(`App - editTripStatus Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}