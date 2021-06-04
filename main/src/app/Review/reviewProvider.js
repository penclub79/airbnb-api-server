const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const reviewDao = require("./reviewDao");

// 리뷰 등록 조회
exports.retrieveUserReviewList = async function (hostIdx, userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const retrieveUserReviewResult = await reviewDao.selectUserReviewList(connection, hostIdx, userIdx);
  connection.release();

  return retrieveUserReviewResult;
};

// 호스트 리뷰 조회
exports.retrieveHostReview = async function (hostIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const retrieveHostReviewResult = await reviewDao.selectHostReview(connection, hostIdx);
  connection.release();

  return retrieveHostReviewResult;
};

// 호스트 리뷰 조회(배열)
exports.retrieveHostReviewList = async function (hostIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const retrieveHostReviewListResult = await reviewDao.selectHostReviewList(connection, hostIdx);
  connection.release();

  return retrieveHostReviewListResult;
};

// 호스트 조회
exports.hostCheck = async function (hostIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const hostCheckResult = await reviewDao.selectUserHost(connection, hostIdx);
  connection.release();

  return hostCheckResult;
};

// 리뷰 체크
exports.reviewCheck = async function (reviewIdx, userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const reviewCheckResult = await reviewDao.selectUserReview(connection, reviewIdx, userIdx);
  connection.release();

  return reviewCheckResult;
};
