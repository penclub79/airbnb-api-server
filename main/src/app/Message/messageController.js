const jwtMiddleware = require("../../../config/jwtMiddleware");
const messageProvider = require("../../app/Message/messageProvider");
const messageService = require("../../app/Message/messageService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const moment = require('moment');

// 메세지 보내기
exports.postUserByMessage = async function (req, res) {
  const googleToken = req.headers['authorization'];
  const googleTokenHeader = req.query.token;
  const userIdxFromJWT = req.verifiedToken.userIdx;
  const userIdx = req.params.userIdx;
  const { roomIdx, message } = req.body;

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
    return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
  } else {

    // 채팅방 빈 값 체크
    if (!roomIdx)
      return res.send(errResponse(baseResponse.SIGNIN_MESSAGE_ROOMIDX_EMPTY));

    // 스트링 체크
    if (isNaN(roomIdx))
      return res.send(errResponse(baseResponse.SIGNIN_MESSAGE_ROOMIDX_ERROR_FORM));

    // 메세지 빈 값 체크
    if (!message)
      return res.send(errResponse(baseResponse.SIGNIN_MESSAGE_EMPTY));

    const signUpMessage = await messageService.sendMessage(
        roomIdx, userIdx, message
    );

    return res.send(signUpMessage);
  }
};

// 유저 메시지 조회
exports.getUserMessage = async function (req, res) {
  const googleToken = req.headers['authorization'];
  const googleTokenHeader = req.query.token;
  const roomIdx = req.query.roomId;

  //유저 빈 값 체크
  if (!roomIdx)
    return res.send(errResponse(baseResponse.SIGNIN_MESSAGE_ROOMIDX_EMPTY));

  // 스트링 체크
  if (isNaN(roomIdx))
    return res.send(errResponse(baseResponse.SIGNIN_MESSAGE_ROOMIDX_ERROR_FORM));

  // 구글 인증
  if (googleTokenHeader) {
    if (!googleToken)
      return res.send(errResponse(baseResponse.TOKEN_GOOGLE_EMPTY));

    if (googleTokenHeader != googleToken)
      return res.send(errResponse(baseResponse.GOOGLE_TOKEN_NOT_EXIST));
  }

  // // 방 여부 체크
  const chatRoomCheck = await messageProvider.selectChatRoomCheck(roomIdx);
  if (chatRoomCheck.length == 0)
    return res.send(errResponse(baseResponse.SIGNUP_MESSAGE_ROOM_EXIST));

  // 대화 조회
  const getUserByMessage = await messageProvider.retrieveUserByMessage(roomIdx);

  return res.send(response(baseResponse.SUCCESS_MESSAGE_SELECT, getUserByMessage));
};

// 유저 메시지 삭제
exports.patchMessageStatus = async function (req, res) {
  const googleToken = req.headers['authorization'];
  const googleTokenHeader = req.query.token;
  const userIdxFromJWT = req.verifiedToken.userIdx;
  const userIdx = req.params.userIdx;
  const messageIdx = req.params.messageIdx;
  const { status } = req.body;

  // 유저 빈 값 체크
  if (!userIdx)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

  // 유저 빈 값 체크
  if (!messageIdx)
    return res.send(errResponse(baseResponse.MESSAGE_ID_NOT_MATCH));

  // 구글 인증
  if (googleTokenHeader) {
    if (!googleToken)
      return res.send(errResponse(baseResponse.TOKEN_GOOGLE_EMPTY));

    if (googleTokenHeader != googleToken)
      return res.send(errResponse(baseResponse.GOOGLE_TOKEN_NOT_EXIST));
  }

  if (userIdxFromJWT != userIdx) {
    return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
  } else {
    if (!status)
      return res.send(errResponse(baseResponse.SIGNUP_MESSAGE_STATUS_EMPTY));

    if (status != 'Y' && status != 'N')
      return res.send(errResponse(baseResponse.SIGNUP_MESSAGE_ERROR_TYPE));

    const patchMessageStatusResult = await messageService.editMessageStatus(
      status, messageIdx
    );

    return res.send(patchMessageStatusResult);
  }
};