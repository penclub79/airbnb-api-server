const jwtMiddleware = require("../../../config/jwtMiddleware");
const hostProvider = require("../../app/Host/hostProvider");
const hostService = require("../../app/Host/hostService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

// 호스트 등록
exports.postHostByUser = async function (req, res) {
    const googleToken = req.headers['authorization'];
    const googleTokenHeader = req.query.token;
    const userIdxFromJWT = req.verifiedToken.userIdx;
    const userIdx = req.params.userIdx;
    const {

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
        basePrice

    } = req.body;
    const rexPostNum = /^\d{3}-\d{3}/;

    // 유저 빈 값 체크
    if (!userIdx)
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

    // 구글 인증
    if (googleTokenHeader) {
        if (!googleToken)
            return res.send(errResponse(baseResponse.TOKEN_GOOGLE_EMPTY));

        if (googleTokenHeader != googleToken)
            return res.send(errResponse(baseResponse.GOOGLE_TOKEN_NOT_EXIST));
    }

    if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
    } else {

        // hostName빈 값 체크
        if (!hostName)
            res.send(errResponse(baseResponse.SIGNIN_HOST_NAME_EMPTY));

        // hostName 50자리 미만 체크
        if (!hostName)
            res.send(errResponse(baseResponse.SIGNIN_HOST_NAME_LENGTH));

        // 숙소 타입 빈 값 체크
        if (!accType)
            res.send(errResponse(baseResponse.SIGNIN_CATEGORY_ACCTYPE_EMPTY));

        // 숙소 타입 디테일 빈 값 체크
        if (!accTypeDetail)
            res.send(errResponse(baseResponse.SIGNIN_CATEGORY_ACCTYPEDETAIL_EMPTY));

        // 하우스 타입 빈 값 체크
        if (!typeHouse)
            res.send(errResponse(baseResponse.SIGNIN_CATEGORY_TYPEHOUSE_EMPTY));

        // 게스트 전용 빈 값 체크
        if (!isGuest)
            res.send(errResponse(baseResponse.SIGNIN_CATEGORY_GUEST_EMPTY));

        // 국가 빈 값 체크
        if (!country)
            res.send(errResponse(baseResponse.SIGNIN_HOST_LOCATION_COUNTRY_EMPTY));

        // 도 빈 값 체크
        if (!state)
            res.send(errResponse(baseResponse.SIGNIN_HOST_LOCATION_STATE_EMPTY));

        // 도시 빈 값 체크
        if (!city)
            res.send(errResponse(baseResponse.SIGNIN_HOST_LOCATION_CITY_EMPTY));

        // 도로명 주소 빈 값 체크
        if (!street)
            res.send(errResponse(baseResponse.SIGNIN_HOST_LOCATION_STREET_EMPTY));

        // 우편 번호 빈 값 체크
        if (!zip)
            res.send(errResponse(baseResponse.SIGNIN_HOST_LOCATION_ZIP_EMPTY));

        // 우편 번호 정규식 체크
        if (!rexPostNum.test(zip))
            res.send(errResponse(baseResponse.SIGNIN_HOST_LOCATION_ZIP_ERROR_TYPE));

        // 가격 빈 값 체크
        if (!basePrice)
            res.send(errResponse(baseResponse.SIGNIN_HOST_PRICE_EMPTY));

        // 가격 스트링 체크
        if (isNaN(basePrice))
            res.send(errResponse(baseResponse.SIGNIN_HOST_PRICE_ERROR_FORM));

     const signUpHost = await hostService.createHost(
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
         basePrice
     );
     return res.send(signUpHost);
    }
};

// 카테고리 등록
// exports.postHostByCategory = async function (req, res) {
//     const userIdxFromJWT = req.verifiedToken.userIdx;
//     const userIdx = req.params.userIdx;
//     const hostIdx = req.params.hostIdx;
//     const { accType, accTypeDetail, typeHouse, isGuest } = req.body;
//
//     // 유저 빈 값 체크
//     if (!userIdx)
//         return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
//
//     if (userIdxFromJWT != userIdx) {
//         res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
//     } else {
//
//         // 숙소 타입 빈 값 체크
//         if (!accType)
//             res.send(errResponse(baseResponse.SIGNIN_CATEGORY_ACCTYPE_EMPTY));
//
//         // 숙소 타입 디테일 빈 값 체크
//         if (!accTypeDetail)
//             res.send(errResponse(baseResponse.SIGNIN_CATEGORY_ACCTYPEDETAIL_EMPTY));
//
//         // 하우스 타입 빈 값 체크
//         if (!typeHouse)
//             res.send(errResponse(baseResponse.SIGNIN_CATEGORY_TYPEHOUSE_EMPTY));
//
//         // 게스트 전용 빈 값 체크
//         if (!isGuest)
//             res.send(errResponse(baseResponse.SIGNIN_CATEGORY_GUEST_EMPTY));
//
//         const signUpCategory = await hostService.createCategory(
//             hostIdx, accType, accTypeDetail, typeHouse, isGuest
//         );
//
//         return res.send(signUpCategory);
//     }
// };

// 카테고리 인원 등록
// exports.postCategoryByPerson = async function (req, res) {
//     const userIdxFromJWT = req.verifiedToken.userIdx;
//     const userIdx = req.params.userIdx;
//     const categoryIdx = req.params.categoryIdx;
//     const { guestCnt } = req.body;
//
//     // 유저 빈 값 체크
//     if (!userIdx)
//         return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
//
//     // 카테고리 인덱스 빈 값 체크
//     if (!categoryIdx)
//         res.send(errResponse(baseResponse.SIGNUP_CATEGORY_NOT_REGISTER));
//
//     if (userIdxFromJWT != userIdx) {
//         res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
//     } else {
//         // 숙박 인원 빈 값 체크
//         if (!guestCnt)
//             res.send(errResponse(baseResponse.SIGNIN_CATEGORY_GUESTCNT_EMPTY));
//
//         // 숙박 인원 16미만 체크
//         if (guestCnt > 17)
//             res.send(errResponse(baseResponse.SIGNIN_CATEGORY_GUESTCNT_LENGTH));
//
//         const signUpPerson = await hostService.createPerson(
//             categoryIdx, guestCnt
//         );
//
//         return res.send(signUpPerson);
//     }
// };

// 카테고리 침실 유형 등록
// exports.postPersonByBedroom = async function (req, res) {
//     const userIdxFromJWT = req.verifiedToken.userIdx;
//     const userIdx = req.params.userIdx;
//     const categoryIdx = req.params.categoryIdx;
//     const { couchCnt, singleCnt, smallDoubleCnt, doubleCnt, queenCnt, kingCnt, bunkBedCnt } = req.body;
//
//     // 유저 빈 값 체크
//     if (!userIdx)
//         return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
//
//     // 카테고리 인덱스 빈 값 체크
//     if (!categoryIdx)
//         res.send(errResponse(baseResponse.SIGNUP_CATEGORY_NOT_REGISTER));
//
//     if (userIdxFromJWT != userIdx) {
//         res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
//     } else {
//
//         // 카우치 빈 값 체크
//         if (!couchCnt)
//             res.send(errResponse(baseResponse.SIGNIN_CATEGORY_COUCHCNT_EMPTY));
//         // 카우치 5 미만 체크
//         if (couchCnt > 5)
//             res.send(errResponse(baseResponse.SIGNIN_CATEGORY_COUCHCNT_LENGTH));
//
//         // 싱글 빈 값 체크
//         if (!singleCnt)
//             res.send(errResponse(baseResponse.SIGNIN_CATEGORY_SINGLECNT_EMPTY));
//         // 싱글 5 미만 체크
//         if (singleCnt > 5)
//             res.send(errResponse(baseResponse.SIGNIN_CATEGORY_SINGLECNT_LENGTH));
//
//         // 스몰더블 빈 값 체크
//         if (!smallDoubleCnt)
//             res.send(errResponse(baseResponse.SIGNIN_CATEGORY_SMALLDOUBLEDCNT_EMPTY));
//         // 스몰더블 5 미만 체크
//         if (smallDoubleCnt > 5)
//             res.send(errResponse(baseResponse.SIGNIN_CATEGORY_SMALLDOUBLEDCNT_LENGTH));
//
//         // 더블 빈 값 체크
//         if (!doubleCnt)
//             res.send(errResponse(baseResponse.SIGNIN_CATEGORY_DOUBLECNT_EMPTY));
//         // 더블 5 미만 체크
//         if (doubleCnt > 5)
//             res.send(errResponse(baseResponse.SIGNIN_CATEGORY_DOUBLECNT_LENGTH));
//
//         // 퀸 빈 값 체크
//         if (!queenCnt)
//             res.send(errResponse(baseResponse.SIGNIN_CATEGORY_QUEENCNT_EMPTY));
//         // 퀸 5미만 체크
//         if (queenCnt > 5)
//             res.send(errResponse(baseResponse.SIGNIN_CATEGORY_QUEENCNT_LENGTH));
//
//         // 킹 빈 값 체크
//         if (!kingCnt)
//             res.send(errResponse(baseResponse.SIGNIN_CATEGORY_KINGCNT_EMPTY));
//         // 킹 5미만 체크
//         if (kingCnt > 5)
//             res.send(errResponse(baseResponse.SIGNIN_CATEGORY_KINGCNT_LENGTH));
//
//         // 번크베드 빈 값 체크
//         if (!bunkBedCnt)
//             res.send(errResponse(baseResponse.SIGNIN_CATEGORY_BUNKBEDCNT_EMPTY));
//         // 번크베드 5미만 체크
//         if (bunkBedCnt > 5)
//             res.send(errResponse(baseResponse.SIGNIN_CATEGORY_BUNKBEDCNT_LENGTH));
//
//         const signUpBedType = await hostService.createBedType(
//             categoryIdx, couchCnt, singleCnt, smallDoubleCnt, doubleCnt, queenCnt, kingCnt, bunkBedCnt
//         );
//
//         return res.send(signUpBedType);
//     }
// };

// 호스트 위치 등록
// exports.postHostByLocation = async function (req, res) {
//     const userIdxFromJWT = req.verifiedToken.userIdx;
//     const userIdx = req.params.userIdx;
//     const hostIdx = req.params.hostIdx;
//     const { country, state, city, street, zip } = req.body;
//     const rexPostNum = /^\d{3}-\d{3}/;
//
//     // 유저 빈 값 체크
//     if (!userIdx)
//         return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
//
//     // 호스트 빈 값 체크
//     if (!hostIdx)
//         return res.send(errResponse(baseResponse.HOST_ID_NOT_MATCH));
//
//     if (userIdxFromJWT != userIdx) {
//         res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
//     } else {
//
//         // 국가 빈 값 체크
//         if (!country)
//             res.send(errResponse(baseResponse.SIGNIN_HOST_LOCATION_COUNTRY_EMPTY));
//
//         // 도 빈 값 체크
//         if (!state)
//             res.send(errResponse(baseResponse.SIGNIN_HOST_LOCATION_STATE_EMPTY));
//
//         // 도시 빈 값 체크
//         if (!city)
//             res.send(errResponse(baseResponse.SIGNIN_HOST_LOCATION_CITY_EMPTY));
//
//         // 도로명 주소 빈 값 체크
//         if (!street)
//             res.send(errResponse(baseResponse.SIGNIN_HOST_LOCATION_STREET_EMPTY));
//
//         // 우편 번호 빈 값 체크
//         if (!zip)
//             res.send(errResponse(baseResponse.SIGNIN_HOST_LOCATION_ZIP_EMPTY));
//         // 우편 번호 정규식 체크
//         if (!rexPostNum.test(zip))
//             res.send(errResponse(baseResponse.SIGNIN_HOST_LOCATION_ZIP_ERROR_TYPE))
//
//         const signUpLocation = await hostService.createHostLocation(
//             hostIdx, country, state, city, street, etc, zip
//         );
//
//         return res.send(signUpLocation);
//     }
// };

// // 호스트 편의시설 등록
// exports.postHostByAmenities = async function (req, res) {
//     const userIdxFromJWT = req.verifiedToken.userIdx;
//     const userIdx = req.params.userIdx;
//     const hostIdx = req.params.hostIdx;
//     const { isWifi, isAirConditioning, isHairDryer, isKitchen, isWasher } = req.body;
//
//     // 유저 빈 값 체크
//     if (!userIdx)
//         return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
//
//     // 호스트 빈 값 체크
//     if (!hostIdx)
//         return res.send(errResponse(baseResponse.HOST_ID_NOT_MATCH));
//
//     if (userIdxFromJWT != userIdx) {
//         res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
//     } else {
//
//         // 와이파이 빈 값 체크
//         if (!isWifi)
//             res.send(errResponse(baseResponse.SIGNIN_HOST_AMENITIES_WIFI_EMPTY));
//         // 와이파이 형식 체크
//         if (isWifi != 'Y' && isWifi != 'N')
//             return res.send(response(baseResponse.SIGNIN_HOST_AMENITIES_WIFI_ERROR_TYPE));
//
//         // 에어컨 빈 값 체크
//         if (!isAirConditioning)
//             res.send(errResponse(baseResponse.SIGNIN_HOST_AMENITIES_AIRCONDITIONING_EMPTY));
//         // 에어컨 형식 체크
//         if (isAirConditioning != 'Y' && isAirConditioning != 'N')
//             return res.send(response(baseResponse.SIGNIN_HOST_AMENITIES_AIRCONDITIONING_ERROR_TYPE));
//
//         // 헤어드라이어 빈 값 체크
//         if (!isHairDryer)
//             res.send(errResponse(baseResponse.SIGNIN_HOST_AMENITIES_HAIRDRYER_EMPTY));
//         // 헤어드라이어 형식 체크
//         if (isHairDryer != 'Y' && isHairDryer != 'N')
//             return res.send(response(baseResponse.SIGNIN_HOST_AMENITIES_HAIRDRYER_ERROR_TYPE));
//
//         // 주방 빈 값 체크
//         if (!isKitchen)
//             res.send(errResponse(baseResponse.SIGNIN_HOST_AMENITIES_KITCHEN_EMPTY));
//         // 주방 형식 체크
//         if (isKitchen != 'Y' && isKitchen != 'N')
//             return res.send(response(baseResponse.SIGNIN_HOST_AMENITIES_KITCHEN_ERROR_TYPE));
//
//         // 세탁기 빈 값 체크
//         if (!isWasher)
//             res.send(errResponse(baseResponse.SIGNIN_HOST_AMENITIES_WASHER_EMPTY));
//         // 세탁기 형식 체크
//         if (isWasher != 'Y' && isWasher != 'N')
//             return res.send(response(baseResponse.SIGNIN_HOST_AMENITIES_WASHER_ERROR_TYPE));
//
//         const signUpAmenities = await hostService.createHostAmenities(
//             hostIdx, isWifi, isAirConditioning, isHairDryer, isKitchen, isWasher
//         );
//
//         return res.send(signUpAmenities);
//     }
// }

// 호스트 사진 등록
exports.postHostByPhoto = async function (req, res) {
    const googleToken = req.headers['authorization'];
    const googleTokenHeader = req.query.token;
    const userIdxFromJWT = req.verifiedToken.userIdx;
    const userIdx = req.params.userIdx;
    const hostIdx = req.params.hostIdx;
    const { hostImg } = req.body;

    // 유저 빈 값 체크
    if (!userIdx)
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

    // 호스트 빈 값 체크
    if (!hostIdx)
        return res.send(errResponse(baseResponse.HOST_ID_NOT_MATCH));

    // 구글 인증
    if (googleTokenHeader) {
        if (!googleToken)
            return res.send(errResponse(baseResponse.TOKEN_GOOGLE_EMPTY));

        if (googleTokenHeader != googleToken)
            return res.send(errResponse(baseResponse.GOOGLE_TOKEN_NOT_EXIST));
    }

    if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
    } else {

        // 이미지 빈 값 체크
        if (!hostImg)
            res.send(errResponse(baseResponse.SIGNIN_HOST_IMG_EMPTY));

        const signUpHostPhoto = await hostService.createHostPhoto(
            hostIdx, hostImg
        );

        return res.send(signUpHostPhoto);
    }
}

// // 호스트 예약 설정 등록
// exports.postHostByReservations = async function (req, res) {
//     const userIdxFromJWT = req.verifiedToken.userIdx;
//     const userIdx = req.params.userIdx;
//     const hostIdx = req.params.hostIdx;
//     const { advanceNotice, isRequest, availabilityWindow, arriveAfter, leaveBefore, minStay, maxStay, isReservationRequest } = req.body;
//
//     // 유저 빈 값 체크
//     if (!userIdx)
//         return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
//
//     // 호스트 빈 값 체크
//     if (!hostIdx)
//         return res.send(errResponse(baseResponse.HOST_ID_NOT_MATCH));
//
//     if (userIdxFromJWT != userIdx) {
//         res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
//     } else {
//
//         // 예약마감 기한 빈 값 체크
//         if (!advanceNotice)
//             res.send(errResponse(baseResponse.SIGNIN_HOST_RESERVATION_NOTICE_EMPTY));
//         // 예약마감 기한 형식 체크
//         if (advanceNotice != 'today' && advanceNotice != '1day' && advanceNotice != '2day' && advanceNotice != '3day' && advanceNotice != '7day')
//              res.send(errResponse(baseResponse.SIGNIN_HOST_RESERVATION_NOTICE_ERROR_TYPE));
//
//         // 예약요청 기한 빈 값 체크
//         if (!isRequest)
//             res.send(errResponse(baseResponse.SIGNIN_HOST_RESERVATION_REQ_EMPTY));
//         // 예약요청 기한 형식 체크
//         if (isRequest != 'Y' && isRequest != 'N')
//              res.send(errResponse(baseResponse.SIGNIN_HOST_RESERVATION_REQ_ERROR_TYPE));
//
//         // 예약 가능한 기간여부 빈 값 체크
//         if (!availabilityWindow)
//             res.send(errResponse(baseResponse.SIGNIN_HOST_RESERVATION_AVAILABLITYWINDOW_EMPTY));
//         // 예약 가능한 기간여부 형식 체크
//         if (availabilityWindow != 'all' && availabilityWindow != '12month_ago' && availabilityWindow != '9month_ago' && availabilityWindow != '6month_ago' && availabilityWindow != '3month_ago' && availabilityWindow != 'none')
//             res.send(errResponse(baseResponse.SIGNIN_HOST_RESERVATION_AVAILABLITYWINDOW_ERROR_TYPE));
//
//         // 시각 후 체크인 빈 값 체크
//         if (!arriveAfter)
//             res.send(errResponse(baseResponse.SIGNIN_HOST_RESERVATION_ARRIVEAFTER_EMPTY));
//         // 시각 후 체크인 형식 체크
//         if (arriveAfter != 'adjustment' && arriveAfter < 8 && 24 < arriveAfter && arriveAfter != 'nextday')
//             res.send(errResponse(baseResponse.SIGNIN_HOST_RESERVATION_ARRIVEAFTER_ERROR_TYPE));
//
//         // 시각 전 체크아웃 빈 값 체크
//         if (!leaveBefore)
//             res.send(errResponse(baseResponse.SIGNIN_HOST_RESERVATION_LEAVEBEFORE_EMPTY));
//         // 시각 전 체크아웃 형식 체크
//         if (leaveBefore < 12 && leaveBefore > 21)
//             res.send(errResponse(baseResponse.SIGNIN_HOST_RESERVATION_LEAVEBEFORE_ERROR_TYPE));
//
//         // 최소 숙박 빈 값 체크
//         if (!minStay)
//             res.send(errResponse(baseResponse.SIGNIN_HOST_RESERVATION_MINSTAY_EMPTY));
//         // 최소 숙박 스트링 체크
//         if (isNaN(minStay))
//             res.send(errResponse(baseResponse.SIGNIN_HOST_RESERVATION_MINSTAY_ERROR_FORM));
//
//         // 최대 숙박 빈 값 체크
//         if (!maxStay)
//             res.send(errResponse(baseResponse.SIGNIN_HOST_RESERVATION_MAXSTAY_EMPTY));
//         // 최대 숙박 스트링 체크
//         if (isNaN(maxStay))
//             res.send(errResponse(baseResponse.SIGNIN_HOST_RESERVATION_MAXSTAY_ERROR_FORM));
//
//         // 예약요청 허용 여부 빈 값 체크
//         if (!isReservationRequest)
//             res.send(errResponse(baseResponse.SIGNIN_HOST_RESERVATION_RESERVATIONREQ_EMPTY));
//         // 예약요청 타입 체크
//         if (isReservationRequest != 'Y' && isReservationRequest != 'N')
//              res.send(errResponse(baseResponse.SIGNIN_HOST_RESERVATION_RESERVATIONREQ_ERROR_TYPE));
//
//
//         const signUpHostReservations = await hostService.createHostReservations(
//             hostIdx, advanceNotice, isRequest, availabilityWindow, arriveAfter, leaveBefore, minStay, maxStay, isReservationRequest
//         );
//
//         return res.send(signUpHostReservations);
//     }
// };

// 호스트 요금 등록
// exports.postHostByPrice = async function (req, res) {
//     const userIdxFromJWT = req.verifiedToken.userIdx;
//     const userIdx = req.params.userIdx;
//     const hostIdx = req.params.hostIdx;
//     const { basePrice } = req.body;
//
//     // 유저 빈 값 체크
//     if (!userIdx)
//         return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
//
//     // 호스트 빈 값 체크
//     if (!hostIdx)
//         return res.send(errResponse(baseResponse.HOST_ID_NOT_MATCH));
//
//     if (userIdxFromJWT != userIdx) {
//         res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
//     } else {
//         // 가격 빈 값 체크
//         if (!basePrice)
//             res.send(errResponse(baseResponse.SIGNIN_HOST_PRICE_EMPTY));
//         // 가격 스트링 체크
//         if (isNaN(basePrice))
//             res.send(errResponse(baseResponse.SIGNIN_HOST_PRICE_ERROR_FORM));
//
//         const signUpHostPrice = await hostService.createHostPrice(
//             hostIdx, basePrice
//         );
//
//         return res.send(signUpHostPrice);
//     }
// };

// 호스트 상세 정보 조회
exports.getHostList = async function (req, res) {
    const state = req.query.state;

    if (!state) {
        // 호스트 전체 조회

        const hostListResult = await hostProvider.retrieveHostList();
        for (i = 0; i < hostListResult.length; i++) {
            // 호스트의 사진 조회
            hostListResult[i].hostImg = await hostProvider.retrieveHostPhoto(hostListResult[i].idx);
            if (hostListResult[i].hostImg.length == 0) {
                hostListResult[i].hostImg = null;
            }

            // 호스트의 카테고리 조회
            // hostListResult[i].category = await hostProvider.retrieveHostCategory(hostListResult[i].idx);
            //
            // for (j = 0; j < hostListResult[i].category.length; j++) {
            //     // 카테고리의 인원 조회
            //     hostListResult[i].category[j].personnelSetting = await hostProvider.retrievePersonnel(hostListResult[i].category[j].idx)
            //     if (hostListResult[i].category[j].personnelSetting.length == 0) {
            //         hostListResult[i].category[j].personnelSetting = null;
            //     }
            //     // 카테고리의 침실유형 조회
            //     hostListResult[i].category[j].accBedIdx = await hostProvider.retrieveBedroomType(hostListResult[i].category[j].idx)
            //     if (hostListResult[i].category[j].accBedIdx.length == 0) {
            //         hostListResult[i].category[j].accBedIdx = null;
            //     }
            // }
            //
            // // 호스트의 위치 조회
            // hostListResult[i].location = await hostProvider.retrieveHostLocation(hostListResult[i].idx);
            //
            // // 호스트의 예약 조회
            // hostListResult[i].reservation = await hostProvider.retrieveHostReservation(hostListResult[i].idx);
            //
            // // 호스트의 가격 조회
            // hostListResult[i].price = await hostProvider.retrieveHostPrice(hostListResult[i].idx);
        }

        return res.send(
            response(baseResponse.SUCCESS_HOST_LIST, hostListResult));

    } else {

        // 지역 호스트 조회
        const stateHostListResult = await hostProvider.retrieveStateHostList(state);

        // 검색 결과 빈 값 체크
        if (stateHostListResult.length == 0)
            return res.send(errResponse(baseResponse.SEARCH_HOST_STATE_EMPTY));

        for (i = 0; i < stateHostListResult.length; i++) {
            // 호스트의 사진 조회
            stateHostListResult[i].hostImg = await hostProvider.retrieveHostPhoto(stateHostListResult[i].idx);
            if (stateHostListResult[i].hostImg.length == 0) {
                stateHostListResult[i].hostImg = null;
            }

            // // 호스트의 카테고리 조회
            // stateHostListResult[i].category = await hostProvider.retrieveHostCategory(stateHostListResult[i].idx);
            //
            // for (j = 0; j < stateHostListResult[i].category.length; j++) {
            //     // 카테고리의 인원 조회
            //     stateHostListResult[i].category[j].personnelSetting = await hostProvider.retrievePersonnel(stateHostListResult[i].category[j].idx)
            //     if (stateHostListResult[i].category[j].personnelSetting.length == 0) {
            //         stateHostListResult[i].category[j].personnelSetting = null;
            //     }
            //     // 카테고리의 침실유형 조회
            //     stateHostListResult[i].category[j].accBedIdx = await hostProvider.retrieveBedroomType(
            //         stateHostListResult[i].category[j].idx)
            //     if (stateHostListResult[i].category[j].accBedIdx.length == 0) {
            //         stateHostListResult[i].category[j].accBedIdx = null;
            //     }
            // }

            // 호스트의 위치 조회
            // stateHostListResult[i].location = await hostProvider.retrieveHostLocation(stateHostListResult[i].idx);
            //
            // // 호스트의 예약 조회
            // stateHostListResult[i].reservation = await hostProvider.retrieveHostReservation(stateHostListResult[i].idx);
            //
            // // 호스트의 가격 조회
            // stateHostListResult[i].price = await hostProvider.retrieveHostPrice(stateHostListResult[i].idx);

            return res.send(response(baseResponse.SUCCESS_HOST_STATE_LIST, stateHostListResult));
        }
    }
};

// 호스트 정보 수정
exports.patchHostInfo = async function (req, res) {
    const googleToken = req.headers['authorization'];
    const googleTokenHeader = req.query.token;
    const userIdxFromJWT = req.verifiedToken.userIdx;
    const userIdx = req.params.userIdx;
    const hostIdx = req.params.hostIdx;
    let {
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
        basePrice } = req.body;
    const rexPostNum = /^\d{3}-\d{3}/;

    // 유저 빈 값 체크
    if (!userIdx)
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

    // 호스트 빈 값 체크
    if (!hostIdx)
        return res.send(errResponse(baseResponse.HOST_ID_NOT_MATCH));

    // 구글 인증
    if (googleTokenHeader) {
        if (!googleToken)
            return res.send(errResponse(baseResponse.TOKEN_GOOGLE_EMPTY));

        if (googleTokenHeader != googleToken)
            return res.send(errResponse(baseResponse.GOOGLE_TOKEN_NOT_EXIST));
    }

    if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
    } else {

        // 해당 호스트 조회
        const onlyHostResult = await hostProvider.perfactHostCheck(hostIdx);

        // hostName빈 값 체크
        if (!hostName)
            res.send(errResponse(baseResponse.SIGNIN_HOST_NAME_EMPTY));

        // hostName 50자리 미만 체크
        if (!hostName)
            res.send(errResponse(baseResponse.SIGNIN_HOST_NAME_LENGTH));

        // 숙소 타입 빈 값 체크
        if (!accType)
            accType = onlyHostResult[0].accType;

        // 숙소 타입 디테일 빈 값 체크
        if (!accTypeDetail)
            accTypeDetail = onlyHostResult[0].accTypeDetail;

        // 하우스 타입 빈 값 체크
        if (!typeHouse)
            typeHouse = onlyHostResult[0].typeHouse;

        // 게스트 전용 빈 값 체크
        if (!isGuest)
            isGuest = onlyHostResult[0].isGuest;

        // 게스트 전용 빈 값 체크
        if (isGuest != 'Y' && isGuest != 'N')
            res.send(errResponse(baseResponse.SIGNIN_CATEGORY_GUEST_ERROR_TYPE));

        // 국가 빈 값 체크
        if (!country)
            country = onlyHostResult[0].country;

        // 도 빈 값 체크
        if (!state)
            state = onlyHostResult[0].state;

        // 도시 빈 값 체크
        if (!city)
            city = onlyHostResult[0].city;

        // 도로명 주소 빈 값 체크
        if (!street)
            street = onlyHostResult[0].street;

        // 우편 번호 빈 값 체크
        if (!zip)
            zip = onlyHostResult[0].zip;

        // 요금 빈 값 체크
        if (!basePrice)
            basePrice = onlyHostResult[0].basePrice;

        // 우편 번호 정규식 체크
        if (!rexPostNum.test(zip))
            res.send(errResponse(baseResponse.SIGNIN_HOST_LOCATION_ZIP_ERROR_TYPE));

        // 가격 스트링 체크
        if (isNaN(basePrice))
            res.send(errResponse(baseResponse.SIGNIN_HOST_PRICE_ERROR_FORM));

        const patchHostInfoResult = await hostService.editHostInfo(
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
            basePrice, hostIdx
        );

        return res.send(patchHostInfoResult);
    }
};

// 호스트 카테고리 수정
// exports.patchHostCategory = async function (req, res) {
//     const userIdxFromJWT = req.verifiedToken.userIdx;
//     const userIdx = req.params.userIdx;
//     const hostIdx = req.params.hostIdx;
//     const { accType, accTypeDetail, typeHouse, isGuest } = req.body;
//
//     // 유저 빈 값 체크
//     if (!userIdx)
//         return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
//
//     // 호스트 빈 값 체크
//     if (!hostIdx)
//         return res.send(errResponse(baseResponse.HOST_ID_NOT_MATCH));
//
//     if (userIdxFromJWT != userIdx) {
//         res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
//     } else {
//
//         // hostName빈 값 체크
//         // if (!hostName)
//         //     res.send(errResponse(baseResponse.));
//
//         // hostName 50자리 미만 체크
//         // if (!hostName)
//         //     res.send(errResponse(baseResponse.));
//
//         const patchHostCategoryResult = await hostService.editHostCategory(
//             accType, accTypeDetail, typeHouse, isGuest, hostIdx
//         );
//
//         return res.send(patchHostCategoryResult);
//     }
// };

// 카테고리 인원 수정
// exports.patchCategoryPerson = async function (req, res) {
//     const userIdxFromJWT = req.verifiedToken.userIdx;
//     const userIdx = req.params.userIdx;
//     const categoryIdx = req.params.categoryIdx;
//     const { guestCnt, bedRoomCnt, bedCnt } = req.body;
//
//     // 유저 빈 값 체크
//     if (!userIdx)
//         return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
//
//     // 호스트 빈 값 체크
//     if (!categoryIdx)
//         return res.send(errResponse(baseResponse.HOST_ID_NOT_MATCH));
//
//     if (userIdxFromJWT != userIdx) {
//         res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
//     } else {
//
//         const patchCategoryPersonResult = await hostService.editCategoryPerson(
//             guestCnt, bedRoomCnt, bedCnt, categoryIdx
//         );
//
//         return res.send(patchCategoryPersonResult);
//     }
// };

// 카테고리 침실 유형 수정
// exports.patchCategoryBedRoom = async function (req, res) {
//     const userIdxFromJWT = req.verifiedToken.userIdx;
//     const userIdx = req.params.userIdx;
//     const categoryIdx = req.params.categoryIdx;
//     const { couchCnt, singleCnt, smallDoubleCnt, doubleCnt, queenCnt, kingCnt, bunkBedCnt } = req.body;
//
//     // 유저 빈 값 체크
//     if (!userIdx)
//         return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
//
//     // 호스트 빈 값 체크
//     if (!categoryIdx)
//         return res.send(errResponse(baseResponse.HOST_ID_NOT_MATCH));
//
//     if (userIdxFromJWT != userIdx) {
//         res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
//     } else {
//
//         const patchCategoryBedRoomResult = await hostService.editCategoryBedRoom(
//             couchCnt, singleCnt, smallDoubleCnt, doubleCnt, queenCnt, kingCnt, bunkBedCnt, categoryIdx
//         );
//
//         return res.send(patchCategoryBedRoomResult);
//     }
// };

// 호스트 위치 수정
// exports.patchHostLocation = async function (req, res) {
//     const userIdxFromJWT = req.verifiedToken.userIdx;
//     const userIdx = req.params.userIdx;
//     const hostIdx = req.params.hostIdx;
//     const { country, state, city, street, etc, zip } = req.body;
//
//     // 유저 빈 값 체크
//     if (!userIdx)
//         return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
//
//     // 호스트 빈 값 체크
//     if (!hostIdx)
//         return res.send(errResponse(baseResponse.HOST_ID_NOT_MATCH));
//
//     if (userIdxFromJWT != userIdx) {
//         res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
//     } else {
//
//         const patchHostLocationResult = await hostService.editHostLocation(
//             country, state, city, street, etc, zip, hostIdx
//         );
//
//         return res.send(patchHostLocationResult);
//     }
// };

// 호스트 편의시설 수정
// exports.patchHostAmenities = async function (req, res) {
//     const userIdxFromJWT = req.verifiedToken.userIdx;
//     const userIdx = req.params.userIdx;
//     const hostIdx = req.params.hostIdx;
//     const { isWifi, isAirConditioning, isHairDryer, isKitchen, isWasher } = req.body;
//
//     // 유저 빈 값 체크
//     if (!userIdx)
//         return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
//
//     // 호스트 빈 값 체크
//     if (!hostIdx)
//         return res.send(errResponse(baseResponse.HOST_ID_NOT_MATCH));
//
//     if (userIdxFromJWT != userIdx) {
//         res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
//     } else {
//
//         const patchHostAmenitiesResult = await hostService.editHostAmenities(
//             isWifi, isAirConditioning, isHairDryer, isKitchen, isWasher, hostIdx
//         );
//
//         return res.send(patchHostAmenitiesResult);
//     }
// };

// 호스트 사진 삭제
exports.patchHostPhoto = async function (req, res) {
    const googleToken = req.headers['authorization'];
    const googleTokenHeader = req.query.token;
    const userIdxFromJWT = req.verifiedToken.userIdx;
    const userIdx = req.params.userIdx;
    const hostIdx = req.params.hostIdx;
    const photoIdx = req.params.photoIdx;
    const { status }  = req.body;

    // 유저 빈 값 체크
    if (!userIdx)
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

    // 호스트 빈 값 체크
    if (!hostIdx)
        return res.send(errResponse(baseResponse.HOST_ID_NOT_MATCH));

    // 사진 빈 값 체크
    if (!photoIdx)
        return res.send(errResponse(baseResponse.PHOTO_ID_NOT_MATCH));

    // 구글 인증
    if (googleTokenHeader) {
        if (!googleToken)
            return res.send(errResponse(baseResponse.TOKEN_GOOGLE_EMPTY));

        if (googleTokenHeader != googleToken)
            return res.send(errResponse(baseResponse.GOOGLE_TOKEN_NOT_EXIST));
    }

    if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
    } else {
        // 상태 값 빈값 체크
        if (!status)
            return res.send(errResponse(baseResponse.SIGNUP_PHOTO_STATUS_EMPTY));

        if (status != 'N')
            return res.send(errResponse(baseResponse.SIGNUP_PHOTO_ERROR_TYPE));

        const patchHostPhotoResult = await hostService.editHostPhoto(
            status, hostIdx, photoIdx
        );

        return res.send(patchHostPhotoResult);
    }
};

// 호스트 예약 설정 수정
// exports.patchHostReservation = async function (req, res) {
//     const userIdxFromJWT = req.verifiedToken.userIdx;
//     const userIdx = req.params.userIdx;
//     const hostIdx = req.params.hostIdx;
//     const { advanceNotice, isRequest, availabilityWindow, arriveAfter, leaveBefore, minStay, maxStay, isReservationRequest } = req.body;
//
//     // 유저 빈 값 체크
//     if (!userIdx)
//         return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
//
//     // 호스트 빈 값 체크
//     if (!hostIdx)
//         return res.send(errResponse(baseResponse.HOST_ID_NOT_MATCH));
//
//     if (userIdxFromJWT != userIdx) {
//         res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
//     } else {
//
//         const patchHostReservationResult = await hostService.editHostReservation(
//             advanceNotice, isRequest, availabilityWindow, arriveAfter, leaveBefore, minStay, maxStay, isReservationRequest, hostIdx
//         );
//
//         return res.send(patchHostReservationResult);
//     }
// };

// 호스트 요금 설정 수정
// exports.patchHostPrice = async function (req, res) {
//     const userIdxFromJWT = req.verifiedToken.userIdx;
//     const userIdx = req.params.userIdx;
//     const hostIdx = req.params.hostIdx;
//     const { basePrice } = req.body;
//
//     // 유저 빈 값 체크
//     if (!userIdx)
//         return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
//
//     // 호스트 빈 값 체크
//     if (!hostIdx)
//         return res.send(errResponse(baseResponse.HOST_ID_NOT_MATCH));
//
//     if (userIdxFromJWT != userIdx) {
//         res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
//     } else {
//
//         const patchHostPriceResult = await hostService.editHostPrice(
//             basePrice, hostIdx
//         );
//
//         return res.send(patchHostPriceResult);
//     }
// };

// 호스트 상태 설정(삭제)
exports.patchHostStatus = async function (req, res) {
    const googleToken = req.headers['authorization'];
    const googleTokenHeader = req.query.token;
    const userIdxFromJWT = req.verifiedToken.userIdx;
    const userIdx = req.params.userIdx;
    const hostIdx = req.params.hostIdx;
    const { status } = req.body;
    // 유저 빈 값 체크
    if (!userIdx)
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

    // 호스트 빈 값 체크
    if (!hostIdx)
        return res.send(errResponse(baseResponse.HOST_ID_NOT_MATCH));

    // 구글 인증
    if (googleTokenHeader) {
        if (!googleToken)
            return res.send(errResponse(baseResponse.TOKEN_GOOGLE_EMPTY));

        if (googleTokenHeader != googleToken)
            return res.send(errResponse(baseResponse.GOOGLE_TOKEN_NOT_EXIST));
    }

    if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
    } else {

        if (!status)
            return res.send(errResponse(baseResponse.SIGNUP_HOST_STATUS_EMPTY));

        if (status != 'Y' && status != 'N')
            return res.send(errResponse(baseResponse.SIGNUP_HOST_STATUS_ERROR_TYPE));

        const patchHostStatusResult = await hostService.editHostStatus(
            status, hostIdx
        );

        return res.send(patchHostStatusResult);
    }
};