const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const wishlistProvider = require("./wishlistProvider");
const wishlistDao = require("./wishlistDao");
const hostProvider = require("../Host/hostProvider");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");
const moment = require("moment");

// 위시리스트 등록
exports.createWishList = async function (userIdx, wishTitle) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    // 위시리스트 전체 조회 -> 위시리스트 게시판 중복 체크(idx, userIdx) -> 중복 에러 체크
    const wishlistCheckResult = await wishlistProvider.userWishlistCheck(userIdx, wishTitle);
    console.log(wishlistCheckResult);
    if (wishlistCheckResult.length > 0)
      return errResponse(baseResponse.SIGNUP_REDUNDANT_WISHLIST);

    // 위시리스트 게시판 생성
    const insertWishListParams = [userIdx, wishTitle];
    const wishListResult = await wishlistDao.insertWishList(connection, insertWishListParams);

    return response(baseResponse.SUCCESS_WISHLIST, `추가된 위시리스트 idx: ${wishListResult[0].insertId}`);

  } catch (err) {
    logger.error(`App - createWishList Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 위시 활성 / 비활성
exports.editIsWish = async function (wishListIdx, hostIdx, startDate, endDate, guestCnt, isWish) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    // 위시리스트 게시판 등록 여부 체크
    const wishlistCheckResult = await wishlistProvider.wishlistCheck(wishListIdx);

    if (wishlistCheckResult.length == 0)
      return errResponse(baseResponse.SIGNUP_WISHLIST_NOT_REGISTER)

    // 위시에 등록된 - 호스트 조회
    const wishCheckResult = await wishlistProvider.wishHostCheck(wishListIdx, hostIdx);

    // 등록된 위시가 있다면
    if (wishCheckResult[0]) {

      const updateIsWishResult = await wishlistDao.updateIsWish(connection, isWish, wishListIdx, hostIdx);
      // isWish 중복 체크
      if (wishCheckResult[0].isWish == isWish)
        return errResponse(baseResponse.SIGNUP_REDUNDANT_WISHLIST_ISWISH);

      return response(baseResponse.SUCCESS_WISH_STATUS_MODIFY, {"idx":wishListIdx, "hostIdx":hostIdx , "isWish": isWish});
    } else {

      // 없으면 생성
      // 위시 첫 활성화는 insert한다.

      // 호스트가 ACTIVE 인지 체크 (등록 여부)
      const hostRows = await hostProvider.perfactHostCheck(hostIdx);

      // 해당 호스트 조회 없을때
      if (hostRows.length == 0)
        return errResponse(baseResponse.SIGNUP_HOST_NOT_MATCH);

      const wishHostParams = [wishListIdx, hostIdx, guestCnt, startDate, endDate];
      const insertWishHostResult = await wishlistDao.insertWishHost(connection, wishHostParams);
      return response(baseResponse.SUCCESS_WISH_HOST);
    }
  } catch (err) {
    logger.error(`App - editIsWish Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 위시리스트 수정
exports.editWishList = async function (wishTitle, wishListIdx) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    // 위시리스트 게시판 등록 여부 체크
    const wishlistCheckResult = await wishlistProvider.wishlistCheck(wishListIdx);

    if (wishlistCheckResult.length == 0)
      return errResponse(baseResponse.SIGNUP_WISHLIST_NOT_REGISTER);

    const updateWishListResult = await wishlistDao.updateWishList(connection, wishTitle, wishListIdx);
    return response(baseResponse.SUCCESS_WISH_MODIFY, `수정된 위시리스트Idx: ${wishListIdx}`);
  } catch (err) {
    logger.error(`App - editWishList Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 위시리스트 삭제
exports.editWishListStatus = async function (status, wishListIdx) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    // 위시리스트 게시판 등록 여부 체크
    const wishlistCheckResult = await wishlistProvider.wishlistCheck(wishListIdx);
    if (wishlistCheckResult.length == 0)
      return errResponse(baseResponse.SIGNUP_WISHLIST_NOT_REGISTER);

    if (wishlistCheckResult[0].status == status)
      return errResponse(baseResponse.SIGNUP_REDUNDANT_WISHLIST_STATUS);

    const updateWishListStatusResult = await wishlistDao.updateWishListStatus(connection, status, wishListIdx);
    return response(baseResponse.SUCCESS_WISHLIST_DELETE, `삭제된 위시리스트Idx: ${wishListIdx}`);

  } catch (err) {
    logger.error(`App - editWishList Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};