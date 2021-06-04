const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const messageProvider = require("./messageProvider");
const messageDao = require("./messageDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");
const moment = require("moment");

// 메세지 보내기
exports.sendMessage = async function (roomIdx, userIdx, message) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    // 채팅방 체크
    const chatRoomCheckResult = await messageProvider.selectChatRoomCheck(roomIdx);
    if (chatRoomCheckResult == 0)
      return errResponse(baseResponse.SIGNUP_MESSAGE_ROOM_EXIST);

    // 메세지 보내기
    const insertMessageParams = [roomIdx, userIdx, message];
    const messageResult = await messageDao.insertMessage(connection, insertMessageParams);

    return response(baseResponse.SUCCESS_MESSAGE_SEND, `메세지 idx: ${messageResult[0].insertId}`);

  } catch (err) {
    logger.error(`App - sendMessage Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 메세지 상태값 수정
exports.editMessageStatus = async function (status, messageIdx) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    // 메세지 체크
    const messageCheckResult = await messageProvider.messageCheck(messageIdx);
    if (messageCheckResult.length == 0)
      return errResponse(baseResponse.SIGNUP_MESSAGE_EXIST);

    if (messageCheckResult[0].status == status)
      return errResponse(baseResponse.SIGNUP_REDUNDANT_MESSAGE_STATUS);

    const editMessageStatusResult = await messageDao.updateMessageStatus(connection, status, messageIdx);
    connection.release();

    return response(baseResponse.SUCCESS_MESSAGE_DELETE, `삭제된 메세지Idx: ${messageIdx}`);

  } catch (err) {
    logger.error(`App - editMessageStatus Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};