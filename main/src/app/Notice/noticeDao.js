// 유저 회원 여부 체크
async function selectUserCheck(connection, userIdx) {
  const selectUserCheckQuery = `
    select * from Users where idx = ?;
  `;

  const selectUserCheckRow = await connection.query(
      selectUserCheckQuery,
      userIdx
  );

  return selectUserCheckRow[0];
}

// 알림 전체 조회
async function selectNoticeList(connection) {
  const selectNoticeListQuery = `
    select * from Notice;
  `;

  const [selectNoticeListRow] = await connection.query(selectNoticeListQuery);

  return selectNoticeListRow;
}

// 유저 알림 조회
async function selectUserNotice(connection, userIdx) {
  const selectUserNoticeQuery = `
    select 
           idx,
           userIdx,
           noticeMessage
    from Notice 
    where userIdx = ? and status = 'Y';
  `;

  const selectUserNoticeRow = await connection.query(
      selectUserNoticeQuery, userIdx
  );

  return selectUserNoticeRow[0];
}

// 알림 등록
async function insertNotice(connection, insertNoticeParams) {
  const insertNoticeQuery = `
     insert into Notice(userIdx, noticeMessage)
     values(?, ?);
  `;

  const insertNoticeRow = await connection.query(
      insertNoticeQuery,
      insertNoticeParams
  );

  return insertNoticeRow;
}

// 알림 등록 체크
async function selectNoticeCheck(connection, noticeIdx) {
  const selectNoticeCheckQuery = `
    select * from Notice where idx = ?;
  `;

  const [selectNoticeCheckRow] = await connection.query(
      selectNoticeCheckQuery,
      noticeIdx
  );

  return selectNoticeCheckRow;
}

// 알림 삭제
async function updateNoticeStatus(connection, status, noticeIdx) {
  const updateNoticeStatusQuery = `
    update Notice
    set status = ?
    where idx = ?;
  `;

  const updateNoticeStatusRow = await connection.query(
      updateNoticeStatusQuery,
      [status, noticeIdx]
  );

  return updateNoticeStatusRow;
}

module.exports = {
  selectUserCheck, // 유저 회원 여부 체크
  selectNoticeList, // 알림 전체 조회
  selectUserNotice, // 유저 알림 조회
  selectNoticeCheck, // 알림 등록 체크
  insertNotice, // 알림 등록
  updateNoticeStatus, // 알림 삭제
}