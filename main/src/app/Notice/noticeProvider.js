const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const noticeDao = require("./noticeDao");

// 유저 체크
exports.selectUserCheck = async function (userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userCheckResult = await noticeDao.selectUserCheck(connection, userIdx);
  connection.release();

  return userCheckResult;
}

// 알림 전체 조회
exports.selectNoticeList = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const noticeListResult = await noticeDao.selectNoticeList(connection);
  connection.release();

  return noticeListResult;
}

// 유저 알림 조회
exports.retieveUserNotice = async function (userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userNoticeResult = await noticeDao.selectUserNotice(connection, userIdx);
  connection.release();

  return userNoticeResult;
}

// 알림 등록 체크
exports.selectNoticeCheck = async function (noticeIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const noticeCheckResult = await noticeDao.selectNoticeCheck(connection, noticeIdx);
  connection.release();

  return noticeCheckResult;
}
