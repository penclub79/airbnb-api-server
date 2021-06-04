// 초기 호스트 등록
async function insertHost(connection, insertHostParams) {
  const insertHostQuery = `
    insert into Host(userIdx,
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
                     basePrice)
    values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;
  const insertHostRow = await connection.query(
    insertHostQuery,
    insertHostParams
  );

  return insertHostRow;
}

// 카테고리 등록
// async function insertCategory(connection, insertCategoryParams){
//   const insertCategoryQuery = `
//     insert into AccommodationCategory(hostIdx, accType, accTypeDetail, typeHouse, isGuest)
//     values (?, ?, ?, ?, ?);
//   `;
//
//   const insertCategoryRow = await connection.query(
//     insertCategoryQuery,
//     insertCategoryParams
//   );
//
//   return insertCategoryRow;
// }

// 카테고리 인원 등록
// async function insertPerson(connection, insertPersonParams) {
//   const insertPersonQuery = `
//     insert into AccommodationPersonnel( categoryIdx, guestCnt, bedRoomCnt, bedCnt )
//     values (?, ?, ?, ?);
//   `;
//
//   const insertPersonRow = await connection.query(
//     insertPersonQuery,
//     insertPersonParams
//   );
//
//   return insertPersonRow;
// }

// 카테고리의 인원 등록 후 침대 유형 등록
// async function insertBedRoom(connection, insertBedRoomParams) {
//   const insertBedRoomQuery = `
//     insert into AccommodationBedType( categoryIdx, couchCnt, singleCnt, smallDoubleCnt, doubleCnt, queenCnt, kingCnt, bunkBedCnt )
//     values (?, ?, ?, ?, ?, ?, ?, ?);
//   `;
//
//   const insertBedRoomRow = await connection.query(
//       insertBedRoomQuery,
//       insertBedRoomParams
//   );
//
//   return insertBedRoomRow;
// }

// 호스트 위치 등록
// async function insertHostLocation(connection, insertHostLocationParams) {
//   const insertHostLocationQuery = `
//     insert into AccommodationLocation ( hostIdx, country, state, city, street, etc, zip )
//     values (?, ?, ?, ?, ?, ?, ?);
//   `;
//
//   const insertHostLocationRow = await connection.query(
//       insertHostLocationQuery,
//       insertHostLocationParams
//   );
//
//   return insertHostLocationRow;
// }

// 호스트 편의시설 등록
// async function insertHostAmenities(connection, insertHostAmenitiesParams) {
//   const insertHostAmenitiesQuery = `
//     insert into AccommodationAmenities ( hostIdx, isWifi, isAirConditioning, isHairDryer, isKitchen, isWasher )
//     values (?, ?, ?, ?, ?, ?);
//   `;
//
//   const insertHostAmenitiesRow = await connection.query(
//       insertHostAmenitiesQuery,
//       insertHostAmenitiesParams
//   );
//
//   return insertHostAmenitiesRow;
// }

// 호스트 사진 등록
async function insertHostPhoto(connection, insertHostPhotoParams) {
  const insertHostPhotoQuery = `
    insert into AccommodationPhoto ( hostIdx, hostImg )
    values (?, ?);
  `;

  const insertHostPhotoRow = await connection.query(
      insertHostPhotoQuery,
      insertHostPhotoParams
  );

  return insertHostPhotoRow;
}

// 호스트 예약 설정 등록
// async function insertHostReservation(connection, insertHostReservationParams) {
//   const insertHostReservationQuery = `
//     insert into ReservationAvailabilitySettingDetail (hostIdx, advanceNotice, isRequest, availabilityWindow, arriveAfter, leaveBefore, minStay, maxStay, isReservationRequest)
//     values (?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `;
//
//   const insertHostReservationRow = await connection.query(
//       insertHostReservationQuery,
//       insertHostReservationParams
//   );
//
//   return insertHostReservationRow;
// }

// 호스트 가격 등록
// async function insertHostPrice(connection, insertHostPriceParams) {
//   const insertHostPriceQuery = `
//     insert into AccommodationPrice ( hostIdx, basePrice )
//     values (?, ?)
//   `;
//
//   const insertHostPriceRow = await connection.query(
//       insertHostPriceQuery,
//       insertHostPriceParams
//   );
//
//   return insertHostPriceRow;
// }

// 인원 등록 후 카테고리에 인원 등록 idx 추가
// async function updateCategoryByPersonIdx(connection, personIdx, categoryIdx) {
//   const insertCategoryByPersonIdxQuery = `
//     update AccommodationCategory
//     set accPersonnelIdx = ?
//     where idx = ?;
//   `;
//   const insertCategoryByPersonIdxRow = await connection.query(
//       insertCategoryByPersonIdxQuery,
//       [personIdx, categoryIdx]
//   );
//
//   return insertCategoryByPersonIdxRow;
// }

// 침대 유형 등록 후 카테고리에 침대 유형 idx 추가
// async function updateCategoryByBedRoomIdx(connection, bedRoomIdx, categoryIdx) {
//   const updateCategoryByBedRoomIdxQuery = `
//     update AccommodationCategory
//     set accBedIdx = ?
//     where idx = ?;
//   `;
//
//   const updateCategoryByBedRoomIdxRow = await connection.query(
//       updateCategoryByBedRoomIdxQuery,
//       [bedRoomIdx, categoryIdx]
//   );
//
//   return updateCategoryByBedRoomIdxRow;
// }

// 카테고리 등록 후 호스트에 카테고리idx 추가
// async function updateHostByCategoryIdx(connection, categoryIdx, hostIdx) {
//   const updateHostByCategoryIdxQuery = `
//      update Host
//      set categoryIdx = ?
//      where idx = ?;
//   `;
//
//   const updateHostByCategoryIdxRow = await connection.query(
//       updateHostByCategoryIdxQuery,
//       [categoryIdx, hostIdx]
//   );
//
//   return updateHostByCategoryIdxRow;
// }

// 호스트 <- 위치idx 추가
// async function updateHostByLocationIdx(connection, locationIdx, hostIdx) {
//   const updateHostByLocationIdxQuery = `
//     update Host
//     set locationIdx = ?
//     where idx = ?;
//   `;
//
//   const updateHostByLocationIdxRow = await connection.query(
//       updateHostByLocationIdxQuery,
//       [locationIdx, hostIdx]
//   );
//
//   return updateHostByLocationIdxRow;
// }

// 호스트 <- 편의시설idx 추가
// async function updateHostByAmenitiesIdx(connection, amenitiesIdx, hostIdx) {
//   const updateHostByAmenitiesIdxQuery = `
//     update Host
//     set amenitiesIdx = ?
//     where idx = ?;
//   `;
//
//   const updateHostByAmenitiesIdxRow = await connection.query(
//     updateHostByAmenitiesIdxQuery,
//     [amenitiesIdx, hostIdx]
//   );
//
//   return updateHostByAmenitiesIdxRow;
// }

// 호스트 <- 예약설정idx 추가
// async function updateHostByReservationIdx(connection, reservationIdx, hostIdx) {
//   const updateHostByReservationIdxQuery = `
//     update Host
//     set reservationIdx = ?
//     where idx = ?;
//   `;
//
//   const updateHostByReservationIdxRow = await connection.query(
//       updateHostByReservationIdxQuery,
//       [reservationIdx, hostIdx]
//   );
//
//   return updateHostByReservationIdxRow;
// }

// 호스트 <- 가격idx 추가
// async function updateHostByPriceIdx(connection, priceIdx, hostIdx) {
//  const  updateHostByPriceIdxQuery = `
//     update Host
//     set priceIdx = ?
//     where idx = ?;
//  `;
//
//  const updateHostByPriceIdxRow = await connection.query(
//     updateHostByPriceIdxQuery,
//     [priceIdx, hostIdx]
//  );
//
//  return updateHostByPriceIdxRow;
// }

// 호스트 모두 등록시 status = ACTIVE
async function updateHostActiveStatus(connection, status, hostIdx) {
  const updateHostActiveStatusQuery = `
    update Host
    set 
        status = ?
    where idx = ?;
  `;

  const updateHostActiveStatusRow = await connection.query(
      updateHostActiveStatusQuery,
      [status, hostIdx]
  );

  return updateHostActiveStatusRow;
}

// 호스트 정보 수정
async function updateHostInfo(connection, hostName, accType, accTypeDetail, typeHouse, isGuest, country, state, city, street, zip, basePrice, hostIdx) {
  const updateHostInfoQuery = `
    update Host
    set
        hostName = ?,
        accType = ?,
        accTypeDetail = ? ,
        typeHouse=?,
        isGuest=?,
        country=?,
        state=?,
        city=?,
        street=?,
        zip=?,
        basePrice=?
    where idx = ?
  `;

  const updateHostInfoRow = await connection.query(
      updateHostInfoQuery,
      [hostName,
        accType,
        accTypeDetail,
        typeHouse,
        isGuest,
        country,
        state,
        city,
        street,
        zip,
        basePrice, hostIdx]
  );

  return updateHostInfoRow;
}

// 호스트 카테고리 수정
async function updateHostCategory(connection, accType, accTypeDetail, typeHouse, isGuest, hostIdx) {
  const updateHostCategoryQuery = `
    update AccommodationCategory
    set 
        accType = ?,
        accTypeDetail = ?,
        typeHouse = ?,
        isGuest = ?
    where hostIdx = ?;
  `;

  const updateHostCategoryRow = await connection.query(
      updateHostCategoryQuery,
      [accType, accTypeDetail, typeHouse, isGuest, hostIdx]
  );

  return updateHostCategoryRow;
}

// 카테고리 인원설정 수정
async function updateCategoryPerson(connection, guestCnt, bedRoomCnt, bedCnt, categoryIdx) {
  const updateCategoryPersonQuery = `
    update AccommodationPersonnel
    set
        guestCnt = ?,
        bedRoomCnt = ?,
        bedCnt = ?
    where categoryIdx = ?;
  `;

  const updateCategoryPersonRow = await connection.query(
      updateCategoryPersonQuery,
      [guestCnt, bedRoomCnt, bedCnt, categoryIdx]
  );

  return updateCategoryPersonRow;
}

// 카테고리 침실유형 설정 수정
async function updateCategoryBedRoom(connection, couchCnt, singleCnt, smallDoubleCnt, doubleCnt, queenCnt, kingCnt, bunkBedCnt, categoryIdx) {
  const updateCategoryBedRoomQuery = `
    update AccommodationBedType
    set couchCnt = ?,
        singleCnt = ?,
        smallDoubleCnt = ?,
        doubleCnt = ?,
        queenCnt = ?,
        kingCnt = ?,
        bunkBedCnt = ?
    where categoryIdx = ?;
  `;

  const updateCategoryBedRoomRow = await connection.query(
      updateCategoryBedRoomQuery,
      [couchCnt, singleCnt, smallDoubleCnt, doubleCnt, queenCnt, kingCnt, bunkBedCnt, categoryIdx]
  );

  return updateCategoryBedRoomRow;
}

// 호스트 위치설정 수정
async function updateHostLocation(connection, country, state, city, street, etc, zip, hostIdx) {
  const updateHostLocationQuery = `
    update AccommodationLocation
    set
        country = ?,
        state = ?,
        city = ?,
        street = ?,
        etc = ?,
        zip = ?
    where hostIdx = ?;
  `;

  const updateHostLocationRow = await connection.query(
      updateHostLocationQuery,
      [country, state, city, street, etc, zip, hostIdx]
  );

  return updateHostLocationRow;
}

// 호스트 편의시설 수정
async function updateHostAmenities(connection, isWifi, isAirConditioning, isHairDryer, isKitchen, isWasher, hostIdx) {
  const updateHostAmenitiesQuery = `
    update AccommodationAmenities
    set
        isWifi = ?,
        isAirConditioning = ?,
        isHairDryer = ?,
        isKitchen = ?,
        isWasher = ?
    where hostIdx = ?;
  `;

  const updateHostAmenitiesRow = await connection.query(
      updateHostAmenitiesQuery,
      [isWifi, isAirConditioning, isHairDryer, isKitchen, isWasher, hostIdx]
  );

  return updateHostAmenitiesRow
}

// 호스트 사진 삭제
async function updateHostPhoto(connection, status, hostIdx, photoIdx) {
  const updateHostPhotoQuery = `
      update AccommodationPhoto
      set 
          status = ?
      where hostIdx = ? and idx = ?;
  `;

  const updateHostPhotoRow = await connection.query(
      updateHostPhotoQuery,
      [status, hostIdx, photoIdx]
  );

  return updateHostPhotoRow;
}

// 호스트 예약 설정 수정
async function updateHostReservation(connection, advanceNotice, isRequest, availabilityWindow, arriveAfter, leaveBefore, minStay, maxStay, isReservationRequest, hostIdx) {
  const updateHostReservationQuery = `
    update ReservationAvailabilitySettingDetail
    set 
        advanceNotice = ?,
        isRequest = ?,
        availabilityWindow = ?,
        arriveAfter = ?,
        leaveBefore = ?,
        minStay = ?,
        maxStay = ?,
        isReservationRequest =?
    where hostIdx = ?;
  `;

  const updateHostReservationRow = await connection.query(
      updateHostReservationQuery,
      [advanceNotice, isRequest, availabilityWindow, arriveAfter, leaveBefore, minStay, maxStay, isReservationRequest, hostIdx]
  );

  return updateHostReservationRow;
}

// 호스트 요금 설정 수정
async function updateHostPrice(connection, basePrice, hostIdx) {
  const updateHostPriceQuery = `
    update AccommodationPrice
    set basePrice = ?
    where hostIdx = ?;
  `;

  const updateHostPriceRow = await connection.query(
    updateHostPriceQuery,
    [basePrice, hostIdx]
  );

  return updateHostPriceRow;
}

// 호스트 상태 수정(삭제)
async function updateHostStatus(connection, status, hostIdx) {
  const updateHostStatusQuery = `
    update Host
    set status = ?
    where idx = ?;
  `;

  const updateHostStatusRow = await connection.query(
      updateHostStatusQuery,
      [status, hostIdx]
  );

  return updateHostStatusRow;
}

// 등록된 카테고리가 있는지 hostIdx로 체크
async function selectCategory(connection, hostIdx) {
  const selectCategoryQuery = `
    select * from AccommodationCategory where hostIdx = ?;
  `;

  const selectCategoryRow = await connection.query(
      selectCategoryQuery,
      hostIdx
  );

  return selectCategoryRow[0];
}

// 등록된 카테고리가 있는지 categoryIdx로 체크
async function selectCategoryIdx(connection, categoryIdx) {
  const selectCategoryIdxQuery = `
    select * from AccommodationCategory where idx = ?;
  `;

  const selectCategoryIdxRow = await connection.query(
      selectCategoryIdxQuery,
      categoryIdx
  );

  return selectCategoryIdxRow[0];
}

// 카테고리에 등록된 인원이 있는지 체크
async function selectCategoryPerson(connection, categoryIdx) {
  const selectCategoryPersonQuery = `
    select * from AccommodationPersonnel where categoryIdx = ?;
  `;

  const selectCategoryPersonRow = await connection.query(
      selectCategoryPersonQuery,
      categoryIdx
  );

  return selectCategoryPersonRow[0];
}

// 카테고리에 등록된 침대 유형 있는지 체크
async function selectCategoryBedRoom(connection, categoryIdx) {
  const selectCategoryBedRoomQuery = `
    select * from AccommodationBedType where categoryIdx = ?;
  `;

  const selectCategoryBedRoomRow = await connection.query(
      selectCategoryBedRoomQuery,
      categoryIdx
  );

  return selectCategoryBedRoomRow[0];
}

// 완료된(ACTIVE) 호스트 체크
async function selectPerfactHost(connection, hostIdx) {
  const selectPerfactHostQuery = `
    select * from Host where idx = ? and status = 'ACTIVE';
  `;

  const selectPerfactHostRow = await connection.query(
      selectPerfactHostQuery,
      hostIdx
  );

  return selectPerfactHostRow[0];
}

// 호스트 등록 체크
async function selectUserHost(connection, hostIdx) {
  const selectUserHostQuery = `
    select * from Host where idx = ? and status = 'ACTIVE';
  `;

  const selectUserHostRow = await connection.query(
    selectUserHostQuery,
    hostIdx
  );

  return selectUserHostRow[0];
}

//
async function selectHostByCategoryCheck(connection, hostIdx, categoryIdx) {
  const selectHostByCategoryCheckQuery = `
    select * from AccommodationCategory where hostIdx = ? and idx = ?;
  `;

  const selectHostByCategoryCheckRow = await connection.query(
      selectHostByCategoryCheckQuery,
      [hostIdx, categoryIdx]
  );

  return selectHostByCategoryCheckRow[0];
}

// 호스트 <- 위치 등록 체크
async function selectHostByLocationCheck(connection, hostIdx) {
  const selectHostByLocationCheckQuery = `
    select * from AccommodationLocation where hostIdx = ?;
  `;

  const selectHostByLocationCheckRow = await connection.query(
      selectHostByLocationCheckQuery,
      [hostIdx]
  );

  return selectHostByLocationCheckRow[0];
}

// 호스트 <- 편의시설 등록 체크
async function selectHostByAmenitiesCheck(connection, hostIdx) {
  const selectHostByAmenitiesCheckQuery = `
    select * from AccommodationAmenities where hostIdx = ?;
  `;

  const selectHostByAmenitiesCheckRow = await connection.query(
      selectHostByAmenitiesCheckQuery,
      [hostIdx]
  );

  return selectHostByAmenitiesCheckRow[0];
}

// 호스트 <- 사진 등록 체크
async function selectHostByPhotoCheck(connection, hostIdx) {
  const selectHostByPhotoCheckQuery = `
    select * from AccommodationPhoto where hostIdx = ?;
  `;

  const selectHostByPhotoCheckRow = await connection.query(
      selectHostByPhotoCheckQuery,
      [hostIdx]
  );

  return selectHostByPhotoCheckRow[0];
};

// 해당 호스트에 해당 사진 여부 체크
async function selectPhotoCheck(connection, photoIdx) {
  const selectPhotoCheckQuery = `
    select * from AccommodationPhoto where idx = ?;
  `;

  const selectPhotoCheckRow = await connection.query(
      selectPhotoCheckQuery,
      [photoIdx]
  );

  return selectPhotoCheckRow[0];
};

// 호스트 <- 예약 설정 등록 체크
async function selectHostByReservationCheck(connection, hostIdx) {
  const selectHostByReservationCheckQuery = `
    select * from ReservationAvailabilitySettingDetail where hostIdx = ?;
  `;

  const selectHostByReservationCheckRow = await connection.query(
    selectHostByReservationCheckQuery,
      [hostIdx]
  );

  return selectHostByReservationCheckRow[0];
}

// 호스트 <- 가격 등록 체크
async function selectHostByPriceCheck(connection, hostIdx) {
  const selectHostByPriceCheckQuery = `
    select * from AccommodationPrice where hostIdx = ?
  `;

  const selectHostByPriceCheckRow = await connection.query(
      selectHostByPriceCheckQuery,
      [hostIdx]
  );

  return selectHostByPriceCheckRow[0];
}

// 호스트 전체 조회
async function selectHostList(connection) {
  const selectHostListQuery = `
      select
            Host.idx as idx,
            Host.userIdx as userIdx,
            Host.hostName as hostName,
            A_PH.hostImg as hostImg,
            accType,
            accTypeDetail,
            typeHouse,
             isGuest,
             country,
             state,
             city,
             street,
             zip,
             basePrice,
            if(isnull((select round(avg(rating), 2) from Review where Review.hostIdx = Host.idx)), 0, (select round(avg(rating), 2) from Review where Review.hostIdx = Host.idx)) as rating,
            (select count(hostIdx) from Review where Review.hostIdx = Host.idx) as reviewCnt
      from Host
               left join AccommodationPhoto A_PH on A_PH.hostIdx = Host.idx
      where Host.status = 'ACTIVE'
      group by Host.idx
  `;

  const [selectHostListRow] = await connection.query(
      selectHostListQuery
  );

  return selectHostListRow
}

// 유저 호스트 조회
async function selectUserHostList (connection, userIdx, hostName) {
  const selectUserHostListQuery = `
    select * from Host where userIdx = ? and hostName = ?;
  `;

  const [selectUserHostListRow] = await connection.query(
      selectUserHostListQuery,
      [userIdx, hostName]
  );

  return selectUserHostListRow
}

// 호스트 지역 조회
async function selectStateHostList(connection, state) {
  const selectStateHostListQuery = `
    select
        Host.idx as idx,
        userIdx as userIdx,
        hostName as hostName,
        A_PH.hostImg as hostImg,
        accType,
        accTypeDetail,
        typeHouse,
        isGuest,
        country,
        state,
        city,
        street,
        zip,
        basePrice,
        if(isnull((select round(avg(rating), 2) from Review where Review.hostIdx = Host.idx)), 0, (select round(avg(rating), 2) from Review where Review.hostIdx = Host.idx)) as rating,
        (select count(hostIdx) from Review where Review.hostIdx = Host.idx) as reviewCnt
      from Host
               left join AccommodationPhoto A_PH on A_PH.hostIdx = Host.idx
      where Host.status = 'ACTIVE' and Host.state = ?
      group by Host.idx
  `;

  const [selectStateHostListRow] = await connection.query(
      selectStateHostListQuery,
      [state]
  );

  return selectStateHostListRow;
}

// 호스트 사진 조회
async function selectHostPhotoList(connection, hostIdx) {
  const selectHostPhotoListQuery = `
    select idx as imgIdx, hostImg as imgPath from AccommodationPhoto where hostIdx = ? and status = 'Y';
  `;

  const [selectHostPhotoListRow] = await connection.query(
      selectHostPhotoListQuery, [hostIdx]
  );

  return selectHostPhotoListRow;
};

// 호스트 카테고리 조회
async function selectHostCategoryList(connection, hostIdx) {
  const selectHostCategoryListQuery = `
    select idx,
           accType,
           accTypeDetail,
           typeHouse,
           isGuest,
           accPersonnelIdx as personnelSetting,
           accBedIdx
    from AccommodationCategory
    where hostIdx = ? and status = 'Y'; 
  `;

  const [selectHostCategoryListRow] = await connection.query(
      selectHostCategoryListQuery,
      hostIdx
  );

  return selectHostCategoryListRow;
};

// 카테고리 인원 조회
async function selectPersonnelList(connection, categoryIdx) {
  const selectPersonnelListQuery = `
    select idx, guestCnt, bedRoomCnt, bedCnt from AccommodationPersonnel where categoryIdx = ?;
  `;

  const [selectPersonnelListRow] = await connection.query(
      selectPersonnelListQuery,
      categoryIdx
  );

  return selectPersonnelListRow
}

// 카테고리 침대유형 조회
async function selectBedRoomList(connection, categoryIdx) {
  const selectBedRoomListQuery = `
    select 
           idx,
           couchCnt,
           singleCnt,
           smallDoubleCnt,
           doubleCnt,
           queenCnt,
           kingCnt,
           bunkBedCnt
           from AccommodationBedType 
    where categoryIdx = ?;
  `;

  const [selectBedRoomListRow] = await connection.query(
      selectBedRoomListQuery,
      categoryIdx
  );

  return selectBedRoomListRow
}

// 호스트 위치 조회
async function selectLocationList(connection, hostIdx) {
  const selectLocationListQuery = `
    select 
        idx,
        country,
        state,
        city,
        street,
        etc,
        zip
    from AccommodationLocation
    where hostIdx = ?;
  `;

  const [selectLocationListRow] = await connection.query(
    selectLocationListQuery,
    hostIdx
  );

  return selectLocationListRow;
}

// 호스트 예약 조회
async function selectReservationList(connection, hostIdx) {
  const selectReservationListQuery = `
    select 
      idx,     
      advanceNotice,
      isRequest,
      availabilityWindow,
      arriveBefore,
      leaveBefore,
      minStay,
      maxStay,
      isStayLonger,
      isReservationRequest
    from ReservationAvailabilitySettingDetail
    where hostIdx = ?;
  `;

  const [selectReservationListRow] = await connection.query(
      selectReservationListQuery,
      hostIdx
  );

  return selectReservationListRow;
}

// 호스트 가격 조회
async function selectPriceList(connection, hostIdx) {
  const selectPriceListQuery = `
    select
      idx,
      basePrice
    from AccommodationPrice
    where hostIdx = ?;
  `;

  const [selectPriceListRow] = await connection.query(
      selectPriceListQuery,
      hostIdx
  );

  return selectPriceListRow;
}

module.exports = {
  insertHost,
  // insertCategory,
  // insertPerson,
  // insertBedRoom,
  // insertHostLocation,
  // insertHostAmenities,
  insertHostPhoto,
  // insertHostReservation,
  // insertHostPrice,
  // updateCategoryByPersonIdx,
  // updateCategoryByBedRoomIdx,
  // updateHostByCategoryIdx,
  // updateHostByLocationIdx,
  // updateHostByAmenitiesIdx,
  // updateHostByReservationIdx,
  // updateHostByPriceIdx,
  updateHostActiveStatus, // 모두 등록시 호스트를 ACTIVE로 바꾸는 로직
  updateHostInfo, // 호스트 정보 수정
  updateHostCategory, // 호스트 카테고리 수정
  updateCategoryPerson, // 카테고리 인원 설정 수정
  updateCategoryBedRoom, // 카테고리 침실 유형 설정 수정
  updateHostLocation, // 호스트 위치설정 수정
  updateHostAmenities, // 호스트 편의시설 수정
  updateHostPhoto, // 호스트 사진 삭제
  updateHostReservation, // 호스트 예약설정 수정
  updateHostPrice, // 호스트 요금설정 수정
  updateHostStatus, // 호스트 상태 수정
  selectCategory,
  selectCategoryIdx,
  selectCategoryPerson,
  selectCategoryBedRoom,
  selectPerfactHost, // Active된 호스트만 조회
  selectUserHost,
  selectHostByCategoryCheck,
  selectHostByLocationCheck,
  selectHostByAmenitiesCheck,
  selectHostByPhotoCheck,  // 호스트 사진 등록 완료 체크
  selectPhotoCheck, // 해당 호스트에 해당 사진 여부 체크
  selectHostByReservationCheck,
  selectHostByPriceCheck,
  selectHostList, // 호스트 전체 조회
  selectUserHostList, // 유저 호스트 조회
  selectStateHostList, // 호스트 지역 조회
  selectHostPhotoList, // 호스트 사진 조회(배열)
  selectHostCategoryList, // 호스트 카테고리 조회(배열)
  selectPersonnelList, // 카테고리 인원 조회(배열)
  selectBedRoomList, // 카테고리 침실유형 조회(배열)
  selectLocationList, // 호스트 위치 조회(배열)
  selectReservationList, // 호스트 예약 조회(배열)
  selectPriceList, // 호스트 가격 조회(배열)

}