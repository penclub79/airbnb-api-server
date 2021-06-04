const jwtMiddleware = require("../../../config/jwtMiddleware");
const reviewProvider = require("../../app/Review/reviewProvider");
const hostProvider = require("../Host/hostProvider");
const reviewService = require("../../app/Review/reviewService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const moment = require('moment');

// 리뷰 등록
exports.postUserByReview = async function (req, res) {
  const googleToken = req.headers['authorization'];
  const googleTokenHeader = req.query.token;
  const userIdxFromJWT = req.verifiedToken.userIdx;
  const userIdx = req.params.userIdx;
  const { hostIdx, rating, reviewMessage } = req.body;

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
    return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
  } else {

    // 호스트 빈 값 체크
    if (!hostIdx)
      return res.send(errResponse(baseResponse.HOST_ID_NOT_MATCH));

    // 평점 빈 값 체크
    if (!rating)
      return res.send(errResponse(baseResponse.SIGNUP_REVIEW_RATING_EMPTY));

    // 평점 5점 미만 체크
    if (rating > 5)
      return res.send(errResponse(baseResponse.SIGNUP_REVIEW_RATING_LENGTH));

    // 리뷰 메시지 빈 값 체크
    if (!reviewMessage)
      return res.send(errResponse(baseResponse.SIGNUP_REVIEW_MESSAGE_EMPTY));

    const signUpReview = await reviewService.createReview(
        hostIdx, rating, reviewMessage, userIdx
    );

    return res.send(signUpReview);
  }
};

// 호스트 리뷰 조회
exports.getHostReview = async function (req, res) {
  const googleToken = req.headers['authorization'];
  const googleTokenHeader = req.query.token;
  const userIdxFromJWT = req.verifiedToken.userIdx;
  const userIdx = req.params.userIdx;
  const hostIdx = req.query.id;

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
    return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
  } else {

    // 호스트 빈 값 체크
    if (!hostIdx)
      return res.send(errResponse(baseResponse.HOST_ID_NOT_MATCH));

    // 호스트 등록 체크
    const hostRows = await reviewProvider.hostCheck(hostIdx);
    if (hostRows.length == 0)
      return res.send(errResponse(baseResponse.SIGNUP_HOST_NOT_MATCH));

    for (i = 0; i < hostRows.length; i++) {
      hostRows[i].reviewRow = await reviewProvider.retrieveHostReviewList(hostRows[i].reviewRow);
    }

    return res.send(
        response(baseResponse.SUCCESS_REVIEW_HOST_SELECT, hostRows));
  }
};

// 리뷰 수정
exports.patchReviewInfo = async function (req, res) {
  const googleToken = req.headers['authorization'];
  const googleTokenHeader = req.query.token;
  const userIdxFromJWT = req.verifiedToken.userIdx;
  const userIdx = req.params.userIdx;
  const reviewIdx = req.params.reviewIdx;
  const { reviewMessage } = req.body;

  // 유저 빈 값 체크
  if (!userIdx)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

  // 리뷰 빈 값 체크
  if (!reviewIdx)
    return res.send(errResponse(baseResponse.REVIEW_ID_NOT_MATCH));

  // 구글 인증
  if (googleTokenHeader) {
    if (!googleToken)
      return res.send(errResponse(baseResponse.TOKEN_GOOGLE_EMPTY));

    if (googleTokenHeader != googleToken)
      return res.send(errResponse(baseResponse.GOOGLE_TOKEN_NOT_EXIST));
  }

  if (userIdxFromJWT != userIdx) {
    return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
  } else {
    if (!reviewMessage)
      return res.send(errResponse(baseResponse.SIGNUP_REVIEW_MESSAGE_EMPTY));

    const patchReviewInfoResult = await reviewService.editReviewInfo(
        reviewMessage, reviewIdx, userIdx
    );

    return res.send(patchReviewInfoResult);
  }
};

// 리뷰 삭제
exports.patchMessageStatus = async function (req, res) {
  const googleToken = req.headers['authorization'];
  const googleTokenHeader = req.query.token;
  const userIdxFromJWT = req.verifiedToken.userIdx;
  const userIdx = req.params.userIdx;
  const reviewIdx = req.params.reviewIdx;
  const { status } = req.body;

  // 유저 빈 값 체크
  if (!userIdx)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

  // 리뷰 빈 값 체크
  if (!reviewIdx)
    return res.send(errResponse(baseResponse.REVIEW_ID_NOT_MATCH));

  // 구글 인증
  if (googleTokenHeader) {
    if (!googleToken)
      return res.send(errResponse(baseResponse.TOKEN_GOOGLE_EMPTY));

    if (googleTokenHeader != googleToken)
      return res.send(errResponse(baseResponse.GOOGLE_TOKEN_NOT_EXIST));
  }

  if (userIdxFromJWT != userIdx) {
    return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
  } else {

    if (!status)
      return res.send(errResponse(baseResponse.SIGNIN_REVIEW_STATUS_EMPTY));

    if (status != 'Y' && status != 'N')
      return res.send(errResponse(baseResponse.SIGNIN_REVIEW_STATUS_ERROR_TYPE));

    const patchReviewStatusResult = await reviewService.editReviewStatus(
        status, reviewIdx, userIdx
    );

    return res.send(patchReviewStatusResult);
  }
};