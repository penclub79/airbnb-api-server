const jwtMiddleware = require("../../../config/jwtMiddleware");
const noticeProvider = require("../../app/Notice/noticeProvider");
const noticeService = require("../../app/Notice/noticeService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");


// var message = new gcm.Message({
//   collapseKey: 'demo',
//   delayWhileIdle: true,
//   timeToLive: 3,
//   data: {
//     lecture_id: "notice",
//     title:"test",
//     desc:"ddddd",
//
//   }
// })

// 알림 등록
exports.postUserByAlarm = async function (req, res) {
  const { userIdx, noticeMessage } = req.body;

  // 유저 빈 값 체크
  if (!userIdx)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

  if (!noticeMessage)
    return res.send(errResponse(baseResponse.SIGNIN_NOTICE_MESSAGE_EMPTY));

  const signUpNotice = await noticeService.createNotice(
      userIdx, noticeMessage
  );

  return res.send(signUpNotice);
};

// 유저 알림 조회
exports.getUserNotice = async function (req, res) {
  const userIdx = req.query.id;

  // 유저 빈 값 체크
  if (!userIdx)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

  const userNoticeResult = await noticeProvider.retieveUserNotice(userIdx);
  if (userNoticeResult.length == 0) {
    userNoticeResult[0] = null;
  }


  return res.send(
      response(baseResponse.SUCCESS_NOTICE_USER_SELECT, userNoticeResult));
};

// 알림 삭제
exports.patchNoticeStatus = async function (req, res) {
  const googleToken = req.headers['authorization'];
  const googleTokenHeader = req.query.token;
  const userIdxFromJWT = req.verifiedToken.userIdx;
  const userIdx = req.params.userIdx;
  const noticeIdx = req.params.noticeIdx;
  const { status } = req.body;

  // 유저 빈 값 체크
  if (!userIdx)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

  if (!noticeIdx)
    return res.send(errResponse(baseResponse.NOTICE_ID_NOT_MATCH));

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
      return res.send(errResponse(baseResponse.SIGNUP_NOTICE_STATUS_EMPTY));

    if (status != 'Y' && status != 'N')
      return res.send(errResponse(baseResponse.SIGNUP_NOTICE_STATUS_ERROR_TYPE));

    const patchNoticeResult = await noticeService.editNoticeStatus(
        status, noticeIdx
    );

    return res.send(patchNoticeResult);
  }
};