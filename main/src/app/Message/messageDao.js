
// 메세지 보내기
async function insertMessage(connection, insertMessageParams) {
  const insertMessageQuery = `
      insert into Message(roomIdx, userIdx, message)
      values(?, ?, ?);
  `;

  const insertMessageRow = await connection.query(
      insertMessageQuery,
      insertMessageParams
  );

  return insertMessageRow;
}

// 유저 - 회원 체크(userIdx)
async function selectUser(connection, userIdx) {
  const selectUserQuery = `
    select * from Users where idx = ?;
  `;

  const selectUserRow = await connection.query(
      selectUserQuery,
      userIdx
  );

  return selectUserRow[0];
}

async function selectUserByMessage(connection, roomIdx) {
  const selectUserByMessageQuery = `
    select 
           userIdx, 
           message,
           DATE_FORMAT(createAt, '%m-%d %I:%i')as sendTime
    from Message 
    where roomIdx = ? and status = 'Y';
  `;

  const selectUserByMessageRow = await connection.query(
    selectUserByMessageQuery,
      roomIdx
  );

  return selectUserByMessageRow[0];
}

// 대화방 여부 체크
async function selectChatRoom(connection, roomIdx) {

  const selectChatRoomQuery = `
    select * from Message where roomIdx = ?;
  `;

  const selectChatRoomRow = await connection.query(
      selectChatRoomQuery,
      roomIdx
  );

  return selectChatRoomRow[0];
}

// 사용자 메시지 여부 체크(messageIdx)
async function selectUserMessage(connection, messageIdx) {
  const selectUserMessageQuery = `
    select * from Message where idx = ?;
  `;

  const selectUserMessageRow = await connection.query(
      selectUserMessageQuery,
      messageIdx
  );

  return selectUserMessageRow[0];
}

// 메시지 상태값 수정
async function updateMessageStatus(connection, status, messageIdx) {
  const updateMessageStatusQuery = `
    update Message
    set status = ?
    where idx = ?;
  `;

  const updateMessageStatusRow = await connection.query(
      updateMessageStatusQuery,
      [status, messageIdx]
  );

  return updateMessageStatusRow;
}

module.exports = {
  insertMessage,
  selectUser, // 유저 - 회원 체크(userIdx)
  selectUserByMessage, // 유저 보낸 메시지 조회(userIdx)
  selectChatRoom, // 대화방 여부 체크(roomIdx)
  selectUserMessage, // 사용자 메시지 여부 체크(messageIdx)
  updateMessageStatus, // 메시지 상태값 수정
}