const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const wishlistDao = require("./wishlistDao");

// 위시리스트 생성 여부 체크
exports.wishlistCheck = async function (wishListIdx) {
  const connection = await pool.getConnection(async (conn) => conn);

  const wishlistCheckResult = await wishlistDao.selectWishList(connection, wishListIdx);
  connection.release();

  return wishlistCheckResult;
}

// 위시 - 호스트 여부 체크
exports.wishHostCheck = async function (wishListIdx, hostIdx) {
  const connection = await pool.getConnection(async (conn) => conn);

  const wishHostCheckResult = await wishlistDao.selectWishHost(connection, wishListIdx, hostIdx);
  connection.release();

  return wishHostCheckResult;
}

// 유저 - 위시리스트 조회
exports.retrieveWishList = async function (userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);

  const retrieveWishListResult = await wishlistDao.selectUserWishList(connection, userIdx);
  connection.release();

  return retrieveWishListResult;
}

// 위시리스트 - 호스트 조회(배열)
exports.retrieveHostList = async function (hostIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const retrieveHostListResult = await wishlistDao.selectHostList(connection, hostIdx);
  connection.release();

  return retrieveHostListResult;
}

// 유저 위시리스트 등록 여부 체크
exports.userWishlistCheck = async function (userIdx, wishTitle) {
  const connection = await pool.getConnection(async (conn) => conn);

  const userWishlistResult = await wishlistDao.selectUserByWishList(connection, userIdx, wishTitle);
  connection.release();

  return userWishlistResult;
}

// 위시 조회(배열)
exports.retrieveWishHost = async function (wishIdx) {
  const connection = await pool.getConnection(async (conn) => conn);

  const hostWishlistResult = await wishlistDao.selectHostByWishList(connection, wishIdx);
  connection.release();

  return hostWishlistResult;
}