// 예약 등록
async function insertReservation(connection, insertReservationParams) {
  const insertReservationQuery = `
    insert into Trip (hostIdx, userIdx, startDate, endDate, checkInTime, guestCnt, message)
    values (?, ?, ?, ?, ?, ?, ?);
  `;

  const insertReservationRow = await connection.query(
    insertReservationQuery,
    insertReservationParams
  );

  return insertReservationRow;
};

// 예약 체크 조회
async function selectReservationList(connection, hostIdx, userIdx) {
  const selectReservationListQuery = `
    select * from Trip where hostIdx = ? and userIdx = ?;
  `;

  const selectReservationListRow = await connection.query(
    selectReservationListQuery,
    [hostIdx, userIdx]
  );

  return selectReservationListRow[0];
}

// 등록 예약 조회
async function selectUserReservationList(connection, userIdx) {
 const selectUserReservationListQuery = `
     select
         Trip.idx as idx,
         Trip.hostIdx as hostInfo,
         DATE_FORMAT(Trip.startDate, '%Y-%m-%d') as startDate,
         DATE_FORMAT(Trip.endDate, '%Y-%m-%d') as endDate,
         if(checkInTime=0, 'adjustment', CONCAT(
                 if(Trip.checkInTime < 12, '오전 : ', '오후 : '),
                 if(Trip.checkInTime < 10, '0', ''),Trip.checkInTime,':00', ' - ',
                 if(Trip.checkInTime + 2 < 12, '오전 : ', '오후 : '), Trip.checkInTime + 2, ':00'))
             as checkInTime,
         Trip.guestCnt as guestCnt,
         Trip.message as message
     from Trip
              left join Host on Host.idx = Trip.hostIdx
     where Trip.userIdx = ?;
 `;

 const selectUserReservationListRow = await connection.query(
     selectUserReservationListQuery,
     [userIdx]
 );

 return selectUserReservationListRow[0];
}

// 등록된 숙박예약 조회
async function selectretrieveReservationHost(connection, hostIdx) {
 const selectretrieveReservationHostQuery = `
    select
       Host.idx as idx,
       Host.userIdx as regidenceIdx,
       Host.hostName as hostName,
       Host.city as city,
       Host.state as state,
       Host.street as street,
       Host.zip as zip,
       Host.basePrice as price
from Host
left join Trip T on T.hostIdx = Host.idx
where Host.idx = ? and T.isLastTrip = 'N';
 `;

 const selectretrieveReservationHostRow = await connection.query(
     selectretrieveReservationHostQuery,
     [hostIdx]
 );

 return selectretrieveReservationHostRow[0];
}

// 삭제된 여행조회 체크
async function selectDeleteTripCheck(connection, tripIdx) {
 const selectDeleteTripCheckQuery = `
    select status from Trip where idx = ?;
 `;

 const selectDeleteTripCheckRow = await connection.query(
     selectDeleteTripCheckQuery,
     [tripIdx]
 );

 return selectDeleteTripCheckRow[0];
}

// 등록 여행 여부 체크
async function selectTripCheck(connection, tripIdx) {
 const selectTripCheckQuery = `
  select * from Trip where idx = ?;
 `;

 const selectTripCheckRow = await connection.query(
     selectTripCheckQuery,
     [tripIdx]
 );

 return selectTripCheckRow[0];
}

// 업데이트 지난 여행 상태값
async function updateIsLastTrip(connection, isLastTrip, tripIdx) {
  const updateIsLastTripQuery = `
    update Trip
    set isLastTrip = ?
    where idx = ?;
  `;

  const updateIsLastTripRow = await connection.query(
      updateIsLastTripQuery,
      [isLastTrip, tripIdx]
  );

  return updateIsLastTripRow[0];
}

// 여행 삭제 업데이트
async function updateTripStatus(connection, status, userIdx, tripIdx) {
  const updateTripStatusQuery = `
    update Trip
    set status = ?
    where userIdx = ? and idx = ?;
  `;

  const updateTripStatusRow = await connection.query(
    updateTripStatusQuery,
    [status, userIdx, tripIdx]
  );

  return updateTripStatusRow[0];
}

module.exports = {
  insertReservation,
  selectReservationList,
  selectUserReservationList, // 유저의 등록된 예약 조회
  selectretrieveReservationHost, // 호스트 정보 조회
  selectDeleteTripCheck, // 삭제된 예약 조회
  selectTripCheck,
  updateIsLastTrip, // 지난 여행 상태값 업데이트
  updateTripStatus, // 여행 삭제 업데이트

}