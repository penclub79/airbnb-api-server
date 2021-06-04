const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const reservationDao = require("./reservationDao");

exports.reservationCheck = async function (hostIdx, userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const reservationListResult = await reservationDao.selectReservationList(connection, hostIdx, userIdx);
  connection.release();

  return reservationListResult;
};

exports.retrieveReservation = async function (userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const retrieveReservationResult = await reservationDao.selectUserReservationList(connection, userIdx);
  connection.release();

  return retrieveReservationResult;
};

// 호스트 정보 조회
exports.retrieveReservationHost = async function (hostIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const retrieveReservationHostResult = await reservationDao.selectretrieveReservationHost(connection, hostIdx);
  connection.release();

  return retrieveReservationHostResult;
}

// 등록 여행 체크
exports.tripCheck = async function (tripIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const tripCheckResult = await reservationDao.selectTripCheck(connection, tripIdx);
  connection.release();

  return tripCheckResult;
}

// 삭제된 여행인지 체크
exports.deleteTripCheck = async function (tripIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const deleteTripCheckResult = await reservationDao.selectDeleteTripCheck(connection, tripIdx);
  connection.release();

  return deleteTripCheckResult;
}