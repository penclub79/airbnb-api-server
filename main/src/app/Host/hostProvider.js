const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const hostDao = require("./hostDao");

// 호스트 등록 체트
exports.hostCheck = async function (hostIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const hostCheckResult = await hostDao.selectUserHost(connection, hostIdx);
  connection.release();

  return hostCheckResult;
};

// ACTIVE 호스트 등록 체크
exports.perfactHostCheck = async function (hostIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const perfactHostCheckResult = await hostDao.selectPerfactHost(connection, hostIdx);
  connection.release();

  return perfactHostCheckResult;
}

// 카테고리 등록 체크
exports.categoryCheck = async function (values) {

  if (values.categoryIdx) { // 카테고리 등록 체크
    const connection = await pool.getConnection(async (conn) => conn);
    const categoryCheckResult = await hostDao.selectCategoryIdx(connection, values.categoryIdx);
    connection.release();

    return categoryCheckResult;

  } else { // 호스트에 등록된 카테고리 체크
    const connection = await pool.getConnection(async (conn) => conn);
    const categoryCheckResult = await hostDao.selectCategory(connection, values.hostIdx);
    connection.release();

    return categoryCheckResult;
  }
};

// 카테고리의 인원 등록 체크
exports.personCheck = async function (categoryIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const personCheckResult = await hostDao.selectCategoryPerson(connection, categoryIdx);
  connection.release();

  return personCheckResult;
};

// 카테고리 <- 인원 <- 침대 유형 체크
exports.bedRoomCheck = async function (categoryIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const bedRoomCheckResult = await hostDao.selectCategoryBedRoom(connection, categoryIdx);
  connection.release();

  return bedRoomCheckResult;
};

// 호스트 <- 카테고리 체크
exports.hostByCategoryCheck = async function (hostIdx, categoryIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const hostByCategoryCheckResult = await hostDao.selectHostByCategoryCheck(connection, hostIdx, categoryIdx);
  connection.release();

  return hostByCategoryCheckResult;
};

// 호스트 <- 위치 등록 체크
exports.locationCheck = async function (hostIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const hostByLocationCheckResult = await hostDao.selectHostByLocationCheck(connection, hostIdx);
  connection.release();

  return hostByLocationCheckResult;
};

// 호스트 <- 편의시설 등록 체크
exports.amenitiesCheck = async function (hostIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const hostByAmenitiesCheckResult = await hostDao.selectHostByAmenitiesCheck(connection, hostIdx);
  connection.release();

  return hostByAmenitiesCheckResult;
}

// 호스트 <- 사진 등록 체크
exports.photoCheck = async function (values) {
  const connection = await pool.getConnection(async (conn) => conn);

  if (values.hostIdx) {
    const hostByPhotoCheckResult = await hostDao.selectHostByPhotoCheck(connection, values.hostIdx);
    connection.release();

    return hostByPhotoCheckResult;
  } else {
    const photoCheckResult = await hostDao.selectPhotoCheck(connection, values.photoIdx);
    connection.release();

    return photoCheckResult;
  }
}

// 호스트 <- 예약 설정 등록 체크
exports.reservationCheck = async function (hostIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const hostByReservationCheckResult = await hostDao.selectHostByReservationCheck(connection, hostIdx);
  connection.release();

  return hostByReservationCheckResult;
}

// 호스트 <- 가격 설정 등록 체크
exports.priceCheck = async function (hostIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const hostByPriceCheckResult = await hostDao.selectHostByPriceCheck(connection, hostIdx);
  connection.release();

  return hostByPriceCheckResult;
}

// 호스트 전체 조회
exports.retrieveHostList = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const retrieveHostListResult = await hostDao.selectHostList(connection);
  connection.release();

  return retrieveHostListResult;
}

// 호스트 지역 조회
exports.retrieveStateHostList = async function (state) {
  const connection = await pool.getConnection(async (conn) => conn);
  const retrieveStateHostListResult = await hostDao.selectStateHostList(connection, state);
  connection.release();

  return retrieveStateHostListResult;
}

// 호스트 사진 조회(배열 넣기)
exports.retrieveHostPhoto = async function (hostIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const retrieveHostPhotoResult = await hostDao.selectHostPhotoList(connection, hostIdx);
  connection.release();

  return retrieveHostPhotoResult;
}

// 호스트 카테고리 조회(배열 넣기)
exports.retrieveHostCategory = async function (hostIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const retrieveHostCategoryResult = await hostDao.selectHostCategoryList(connection, hostIdx);
  connection.release();

  return retrieveHostCategoryResult;

}

// 카테고리 인원설정 조회(배열 넣기)
exports.retrievePersonnel = async function (categoryIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const retrievePersonnelResult = await hostDao.selectPersonnelList(connection, categoryIdx);
  connection.release();

  return retrievePersonnelResult;
}

// 카테고리 침실유형 조회(배열 넣기)
exports.retrieveBedroomType = async function (categoryIdx) {
  connection = await pool.getConnection(async (conn) => conn);
  const retrieveBedRoomResult = await hostDao.selectBedRoomList(connection, categoryIdx);
  connection.release();

  return retrieveBedRoomResult;
}

// 호스트 위치 조회(배열 넣기)
exports.retrieveHostLocation = async function (hostIdx) {
  connection = await pool.getConnection(async (conn) => conn);
  const retrieveLocationResult = await hostDao.selectLocationList(connection, hostIdx);
  connection.release();

  return retrieveLocationResult;
}

// 호스트 예약 조회(배열 넣기)
exports.retrieveHostReservation = async function (hostIdx) {
  connection = await pool.getConnection(async (conn) => conn);
  const retrieveReservationResult = await hostDao.selectReservationList(connection, hostIdx);
  connection.release();

  return retrieveReservationResult;
}

// 호스트 가격 조회(배열 넣기)
exports.retrieveHostPrice = async function (hostIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const retrievePriceResult = await hostDao.selectPriceList(connection, hostIdx);
  connection.release();

  return retrievePriceResult;
}

// 유저 호스트 조회
exports.selectHostList = async function (userIdx, hostName) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectHostListResult = await hostDao.selectUserHostList(connection, userIdx, hostName);
  connection.release();

  return selectHostListResult;
}