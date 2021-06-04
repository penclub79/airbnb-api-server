const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const noticeProvider = require("./noticeProvider");
const noticeDao = require("./noticeDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");
const moment = require("moment");

// 알림 등록
exports.createNotice = async function (userIdx, noticeMessage) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    // 회원 체크
    const userCheckResult = await noticeProvider.selectUserCheck(userIdx);
    if (userCheckResult.length == 0)
      return errResponse(baseResponse.USER_USERID_NOT_EXIST);

    // 알림 중복 체크
    const noticeListResult = await noticeProvider.selectNoticeList();
    for (i = 0; i < noticeListResult.length; i++) {
      if (noticeListResult[i].userIdx == userIdx && noticeListResult[i].noticeMessage == noticeMessage){
        return errResponse(baseResponse.SIGNUP_REDUNDANT_NOTICE_MESSAGE);
      }
    }

    // 알림 등록
    const insertNoticeParams = [userIdx, noticeMessage];
    const insertNoticeResult = await noticeDao.insertNotice(connection, insertNoticeParams);

    return response(baseResponse.SUCCESS_NOTICE_USER, `추가된 알림 idx: ${insertNoticeResult[0].insertId}`);

  } catch (err) {
    logger.error(`App - createNotice Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 알림 삭제
exports.editNoticeStatus = async function (status, noticeIdx) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    // 알림 체크
    const noticeCheck = await noticeProvider.selectNoticeCheck(noticeIdx);
    if (noticeCheck.length == 0)
      return errResponse(baseResponse.SIGNUP_NOTICE_EXIST);

    // 호스트 상태 중복 체크
    if (noticeCheck[0].status == status)
      return errResponse(baseResponse.SIGNUP_REDUNDANT_NOTICE_STATUS);

    // 알림 상태 수정
    const editNoticeStatusResult = await noticeDao.updateNoticeStatus(connection, status, noticeIdx);
    connection.release();

    return response(baseResponse.SUCCESS_NOTICE_DELETE, `삭제된 알림Idx: ${noticeIdx}`);

  } catch (err) {
    logger.error(`App - editNoticeStatus Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};