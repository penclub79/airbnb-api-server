const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const reviewProvider = require("./reviewProvider");
const reviewDao = require("./reviewDao");
const hostProvider = require("../Host/hostProvider");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");
const moment = require("moment");

// 리뷰 등록
exports.createReview = async function ( hostIdx, rating, reviewMessage, userIdx ) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    // 호스트 등록 체크
    const hostRows = await hostProvider.hostCheck(hostIdx);
    if (hostRows.length == 0)
      return errResponse(baseResponse.SIGNUP_HOST_NOT_MATCH);

    // 리뷰 등록 중복체크
    const userReviewCheckResult = await reviewProvider.retrieveUserReviewList(hostIdx, userIdx);
    console.log(userReviewCheckResult)
    if (userReviewCheckResult.length > 0)
      return errResponse(baseResponse.SIGNUP_REDUNDANT_REVIEW);

    // 리뷰 등록
    const insertUserReviewParams = [hostIdx, userIdx, rating, reviewMessage];
    const userReviewResult = await reviewDao.insertReview(connection, insertUserReviewParams);

    return response(baseResponse.SUCCESS_USER_REVIEW, {"hostIdx": hostIdx, "message": `추가된 리뷰 idx: ${userReviewResult[0].insertId}`});

  } catch (err) {
    logger.error(`App - createReview Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 리뷰 수정
exports.editReviewInfo = async function (reviewMessage, reviewIdx, userIdx) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    // 리뷰 등록 체크
    const reviewCheckResult = await reviewProvider.reviewCheck(reviewIdx, userIdx);
    if (reviewCheckResult == 0)
      return errResponse(baseResponse.SIGNUP_REVIEW_EXIST);

    // 리뷰 수정
    const editReviewInfoResult = await reviewDao.updateReviewInfo(connection, reviewMessage, reviewIdx, userIdx);
    connection.release();

    return response(baseResponse.SUCCESS_REVIEW_MODIFY, `수정된 리뷰Idx: ${reviewIdx}`);

  } catch (err) {
    logger.error(`App - editReviewInfo Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}

// 리뷰 삭제
exports.editReviewStatus = async function (status, reviewIdx, userIdx) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    // 리뷰 등록 체크
    const reviewCheckResult = await reviewProvider.reviewCheck(reviewIdx, userIdx);
    if (reviewCheckResult == 0)
      return errResponse(baseResponse.SIGNUP_REVIEW_EXIST);

    // 리뷰 수정
    const editReviewStatusResult = await reviewDao.updateReviewStatus(connection, status, reviewIdx, userIdx);
    connection.release();

    return response(baseResponse.SUCCESS_REVIEW_STATUS, `삭제된 리뷰Idx: ${reviewIdx}`);

  } catch (err) {
    logger.error(`App - editReviewStatus Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}