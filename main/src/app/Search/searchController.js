const jwtMiddleware = require("../../../config/jwtMiddleware");
const searchProvider = require("../../app/Search/searchProvider");
const hostProvider = require("../../app/Host/hostProvider");
const searchService = require("../../app/Search/searchService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const moment = require('moment');

// 유저 호스트 검색
exports.getUserByHost = async function (req, res) {
  const googleToken = req.headers['authorization'];
  const googleTokenHeader = req.query.token;
  const userIdxFromJWT = req.verifiedToken.userIdx;
  const userIdx = req.params.userIdx;
  const state = req.query.state;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const guestCnt = req.query.guest;
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

  // jwt 인증
  if (userIdxFromJWT != userIdx) {
    res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
  } else {

    // oauth 인증
    if (!googleToken)
      return res.send(errResponse(baseResponse.TOKEN_GOOGLE_EMPTY));

    // 지역 빈 값 체크
    if (!state)
      return  res.send(errResponse(baseResponse.SIGNIN_HOST_LOCATION_STATE_EMPTY));

    // 시작 날짜 빈 값 체크
    if (!startDate)
      return res.send(errResponse(baseResponse.SIGNIN_STARTDATE_EMPTY));

    // 시작 날짜 형식 체크
    if (!birthRegex.test(startDate))
      return res.send(errResponse(baseResponse.SIGNIN_STARTDATE_ERROR_TYPE));

    // 이전 날짜 체크
    // if (startDate < )
    //   return res.send(errResponse(baseResponse.SIGNIN_STARTDATE_ERROR_MATCH));

    // 끝 날짜 빈 값 체크
    if (!endDate)
      return res.send(errResponse(baseResponse.SIGNIN_ENDDATE_EMPTY));

    // 끝 날짜 형식 체크
    if (!birthRegex.test(endDate))
      return res.send(errResponse(baseResponse.SIGNIN_ENDDATE_ERROR_TYPE));

    // 시작 날짜의 이전 날짜 체크
    if (startDate > endDate)
      return res.send(errResponse(baseResponse.SIGNIN_ENDDATE_ERROR_MATCH));

    // 게스트 수 빈 값 체크
    if (!guestCnt)
      return res.send(errResponse(baseResponse.SIGNIN_SEARCH_GUESTCNT_EMPTY));

    // 게스트 수 21 미만 체크
    if (guestCnt > 21)
      return res.send(errResponse(baseResponse.SIGNIN_SEARCH_GUESTCNT_LENGTH));

    // 유저 호스트 조회
    const userSearchResult = await searchProvider.retrieveUserByHost({state:state}, startDate);

    // 검색 결과 빈 값 체크
    if (userSearchResult.length == 0)
      return res.send(errResponse(baseResponse.SEARCH_HOST_STATE_EMPTY));

    // 날짜 차이 계산 * 숙박 금액
    const startAccommodation = moment(startDate);
    const endAccommodation = moment(endDate);
    const diff = endAccommodation.diff(startAccommodation, 'days');

    for (i = 0; i < userSearchResult.length; i++) {

      // 호스트 사진 조회
      userSearchResult[i].hostImg = await hostProvider.retrieveHostPhoto(userSearchResult[i].idx);
      // 호스트 사진이 없으면 null값
      if (userSearchResult[i].hostImg.length == 0) {
        userSearchResult[i].hostImg = null;
      }

      // 숙소 요금 책정
      userSearchResult[i].totalPrice = userSearchResult[i].basePrice * diff;
    }


    return res.send(response(baseResponse.SUCCESS_SEARCH_USER_HOST, userSearchResult));
  }
};