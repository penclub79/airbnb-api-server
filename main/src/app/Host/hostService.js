const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const hostProvider = require("./hostProvider");
const hostDao = require("./hostDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");
const moment = require("moment");

// TODO: Service - Create, Update, Delete 비즈니스 로직 처리

// 호스트 등록
exports.createHost = async function (
    userIdx,
    hostName,
    accType,
    accTypeDetail,
    typeHouse,
    isGuest,
    country,
    state,
    city,
    street,
    zip,
    basePrice) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    // 호스트 중복 체크
    const userHostListResult = await hostProvider.selectHostList(userIdx, hostName);

    if (userHostListResult.length > 0) {
      return errResponse(baseResponse.SIGNUP_REDUNDANT_HOST);
    } else {
      // 호스트 등록
      const insertHostParams = [
        userIdx,
        hostName,
        accType,
        accTypeDetail,
        typeHouse,
        isGuest,
        country,
        state,
        city,
        street,
        zip,
        basePrice];
      const hostResult = await hostDao.insertHost(connection, insertHostParams);

      return response(baseResponse.SUCCESS_HOST, `추가된 호스트 idx: ${hostResult[0].insertId}`);
    }
  } catch (err) {
    logger.error(`App - createHost Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 카테고리 등록(호스트 등록 후)
// exports.createCategory = async function (hostIdx, accType, accTypeDetail, typeHouse, isGuest) {
//   try {
//     const connection = await pool.getConnection(async (conn) => conn);
//
//     // 호스트 등록 체크
//     const hostRows = await hostProvider.hostCheck(hostIdx);
//     console.log(hostRows)
//     if (hostRows.length == 0)
//       return errResponse(baseResponse.SIGNUP_HOST_NOT_REGISTER);
//
//     // 카테고리 등록 중복 체크
//     const categoryRows = await hostProvider.categoryCheck({hostIdx:hostIdx});
//     if (categoryRows.length > 0)
//       return errResponse(baseResponse.SIGNUP_REDUNDANT_CATEGORY);
//
//     // 카테고리 등록
//     const insertCategoryParams = [hostIdx, accType, accTypeDetail, typeHouse, isGuest];
//     const categoryResult = await hostDao.insertCategory(connection, insertCategoryParams);
//     console.log(`추가된 host카테고리 idx: ${categoryResult[0].insertId}`);
//
//     // 호스트 등록에서 카테고리 idx등록 완료
//     const updateHostByCategoryIdx = await hostDao.updateHostByCategoryIdx(connection, categoryResult[0].insertId, hostIdx);
//     connection.release();
//
//     return response(baseResponse.SUCCESS_CATEGORY, {"hostIdx": hostIdx, "message": `추가된 카테고리idx: ${categoryResult[0].insertId}`});
//
//   } catch (err) {
//     logger.error(`App - createCategory Service error\n: ${err.message}`);
//     return errResponse(baseResponse.DB_ERROR);
//   }
// };

// 인원 등록(카테고리 등록 후 )
// exports.createPerson = async function (categoryIdx, guestCnt, bedRoomCnt, bedCnt) {
//   try {
//
//     // 카테고리 등록 체크
//     const categoryRows = await hostProvider.categoryCheck({categoryIdx:categoryIdx});
//     if (categoryRows.length == 0)
//       return errResponse(baseResponse.SIGNUP_CATEGORY_NOT_REGISTER);
//
//     // 인원 등록 중복 체크
//     const personRows = await hostProvider.personCheck(categoryIdx);
//     if (personRows.length > 0)
//       return errResponse(baseResponse.SIGNUP_REDUNDANT_PERSON);
//
//     const connection = await pool.getConnection(async (conn) => conn);
//     const insertPersonParams = [categoryIdx, guestCnt, bedRoomCnt, bedCnt];
//     const personResult = await hostDao.insertPerson(connection, insertPersonParams);
//     console.log(`추가된 Host person idx: ${personResult[0].insertId}`);
//     connection.release();
//
//     // 인원 등록 후 카테고리에 인원idx 추가
//     const updateCategoryByPersonIdx = await hostDao.updateCategoryByPersonIdx(connection, personResult[0].insertId, categoryIdx);
//     connection.release();
//
//     return response(baseResponse.SUCCESS_CATEGORY_PERSON, `추가된 Host Person idx: ${personResult[0].insertId}`)
//
//   } catch (err) {
//     logger.error(`App - createPerson Service error\n: ${err.message}`);
//     return errResponse(baseResponse.DB_ERROR);
//   }
// };

// 침대 유형 등록(카테고리의 인원 등록 후)
// exports.createBedType = async function (categoryIdx, couchCnt, singleCnt, smallDoubleCnt, doubleCnt, queenCnt, kingCnt, bunkBedCnt) {
//   try {
//
//     // 카테고리 등록 체크
//     const categoryRows = await hostProvider.categoryCheck({categoryIdx:categoryIdx});
//     if (categoryRows.length == 0)
//       return errResponse(baseResponse.SIGNUP_CATEGORY_NOT_REGISTER);
//
//     // 침대 유형 등록 중복 체크
//     const BedRoomRows = await hostProvider.bedRoomCheck(categoryIdx);
//     if (BedRoomRows.length > 0)
//       return errResponse(baseResponse.SIGNUP_REDUNDANT_BEDROOM);
//
//     const connection = await pool.getConnection(async (conn) => conn);
//     const insertBedRoomParams = [categoryIdx, couchCnt, singleCnt, smallDoubleCnt, doubleCnt, queenCnt, kingCnt, bunkBedCnt];
//     const bedRoomResult = await hostDao.insertBedRoom(connection, insertBedRoomParams);
//     console.log(`추가된 Host person idx: ${bedRoomResult[0].insertId}`);
//     connection.release();
//
//     const updateCategoryByBedRoomIdx = await hostDao.updateCategoryByBedRoomIdx(connection, bedRoomResult[0].insertId, categoryIdx);
//     connection.release();
//
//     return response(baseResponse.SUCCESS_CATEGORY_BEDTYPE, `추가된 Host BedRoom idx: ${bedRoomResult[0].insertId}`)
//
//   } catch (err) {
//     logger.error(`App - createBedType Service error\n: ${err.message}`);
//     return errResponse(baseResponse.DB_ERROR);
//   }
// };

// 호스트 위치 등록
// exports.createHostLocation = async function (hostIdx, country, state, city, street, etc, zip) {
//   try {
//
//     // 호스트 등록 체크
//     const hostRows = await hostProvider.hostCheck(hostIdx);
//     if (hostRows.length == 0)
//       return errResponse(baseResponse.SIGNUP_HOST_NOT_REGISTER);
//
//     // 호스트에 카테고리 등록됐는지 체크 -> 카테고리 등록해야 위치등록 가능
//     const categoryRows = await hostProvider.categoryCheck({hostIdx:hostIdx});
//     if (categoryRows.length == 0)
//       return errResponse(baseResponse.SIGNUP_CATEGORY_NOT_REGISTER);
//
//     // 위치 등록 중복 체크
//     const locationRows = await hostProvider.locationCheck(hostIdx);
//     if (locationRows.length > 0)
//       return errResponse(baseResponse.SIGNUP_REDUNDANT_LOCATION);
//
//     // 위치 등록
//     const connection = await pool.getConnection(async (conn) => conn);
//     const insertHostLocationParams = [hostIdx, country, state, city, street, etc, zip];
//     const insertHostLocationResult = await hostDao.insertHostLocation(connection, insertHostLocationParams);
//     console.log(`추가된 Host Location idx: ${insertHostLocationResult[0].insertId}`);
//
//     const updateHostByLocationIdx = await hostDao.updateHostByLocationIdx(connection, insertHostLocationResult[0].insertId, hostIdx)
//     connection.release();
//
//     return response(baseResponse.SUCCESS_LOCATION, {"hostIdx": hostIdx, "message": `추가된 location idx: ${insertHostLocationResult[0].insertId}`})
//
//   } catch (err) {
//     logger.error(`App - createHostLocation Service error\n: ${err.message}`);
//     return errResponse(baseResponse.DB_ERROR);
//   }
// };

// 호스트 편의시설 등록
// exports.createHostAmenities = async function (hostIdx, isWifi, isAirConditioning, isHairDryer, isKitchen, isWasher) {
//   try {
//
//     // 호스트 등록 체크
//     const hostRows = await hostProvider.hostCheck(hostIdx);
//     if (hostRows.length == 0)
//       return errResponse(baseResponse.SIGNUP_HOST_NOT_REGISTER);
//
//     // 호스트에 위치 등록됐는지 체크 -> 위치 등록해야 편의시설 등록 가능
//     const locationRows = await hostProvider.locationCheck(hostIdx);
//     if (locationRows.length == 0)
//       return errResponse(baseResponse.SIGNUP_LOCATION_NOT_REGISTER);
//
//     // 편의시설 등록 중복 체크
//     const amenitiesRows = await hostProvider.amenitiesCheck(hostIdx);
//     if (amenitiesRows.length > 0)
//       return errResponse(baseResponse.SIGNUP_REDUNDANT_LOCATION);
//
//     // 편의시설 등록
//     const connection = await pool.getConnection(async (conn) => conn);
//     const insertHostAmenitiesParams = [hostIdx, isWifi, isAirConditioning, isHairDryer, isKitchen, isWasher];
//     const insertHostAmenitiesResult = await hostDao.insertHostAmenities(connection, insertHostAmenitiesParams);
//     console.log(`추가된 편의시설 idx: ${insertHostAmenitiesResult[0].insertId}`);
//
//     // 호스트 <- 편의시설 idx 추가
//     const updateHostByAmenitiesIdx = await hostDao.updateHostByAmenitiesIdx(connection, insertHostAmenitiesResult[0].insertId, hostIdx)
//     connection.release();
//
//     return response(baseResponse.SUCCESS_AMENITIES, {"hostIdx": hostIdx, "message": `추가된 편의시설 idx: ${insertHostAmenitiesResult[0].insertId}`})
//
//   } catch (err) {
//     logger.error(`App - createHostAmenities Service error\n: ${err.message}`);
//     return errResponse(baseResponse.DB_ERROR);
//   }
// }

// 호스트 사진 등록
exports.createHostPhoto = async function (hostIdx, hostImg) {
  try {
    // 호스트 등록 체크
    const hostRows = await hostProvider.hostCheck(hostIdx);
    if (hostRows.length == 0)
      return errResponse(baseResponse.SIGNUP_HOST_NOT_REGISTER);

    // // 호스트에 편의시설 등록됐는지 체크 -> 편의시설 등록해야 사진 등록 가능
    // const photoRows = await hostProvider.amenitiesCheck(hostIdx);
    // if (photoRows.length == 0)
    //   return errResponse(baseResponse.SIGNUP_AMENITIES_NOT_REGISTER);

    // 사진 등록
    const connection = await pool.getConnection(async (conn) => conn);
    const insertHostPhotoParams = [hostIdx, hostImg];
    const insertHostPhotoResult = await hostDao.insertHostPhoto(connection, insertHostPhotoParams);
    console.log(`추가된 호스트 사진 idx: ${insertHostPhotoResult[0].insertId}`);

    return response(baseResponse.SUCCESS_HOST_PHOTO, {"hostIdx": hostIdx, "message": `추가된 호스트 사진 idx: ${insertHostPhotoResult[0].insertId}`})

  } catch (err) {
    logger.error(`App - createHostPhoto Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}

// 호스트 예약 설정 등록
// exports.createHostReservations = async function (hostIdx, advanceNotice, isRequest, availabilityWindow, arriveAfter, leaveBefore, minStay, maxStay, isReservationRequest) {
//   try {
//     // 호스트 등록 체크
//     const hostRows = await hostProvider.hostCheck(hostIdx);
//     if (hostRows.length == 0)
//       return errResponse(baseResponse.SIGNUP_HOST_NOT_REGISTER);
//
//     // 호스트에 사진 등록됐는지 체크 -> 사진 등록해야 예약설정 등록 가능
//     const photoRows = await hostProvider.photoCheck({hostIdx:hostIdx});
//     if (photoRows.length == 0)
//       return errResponse(baseResponse.SIGNUP_PHOTO_NOT_REGISTER);
//
//     // 편의시설 등록 중복 체크
//     const reservationRows = await hostProvider.reservationCheck(hostIdx);
//     if (reservationRows.length > 0)
//       return errResponse(baseResponse.SIGNUP_REDUNDANT_RESERVATION);
//
//     // 예약 설정 등록
//     const connection = await pool.getConnection(async (conn) => conn);
//     const insertHostReservationParams = [hostIdx, advanceNotice, isRequest, availabilityWindow, arriveAfter, leaveBefore, minStay, maxStay, isReservationRequest];
//     const insertHostReservationResult = await hostDao.insertHostReservation(connection, insertHostReservationParams);
//     console.log(`추가된 예약설정 idx: ${insertHostReservationResult[0].insertId}`);
//
//     // 호스트 <- 예약설정 idx 추가
//     const updateHostByReservationIdx = await hostDao.updateHostByReservationIdx(connection, insertHostReservationResult[0].insertId, hostIdx)
//     connection.release();
//
//     return response(baseResponse.SUCCESS_RESERVATION, {"hostIdx": hostIdx, "message": `추가된 예약설정 idx: ${insertHostReservationResult[0].insertId}`});
//
//   } catch (err) {
//     logger.error(`App - createHostReservations Service error\n: ${err.message}`);
//     return errResponse(baseResponse.DB_ERROR);
//   }
// }

// 호스트 요금 등록
// exports.createHostPrice = async function (hostIdx, basePrice) {
//   try {
//     // 호스트 등록 체크
//     const hostRows = await hostProvider.hostCheck(hostIdx);
//     if (hostRows.length == 0)
//       return errResponse(baseResponse.SIGNUP_HOST_NOT_REGISTER);
//
//     // 호스트에 예약설정 등록됐는지 체크 -> 예약설정 등록해야 가격 등록 가능
//     const reservationRows = await hostProvider.reservationCheck(hostIdx);
//     if (reservationRows.length == 0)
//       return errResponse(baseResponse.SIGNUP_RESERVATION_NOT_REGISTER);
//
//     // 가격 등록 중복 체크
//     const priceRows = await hostProvider.priceCheck(hostIdx);
//     if (priceRows.length > 0)
//       return errResponse(baseResponse.SIGNUP_REDUNDANT_PRICE);
//
//     // 가격 등록
//     const connection = await pool.getConnection(async (conn) => conn);
//     const insertHostPriceParams = [hostIdx, basePrice];
//     const insertHostPriceResult = await hostDao.insertHostPrice(connection, insertHostPriceParams);
//     console.log(`추가된 가격설정 idx: ${insertHostPriceResult[0].insertId}`);
//
//     // 호스트 <- 가격등록 idx 추가
//     const updateHostByReservationIdx = await hostDao.updateHostByPriceIdx(connection, insertHostPriceResult[0].insertId, hostIdx)
//
//     // 호스트 요금 설정까지 마치면 status LOCK -> ACTIVE로 바뀜
//     // 호스트 현재 날짜로 등록 날짜가 적용
//     const d = new Date();
//     const today = moment(d).format("YYYY-MM-DD");
//     const updateHostActive = await hostDao.updateHostActiveStatus(connection,'ACTIVE', hostIdx)
//     connection.release();
//
//     return response(baseResponse.SUCCESS_HOST_PRICE, {"hostIdx": hostIdx, "message": `추가된 가격설정 idx: ${insertHostPriceResult[0].insertId}`});
//
//   } catch (err) {
//    logger.error(`App - createHostPrice Service error\n: ${err.message}`);
//    return errResponse(baseResponse.DB_ERROR);
//   }
// }

// 호스트 수정
exports.editHostInfo = async function (
    hostName,
    accType,
    accTypeDetail,
    typeHouse,
    isGuest,
    country,
    state,
    city,
    street,
    zip,
    basePrice, hostIdx) {
  try {
    // 호스트 등록 체크
    const hostRows = await hostProvider.hostCheck(hostIdx);
    if (hostRows.length == 0)
      return errResponse(baseResponse.SIGNUP_HOST_NOT_REGISTER);

    const connection = await pool.getConnection(async (conn) => conn);
    const editHostInfoResult = await hostDao.updateHostInfo(connection,
        hostName,
        accType,
        accTypeDetail,
        typeHouse,
        isGuest,
        country,
        state,
        city,
        street,
        zip,
        basePrice, hostIdx);
    connection.release();

    return response(baseResponse.SUCCESS_HOST_INFO_MODIFY, `수정된 호스트Idx: ${hostIdx}`);

  } catch (err) {
    logger.error(`App - editHostInfo Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}

// 카테고리 수정
// exports.editHostCategory = async function (accType, accTypeDetail, typeHouse, isGuest, hostIdx) {
//   try {
//     // 호스트 등록 체크
//     const hostRows = await hostProvider.hostCheck(hostIdx);
//     if (hostRows.length == 0)
//       return errResponse(baseResponse.SIGNUP_HOST_NOT_REGISTER);
//
//     const connection = await pool.getConnection(async (conn) => conn);
//     const editHostCategoryResult = await hostDao.updateHostCategory(connection, accType, accTypeDetail, typeHouse, isGuest, hostIdx);
//     connection.release();
//
//     return response(baseResponse.SUCCESS_HOST_CATEGORY_MODIFY, `수정된 호스트Idx: ${hostIdx}`);
//   } catch (err) {
//     logger.error(`App - editHostInfo Service error\n: ${err.message}`);
//     return errResponse(baseResponse.DB_ERROR);
//   }
// }

// 카테고리 인원 수정
// exports.editCategoryPerson = async function (guestCnt, bedRoomCnt, bedCnt, categoryIdx) {
//   try {
//     // 카테고리 등록 체크
//     const categoryRows = await hostProvider.categoryCheck({categoryIdx:categoryIdx});
//     if (categoryRows.length == 0)
//       return errResponse(baseResponse.SIGNUP_CATEGORY_NOT_REGISTER);
//
//     const connection = await pool.getConnection(async (conn) => conn);
//     const editCategoryPersonResult = await hostDao.updateCategoryPerson(connection, guestCnt, bedRoomCnt, bedCnt, categoryIdx);
//     connection.release();
//
//     return response(baseResponse.SUCCESS_CATEGORY_PERSON_MODIFY, `수정된 카테고리Idx: ${categoryIdx}`);
//   } catch (err) {
//     logger.error(`App - editHostInfo Service error\n: ${err.message}`);
//     return errResponse(baseResponse.DB_ERROR);
//   }
// }

// 카테고리 침실 유형 수정
// exports.editCategoryBedRoom = async function (couchCnt, singleCnt, smallDoubleCnt, doubleCnt, queenCnt, kingCnt, bunkBedCnt, categoryIdx) {
//   try {
//     // 카테고리 등록 체크
//     const categoryRows = await hostProvider.categoryCheck({categoryIdx:categoryIdx});
//     if (categoryRows.length == 0)
//       return errResponse(baseResponse.SIGNUP_CATEGORY_NOT_REGISTER);
//
//     const connection = await pool.getConnection(async (conn) => conn);
//     const editCategoryBedRoomResult = await hostDao.updateCategoryBedRoom(connection, couchCnt, singleCnt, smallDoubleCnt, doubleCnt, queenCnt, kingCnt, bunkBedCnt, categoryIdx);
//     connection.release();
//
//     return response(baseResponse.SUCCESS_CATEGORY_BEDROOM_MODIFY, `수정된 카테고리Idx: ${categoryIdx}`);
//   } catch (err) {
//     logger.error(`App - editHostInfo Service error\n: ${err.message}`);
//     return errResponse(baseResponse.DB_ERROR);
//   }
// }

// 호스트 위치 수정
// exports.editHostLocation = async function (country, state, city, street, etc, zip, hostIdx) {
//   try {
//     // 호스트 등록 체크
//     const hostRows = await hostProvider.hostCheck(hostIdx);
//     if (hostRows.length == 0)
//       return errResponse(baseResponse.SIGNUP_HOST_NOT_REGISTER);
//
//     const connection = await pool.getConnection(async (conn) => conn);
//     const editHostLocationResult = await hostDao.updateHostLocation(connection, country, state, city, street, etc, zip, hostIdx);
//     connection.release();
//
//     return response(baseResponse.SUCCESS_HOST_LOCATION_MODIFY, `수정된 호스트Idx: ${hostIdx}`);
//   } catch (err) {
//     logger.error(`App - editHostInfo Service error\n: ${err.message}`);
//     return errResponse(baseResponse.DB_ERROR);
//   }
// }

// 호스트 편의시설 수정
// exports.editHostAmenities = async function (isWifi, isAirConditioning, isHairDryer, isKitchen, isWasher, hostIdx) {
//   try {
//     // 호스트 등록 체크
//     const hostRows = await hostProvider.hostCheck(hostIdx);
//     if (hostRows.length == 0)
//       return errResponse(baseResponse.SIGNUP_HOST_NOT_REGISTER);
//
//     const connection = await pool.getConnection(async (conn) => conn);
//     const editHostAmenitiesResult = await hostDao.updateHostAmenities(connection, isWifi, isAirConditioning, isHairDryer, isKitchen, isWasher, hostIdx);
//     connection.release();
//
//     return response(baseResponse.SUCCESS_HOST_AMENITIES_MODIFY, `수정된 호스트Idx: ${hostIdx}`);
//   } catch (err) {
//     logger.error(`App - editHostInfo Service error\n: ${err.message}`);
//     return errResponse(baseResponse.DB_ERROR);
//   }
// }

// 호스트 사진 삭제
exports.editHostPhoto = async function (status, hostIdx, photoIdx) {
  try {
    // 호스트 등록 체크
    const hostRows = await hostProvider.hostCheck(hostIdx);
    if (hostRows.length == 0)
      return errResponse(baseResponse.SIGNUP_HOST_NOT_REGISTER);

    // 사진 등록 여부 체크
    const photoCheckResult = await hostProvider.photoCheck({photoIdx:photoIdx});
    if (photoCheckResult.length == 0)
      return errResponse(baseResponse.SIGNUP_PHOTO_NOT_REGISTER);

    // 삭제 중복 체크
    if (photoCheckResult[0].status == status)
      return errResponse(baseResponse.SIGNUP_REDUNDANT_PHOTO_STATUS);

    // 사진 등록 체크
    const connection = await pool.getConnection(async (conn) => conn);
    const editHostPhotoResult = await hostDao.updateHostPhoto(connection, status, hostIdx, photoIdx);
    connection.release();

    return response(baseResponse.SUCCESS_HOST_PHOTO_DELETE, `삭제된 호스트 사진Idx: ${photoIdx}`);
  } catch (err) {
    logger.error(`App - editHostInfo Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}

// 호스트 예약 설정 수정
// exports.editHostReservation = async function (advanceNotice, isRequest, availabilityWindow, arriveAfter, leaveBefore, minStay, maxStay, isReservationRequest, hostIdx) {
//   try {
//     // 호스트 등록 체크
//     const hostRows = await hostProvider.hostCheck(hostIdx);
//     if (hostRows.length == 0)
//       return errResponse(baseResponse.SIGNUP_HOST_NOT_REGISTER);
//
//     const connection = await pool.getConnection(async (conn) => conn);
//     const editHostReservationResult = await hostDao.updateHostReservation(connection, advanceNotice, isRequest, availabilityWindow, arriveAfter, leaveBefore, minStay, maxStay, isReservationRequest, hostIdx);
//     connection.release();
//
//     return response(baseResponse.SUCCESS_HOST_RESERVATION_MODIFY, `수정된 호스트Idx: ${hostIdx}`);
//   } catch (err) {
//     logger.error(`App - editHostInfo Service error\n: ${err.message}`);
//     return errResponse(baseResponse.DB_ERROR);
//   }
// }

// 호스트 요금 설정 수정
// exports.editHostPrice = async function (basePrice, hostIdx) {
//   try {
//     // 호스트 등록 체크
//     const hostRows = await hostProvider.hostCheck(hostIdx);
//     if (hostRows.length == 0)
//       return errResponse(baseResponse.SIGNUP_HOST_NOT_REGISTER);
//
//     const connection = await pool.getConnection(async (conn) => conn);
//     const editHostPriceResult = await hostDao.updateHostPrice(connection, basePrice, hostIdx);
//     connection.release();
//
//     return response(baseResponse.SUCCESS_HOST_PRICE_MODIFY, `수정된 호스트Idx: ${hostIdx}`);
//   } catch (err) {
//     logger.error(`App - editHostInfo Service error\n: ${err.message}`);
//     return errResponse(baseResponse.DB_ERROR);
//   }
// }

// 호스트 상태 수정(삭제)
exports.editHostStatus = async function (status, hostIdx) {
  try {
    // 호스트 등록 체크
    const hostRows = await hostProvider.hostCheck(hostIdx);
    if (hostRows.length == 0)
      return errResponse(baseResponse.SIGNUP_HOST_NOT_REGISTER);

    // 호스트 상태 중복 체크
    if (hostRows[0].status == status)
      return errResponse(baseResponse.SIGNUP_REDUNDANT_HOST_STATUS);

    const connection = await pool.getConnection(async (conn) => conn);
    const editHostStatusResult = await hostDao.updateHostStatus(connection, status, hostIdx);
    connection.release();

    return response(baseResponse.SUCCESS_HOST_DELETE, `삭제된 호스트Idx: ${hostIdx}`);
  } catch (err) {
    logger.error(`App - editHostInfo Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}