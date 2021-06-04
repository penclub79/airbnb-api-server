const jwtMiddleware = require("../../../config/jwtMiddleware");
const wishlistProvider = require("../../app/WishList/wishlistProvider");
const hostProvider = require("../Host/hostProvider");
const wishlistService = require("../../app/WishList/wishlistService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const moment = require('moment');


// 위시리스트 생성
exports.postWishList = async function (req, res) {
  const googleToken = req.headers['authorization'];
  const googleTokenHeader = req.query.token;
  const userIdxFromJWT = req.verifiedToken.userIdx;
  const userIdx = req.params.userIdx;
  const { wishTitle } = req.body;

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
    // 제목 빈 값 체크
    if (!wishTitle)
      res.send(errResponse(baseResponse.SIGNIN_WISHLIST_TITLE_EMPTY));

    // 제목 50글자 미만 체크
    if (wishTitle.length > 50)
      res.send(errResponse(baseResponse.SIGNIN_WISHLIST_TITLE_LENGTH));

    const signUpWishList = await wishlistService.createWishList(
      userIdx, wishTitle
    );

    return res.send(signUpWishList);
  }
};

// 위시 활성화 / 비활성화
exports.patchWishHost = async function (req, res) {
  const googleToken = req.headers['authorization'];
  const googleTokenHeader = req.query.token;
  const userIdxFromJWT = req.verifiedToken.userIdx;
  const userIdx = req.params.userIdx;
  const wishListIdx = req.params.wishListIdx;
  // const hostIdx = req.query.id;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const guestCnt = req.query.guest;
  const { hostIdx, isWish } = req.body;
  const birthRegex = /^(20[0-9][0-9]|20\\d{2})-(0[0-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;

  // 유저 빈 값 체크
  if (!userIdx)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

  // 등록한 위시리스트 게시판 빈 값 체크
  //  return res.send(errResponse(baseResponse.))
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

    // 숙박 시작 날짜 빈 값 체크
    if (!startDate)
      return res.send(errResponse(baseResponse.SIGNIN_STARTDATE_EMPTY));

    // 날짜 형식 체크
    if (!birthRegex.test(startDate))
      return res.send(errResponse(baseResponse.SIGNIN_STARTDATE_ERROR_TYPE));

    // 숙박 끝 날짜 빈 값 체크
    if (!endDate)
      return res.send(errResponse(baseResponse.SIGNIN_ENDDATE_EMPTY));

    // 날짜 형식 체크
    if (!birthRegex.test(endDate))
      return res.send(errResponse(baseResponse.SIGNIN_ENDDATE_ERROR_TYPE));

    // 게스트 빈 값 체크
    if (!guestCnt)
      return res.send(errResponse(baseResponse.SIGNIN_SEARCH_GUESTCNT_EMPTY));

    // 게스트 수 21 미만 체크
    if (guestCnt > 21)
      return res.send(errResponse(baseResponse.SIGNIN_SEARCH_GUESTCNT_LENGTH));

    // 호스트 빈 값 체크
    if (!hostIdx)
      return res.send(errResponse(baseResponse.WISH_HOST_ID_NOT_MATCH));

    // 위시 상태 빈 값 체크
    if (!isWish)
      return res.send(errResponse(baseResponse.SIGNIN_WISH_STATUS_EMPTY));

    // 위시 상태 형식 체크
    if (isWish != 'Y' && isWish != 'N')
      return res.send(errResponse(baseResponse.SIGNIN_WISH_STATUS_ERROR_TYPE));


    const patchIsWishResult = await wishlistService.editIsWish(
        wishListIdx, hostIdx, startDate, endDate, guestCnt, isWish
    );

    return res.send(patchIsWishResult);
  }
};

exports.getWishList = async function (req, res) {
  const googleToken = req.headers['authorization'];
  const googleTokenHeader = req.query.token;
  const userIdx = req.query.id;

  // 유저 빈 값 체크
  if (!userIdx)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

  // // 구글 인증
  if (googleTokenHeader) {
    if (!googleToken)
      return res.send(errResponse(baseResponse.TOKEN_GOOGLE_EMPTY));

    if (googleTokenHeader != googleToken)
      return res.send(errResponse(baseResponse.GOOGLE_TOKEN_NOT_EXIST));
  }

  // 위시리스트 조회
  const getWishListResult = await wishlistProvider.retrieveWishList(userIdx);

  // 위시 조회
  for (i = 0; i < getWishListResult.length; i++) {
    getWishListResult[i].host = await wishlistProvider.retrieveWishHost(getWishListResult[i].idx);
    for (j = 0; j < getWishListResult[i].host.length; j++){
      getWishListResult[i].host[j].hostInfo = await wishlistProvider.retrieveHostList(getWishListResult[i].host[j].hostInfo);
      for (x = 0; x < getWishListResult[i].host[j].hostInfo.length; x++) {
        getWishListResult[i].host[j].hostInfo[x].hostImg = await hostProvider.retrieveHostPhoto(getWishListResult[i].host[j].hostInfo[x].hostIdx);

        getWishListResult[i].host[j].hostInfo[x].totalPrice = getWishListResult[i].guestCnt * getWishListResult[i].host[j].hostInfo[x].basePrice;
      }
    }
    console.log()
    // 날짜 차이 계산 * 숙박 금액
    const startAccommodation = moment(getWishListResult[i].startDate);
    const endAccommodation = moment(getWishListResult[i].endDate);
    const diff = endAccommodation.diff(startAccommodation, 'days');

    // 사용자 총 숙박일
    {getWishListResult[i].totalDay = diff}
  }

  return res.send(response(baseResponse.SUCCESS_WISHLIST_USER ,getWishListResult));

};

// 위시리스트 수정
exports.patchWishList = async function (req, res) {
  const googleToken = req.headers['authorization'];
  const googleTokenHeader = req.query.token;
  const userIdxFromJWT = req.verifiedToken.userIdx;
  const userIdx = req.params.userIdx;
  const wishListIdx = req.params.wishListIdx;
  const { wishTitle } = req.body;

  // 유저 빈 값 체크
  if (!userIdx)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

  // 등록한 위시리스트 게시판 빈 값 체크
  if (!wishListIdx)
   return res.send(errResponse(baseResponse.WISHLIST_ID_NOT_MATCH))

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

    // 제목 빈 값 체크
    if (!wishTitle)
      return res.send(errResponse(baseResponse.SIGNIN_WISHLIST_TITLE_EMPTY));

    // 제목 길이 체크
    if (wishTitle > 50)
      return res.send(errResponse(baseResponse.SIGNIN_WISHLIST_TITLE_LENGTH));

    const patchWishListResult = await wishlistService.editWishList(
        wishTitle, wishListIdx
    );

    return res.send(patchWishListResult);
  }
};

// 위시리스트 삭제
exports.patchWishListStatus = async function (req, res) {
  const googleToken = req.headers['authorization'];
  const googleTokenHeader = req.query.token;
  const userIdxFromJWT = req.verifiedToken.userIdx;
  const userIdx = req.params.userIdx;
  const wishListIdx = req.params.wishListIdx;
  const { status } = req.body;

  // 유저 빈 값 체크
  if (!userIdx)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

  // 등록한 위시리스트 게시판 빈 값 체크
  if (!wishListIdx)
    return res.send(errResponse(baseResponse.WISHLIST_ID_NOT_MATCH))

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
      return res.send(errResponse(baseResponse.SIGNIN_WISH_STATUS_EMPTY));

    // 상태값 형식 체크
    if (status != 'Y' && status != 'N')
      return res.send(errResponse(baseResponse.SIGNIN_WISH_STATUS_ERROR_TYPE));

    const patchWishListResult = await wishlistService.editWishListStatus(
        status, wishListIdx
    );

    return res.send(patchWishListResult);
  }
};
