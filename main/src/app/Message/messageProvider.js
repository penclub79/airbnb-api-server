const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const messageDao = require("./messageDao");

// // 유저 회원 체크
// exports.selectUserCheck = async function (userIdx) {
//   const connection = await pool.getConnection(async (conn) => conn);
//   const userCheckResult = await messageDao.selectUser(connection, userIdx);
//   connection.release();
//
//   return userCheckResult;
// };

// 대화방 조회
exports.retrieveUserByMessage = async function (roomIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userMessageResult = await messageDao.selectUserByMessage(connection, roomIdx);
  connection.release();

  return userMessageResult;
}

// 대화방 여부 체크
exports.selectChatRoomCheck = async function(roomIdx) {

  const connection = await pool.getConnection(async (conn) => conn);
  const roomCheckResult = await messageDao.selectChatRoom(connection, roomIdx);
  connection.release();

  return roomCheckResult;
};

// 메시지 여부 체크
exports.messageCheck = async function(messageIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const messageCheckResult = await messageDao.selectUserMessage(connection, messageIdx);
  connection.release();

  return messageCheckResult;
};