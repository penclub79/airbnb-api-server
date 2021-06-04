
// 위시리스트 게시판 생성
async function insertWishList (connection, insertWishListParams) {
  const insertWishListQuery = `
    insert into WishList(userIdx, wishTitle)
    values (?, ?);
  `;

  const insertWishListRow = await connection.query(
      insertWishListQuery,
      insertWishListParams
  );

  return insertWishListRow;
}

// 위시 - 호스트 등록
async function insertWishHost (connection, wishHostParams) {
  const insertWishHostQuery = `
    insert into WishHost(wishListIdx, hostIdx, guestCnt, startDate, endDate)
    values(?, ?, ?, ?, ?);
  `;

  const insertWishHostRow = await connection.query(
      insertWishHostQuery,
      wishHostParams
  );

  return insertWishHostRow;
}

// 위시리스트 등록 여부 체크
async function selectWishList (connection, wishListIdx) {
  const selectWishListQuery = `
    select * from WishList where idx = ?;
  `;

  const selectWishListRow = await connection.query(
      selectWishListQuery,
      wishListIdx
  );

  return selectWishListRow[0];
}

// 위시 - 호스트 등록 여부 체크
async function selectWishHost (connection, wishListIdx, hostIdx) {
  const selectWishHostQuery = `
    select * from WishHost where wishListIdx = ? and hostIdx = ?;
  `;

  const selectWishHostRow = await connection.query(
      selectWishHostQuery,
      [wishListIdx, hostIdx]
  );

  return selectWishHostRow[0];
}

// 유저 위시리스트 조회
async function selectUserWishList (connection, userIdx) {
  const selectUserWishListQuery = `
      select
          WishList.idx as idx,
          WishList.wishTitle as title,
          WH.hostIdx as hostIdx,
          DATE_FORMAT(WH.startDate, '%Y-%m-%d') as startDate,
          DATE_FORMAT(WH.endDate, '%Y-%m-%d') as endDate,
          WH.guestCnt as guestCnt
      from WishList
               left join WishHost WH on WH.wishListIdx = WishList.idx
      where WishList.userIdx = ? and WH.hostIdx
      group by WishList.idx;
  `;

  const [selectUserWishListRow] = await connection.query(
      selectUserWishListQuery,
      userIdx
  );

  return selectUserWishListRow;
}

// 위시리스트 - 호스트 조회(배열)
async function selectHostList (connection, hostIdx) {
  const selectHostListQuery = `
      select
          Host.idx as hostIdx,
          A_PH.hostImg as hostImg,
          Host.hostName,
          if(isnull((select round(avg(rating), 2) from Review where Review.hostIdx = Host.idx)), 0, (select round(avg(rating), 2) from Review where Review.hostIdx = Host.idx)) as rating,
          (select count(hostIdx) from Review where Review.hostIdx = Host.idx) as reviewCnt,
          Host.basePrice
      from Host
               left join AccommodationPhoto A_PH on A_PH.hostIdx = Host.idx
      where Host.idx = ? and Host.status = 'ACTIVE'
      group by Host.idx
  `;

  const [selectHostListRow] = await connection.query(
      selectHostListQuery,
      hostIdx
  );

  return selectHostListRow;
}

// userIdx, wishTitle로 위시리스트 조회
async function selectUserByWishList (connection, userIdx, wishTitle) {
  const selectUserByWishListQuery = `
    select * from WishList where userIdx = ? and wishTitle = ?;
  `;

  const selectUserByWishListRow = await connection.query(
      selectUserByWishListQuery,
      [userIdx, wishTitle]
  );

  return selectUserByWishListRow[0];
}

// 위시 조회(배열)
async function selectHostByWishList (connection, wishIdx) {
  const selectHostByWishListQuery = `
    select 
           idx as wishIdx,
           hostIdx as hostInfo
    from WishHost where wishListIdx = ? and isWish = 'Y';
  `;

  const [selectHostByWishListRow] = await connection.query(
    selectHostByWishListQuery,
      wishIdx
  );

  return selectHostByWishListRow;
}

// 위시 - 활성 / 비활성 변경
async function updateIsWish (connection, isWish, wishListIdx, hostIdx) {
  const updateIsWishQuery = `
    update WishHost
    set isWish = ?
    where wishlistIdx = ? and hostIdx = ?;
  `;

  const updateIsWishRow = await connection.query(
      updateIsWishQuery,
      [isWish, wishListIdx, hostIdx]
  );

  return updateIsWishRow;
}

// 위시리스트 정보 수정
async function updateWishList (connection, wishTitle, wishListIdx) {
  const updateWishListQuery = `
    update WishList
    set wishTitle = ?
    where idx = ?;
  `;

  const updateWishListRow = await connection.query(
      updateWishListQuery,
      [wishTitle, wishListIdx]
  );

  return updateWishListRow;
}

// 위시리스트 삭제
async function updateWishListStatus (connection, status, wishListIdx) {
  const updateWishListStatusQuery = `
    update WishList
    set status = ?
    where idx = ?;
  `;

  const updateWishListStatusRow = await connection.query(
      updateWishListStatusQuery,
      [status, wishListIdx]
  );

  return updateWishListStatusRow;
}

module.exports = {
  insertWishList,
  insertWishHost,
  selectWishList,
  selectWishHost,
  selectUserWishList, // 유저 위시리스트 조회
  selectHostList, // 위시리스트 - 호스트 조회(배열)
  selectUserByWishList, // userIdx, wishTitle로 위시리스트 조회
  selectHostByWishList, // 위시 조회(배열)
  updateIsWish,
  updateWishList,
  updateWishListStatus,
}