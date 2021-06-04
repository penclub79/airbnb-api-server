module.exports = function(app){
  const host = require('./hostController');
  const jwtMiddleware = require('../../../config/jwtMiddleware');

  // 1. 호스트 등록 API
  app.post('/app/hosts/:userIdx', jwtMiddleware, host.postHostByUser);

  // // 2. 호스트 카테고리 등록 API
  // app.post('/app/hosts/:userIdx/:hostIdx/category', jwtMiddleware, host.postHostByCategory);
  //
  // // 2-2. 카테고리 인원 등록 API
  // app.post('/app/hosts/:userIdx/:categoryIdx/persons', jwtMiddleware, host.postCategoryByPerson);
  //
  // // 2-3. 카테고리 침대 유형 등록 API
  // app.post('/app/hosts/:userIdx/:categoryIdx/bedrooms', jwtMiddleware, host.postPersonByBedroom);
  //
  // // 3. 호스트 위치 등록
  // app.post('/app/hosts/:userIdx/:hostIdx/locations', jwtMiddleware, host.postHostByLocation);
  //
  // // 4. 호스트 편의시설 등록
  // app.post('/app/hosts/:userIdx/:hostIdx/amenities', jwtMiddleware, host.postHostByAmenities);

  // 2. 호스트 사진 등록
  app.post('/app/hosts/:userIdx/:hostIdx/photos', jwtMiddleware, host.postHostByPhoto);

  // // 6. 호스트 예약 설정 등록
  // app.post('/app/hosts/:userIdx/:hostIdx/reservations', jwtMiddleware, host.postHostByReservations);
  //
  // // 7. 호스트 요금 등록
  // app.post('/app/hosts/:userIdx/:hostIdx/price', jwtMiddleware, host.postHostByPrice);

  // 호스트 상세 정보 조회
  // app.get('/app/hosts?id=1', jwtMiddleware, host.getUserByHost);

  // 호스트 전체 조회
  app.get('/app/hosts', host.getHostList);

  // 1. 호스트 수정 API
  app.patch('/app/hosts/:userIdx/:hostIdx', jwtMiddleware, host.patchHostInfo);

  // 2. 호스트 상태 변경(삭제) API
  app.patch('/app/hosts/status/:userIdx/:hostIdx', jwtMiddleware, host.patchHostStatus);

  // // 2. 호스트 카테고리 수정 API
  // app.patch('/app/hosts/:userIdx/:hostIdx/category', jwtMiddleware, host.patchHostCategory);
  //
  // // 2-2. 카테고리 인원 수정 API
  // app.patch('/app/hosts/:userIdx/:categoryIdx/persons', jwtMiddleware, host.patchCategoryPerson);
  //
  // // 2-3. 카테고리 침실 유형 수정 API
  // app.patch('/app/hosts/:userIdx/:categoryIdx/bedrooms', jwtMiddleware, host.patchCategoryBedRoom);
  //
  // // 3. 호스트 위치 수정
  // app.patch('/app/hosts/:userIdx/:hostIdx/locations', jwtMiddleware, host.patchHostLocation);
  //
  // // 4. 호스트 편의시설 수정
  // app.patch('/app/hosts/:userIdx/:hostIdx/amenities', jwtMiddleware, host.patchHostAmenities);
  //
  // 5. 호스트 사진 삭제
  app.patch('/app/hosts/photo/status/:userIdx/:hostIdx/:photoIdx', jwtMiddleware, host.patchHostPhoto);
  //
  // // 6. 호스트 예약 설정 수정
  // app.patch('/app/hosts/:userIdx/:hostIdx/reservation', jwtMiddleware, host.patchHostReservation);
  //
  // // 7. 호스트 요금 설정 수정
  // app.patch('/app/hosts/:userIdx/:hostIdx/price', jwtMiddleware, host.patchHostPrice);

};