
// 리뷰 등록
async function insertReview(connection, insertUserReviewParams) {
  const insertReviewQuery = `
     insert into Review(hostIdx, userIdx, rating, reviewMessage)
     values(?, ?, ?, ?);
  `;

  const insertReviewRow = await connection.query(
      insertReviewQuery,
      insertUserReviewParams
  );

  return insertReviewRow;
}

// 리뷰 등록 조회
async function selectUserReviewList(connection, hostIdx, userIdx) {
  const selectUserReviewListQuery = `
    select * from Review where hostIdx = ? and userIdx = ?;
  `;

  const selectUserReviewListRow = await connection.query(
      selectUserReviewListQuery,
      [hostIdx, userIdx]
  );

  return selectUserReviewListRow[0];
}

// 호스트 리뷰 조회
async function selectHostReview(connection, hostIdx) {
  const selectHostReviewQuery = `
    select 
           idx,
           hostIdx,
           userIdx,
           rating,
           reviewMessage
    from Review
    where hostIdx = ?
    group by hostIdx;
  `;

  const [selectHostReviewRow] = await connection.query(
      selectHostReviewQuery,
      hostIdx
  );

  return selectHostReviewRow
}

// 호스트 리뷰 조회
async function selectHostReviewList(connection, hostIdx) {
  const selectHostReviewListQuery = `
    select 
           idx as reviewIdx,
           userIdx,
           rating,
           reviewMessage
    from Review
    where hostIdx = ?
  `;

  const [selectHostReviewListRow] = await connection.query(
      selectHostReviewListQuery,
      hostIdx
  );

  return selectHostReviewListRow
}

// 호스트 조회
async function selectUserHost(connection, hostIdx) {

  const selectUserHostQuery = `
    select 
           idx as hostIdx,
           idx as reviewRow,
           if(isnull((select round(avg(rating), 2) from Review where Review.hostIdx = Host.idx)), 0, (select round(avg(rating), 2) from Review where Review.hostIdx = Host.idx)) as totalRating,
           (select count(hostIdx) from Review where Review.hostIdx = Host.idx) as reviewCnt
    from Host 
    where idx = ? and status = 'ACTIVE';
  `;

  const selectUserHostRow = await connection.query(
      selectUserHostQuery,
      hostIdx
  );

  return selectUserHostRow[0];
}

// 유저 리뷰 등록 체크
async function selectUserReview(connection, reviewIdx, userIdx) {
  const selectUserReviewQuery = `
    select 
           *
    from Review 
    where idx = ? and userIdx = ?;
  `;

  const selectUserReviewRow = await connection.query(
      selectUserReviewQuery,
      [reviewIdx, userIdx]
  );

  return selectUserReviewRow[0];
}

// 리뷰 정보 수정
async function updateReviewInfo(connection, reviewMessage, reviewIdx, userIdx) {
  const updateReviewInfoQuery = `
    update Review
    set reviewMessage = ?
    where idx = ? and userIdx = ?;
  `;

  const updateReviewInfoRow = await connection.query(
      updateReviewInfoQuery,
      [reviewMessage, reviewIdx, userIdx]
  );

  return updateReviewInfoRow;
}

// 리뷰 삭제
async function updateReviewStatus(connection, status, reviewIdx, userIdx) {
  const updateReviewStatusQuery = `
    update Review
    set status = ?
    where idx = ? and userIdx = ?;
  `;

  const updateReviewStatusRow = await connection.query(
      updateReviewStatusQuery,
      [status, reviewIdx, userIdx]
  );

  return updateReviewStatusRow;
}


module.exports = {
  insertReview, // 리뷰 등록
  selectUserReviewList, // 리뷰 등록 조회
  selectHostReview, // 호스트 리뷰 조회
  selectHostReviewList, // 호스트 리뷰 조회 (배열)
  selectUserHost, // 호스트 조회
  selectUserReview, // 유저 리뷰 등록 체크
  updateReviewInfo, // 리뷰 정보 수정
  updateReviewStatus, // 리뷰 삭제

}