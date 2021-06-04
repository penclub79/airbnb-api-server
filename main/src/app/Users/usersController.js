const jwtMiddleware = require("../../../config/jwtMiddleware");
const usersProvider = require("../../app/Users/usersProvider");
const usersService = require("../../app/Users/usersService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");

exports.postUsers = async function (req, res) {
  const {firstName, secondName, birth, email, phone, password} = req.body;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
  const birthRegex = /^(19[0-9][0-9]|20\\d{2})-(0[0-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
  const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/;

  // 폰을 입력 안했을 때, 이메일로 회원가입
  if (!phone && email) {

    // 성 빈 값 체크
    if (!firstName)
      return res.send(response(baseResponse.SIGNUP_FIRSTNAME_EMPTY));

    // 성 길이 체크
    if (firstName.length > 30)
      return res.send(response(baseResponse.SIGNUP_FIRSTNAME_LENGTH));

    // 이름 빈 값 체크
    if (!secondName)
      return res.send(response(baseResponse.SIGNUP_SECONDNAME_EMPTY));

    // 이름 길이 체크
    if (secondName.length > 40)
      return res.send(response(baseResponse.SIGNUP_SECONDNAME_LENGTH));

    // 생일 빈 값 체크
    if (!birth)
      return res.send(response(baseResponse.SIGNUP_BIRTH_EMPTY));

    // 생년월일 형식 체크
    if (!birthRegex.test(birth))
      return res.send(response(baseResponse.SIGNUP_BIRTH_ERROR_TYPE));

    // 이메일 빈 값 체크
    if (!email)
      return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));

    // 길이 체크
    if (email.length > 30)
      return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email))
      return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    // 패스워드 빈 값 체크
    if (!password)
      return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));

    // 패스워드 길이 체크
    if (password.length < 8)
      return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));

    // 패스워드 형식 체크
    if (!passwordRegex.test(password))
      return res.send(response(baseResponse.SIGNUP_PASSWORD_ERROR_TYPE));

    const signUpResponse = await usersService.createUserEmail(
        firstName,
        secondName,
        birth,
        email,
        password
    );

    return res.send(signUpResponse);

  } else {
    // 성 빈 값 체크
    if (!firstName)
      return res.send(response(baseResponse.SIGNUP_FIRSTNAME_EMPTY));

    // 성 길이 체크
    if (firstName.length > 30)
      return res.send(response(baseResponse.SIGNUP_FIRSTNAME_LENGTH));

    // 이름 빈 값 체크
    if (!secondName)
      return res.send(response(baseResponse.SIGNUP_SECONDNAME_EMPTY));

    // 이름 길이 체크
    if (secondName.length > 40)
      return res.send(response(baseResponse.SIGNUP_SECONDNAME_LENGTH));

    // 생일 빈 값 체크
    if (!birth)
      return res.send(response(baseResponse.SIGNUP_BIRTH_EMPTY));

    // 생년월일 형식 체크
    if (!birthRegex.test(birth))
      return res.send(response(baseResponse.SIGNUP_BIRTH_ERROR_TYPE));

    // 휴대폰 빈 값 체크
    if (!phone)
      return res.send(response(baseResponse.SIGNUP_PHONE_EMPTY));

    // 휴대폰 길이 체크
    if (phone.length > 20)
      return res.send(response(baseResponse.SIGNUP_PHONE_LENGTH));

    // 형식 체크 (by 정규표현식)
    if (!phoneRegex.test(phone))
      return res.send(response(baseResponse.SIGNUP_PHONE_ERROR_TYPE));

    // 패스워드 빈 값 체크
    if (!password)
      return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));

    // 패스워드 길이 체크
    if (password.length < 8)
      return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));

    // 패스워드 형식 체크
    if (!passwordRegex.test(password))
      return res.send(response(baseResponse.SIGNUP_PASSWORD_ERROR_TYPE));

    const signUpResponse = await usersService.createUserPhone(
        firstName,
        secondName,
        birth,
        phone,
        password
    );

    return res.send(signUpResponse);
  }
};

exports.login = async function (req, res) {

  const { email, phone, password } = req.body;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
  const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/;
  // TODO: email, password 형식적 Validation


  if (!email && phone) { // 폰 번호만 입력시

    // 휴대폰 빈 값 체크
    if (!phone)
      return res.send(response(baseResponse.SIGNIN_PHONE_EMPTY));

    // 형식 체크 (by 정규표현식)
    if (!phoneRegex.test(phone))
      return res.send(response(baseResponse.SIGNIN_PHONE_ERROR_TYPE));

    // 패스워드 빈 값 체크
    if (!password)
      return res.send(response(baseResponse.SIGNIN_PASSWORD_EMPTY));

    // 패스워드 형식 체크
    if (!passwordRegex.test(password))
      return res.send(response(baseResponse.SIGNIN_PASSWORD_ERROR_TYPE));

    const phoneSignInResponse = await usersService.postPhoneSignIn(phone, password);

    return res.send(phoneSignInResponse);
  } else {

    // 이메일 빈 값 체크
    if (!email)
      return res.send(response(baseResponse.SIGNIN_EMAIL_EMPTY));

    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email))
      return res.send(response(baseResponse.SIGNIN_EMAIL_ERROR_TYPE));

    // 패스워드 빈 값 체크
    if (!password)
      return res.send(response(baseResponse.SIGNIN_PASSWORD_EMPTY));

    // 패스워드 형식 체크
    if (!passwordRegex.test(password))
      return res.send(response(baseResponse.SIGNIN_PASSWORD_ERROR_TYPE));

    const mailSignInResponse = await usersService.postEmailSignIn(email, password);

    return res.send(mailSignInResponse);
  }
};

// 유저 조회
exports.getUsers = async function (req, res) {
  const userListResult = await usersProvider.retrieveUserList();

  return res.send(response(baseResponse.SUCCESS_SELECT_USER, userListResult));
};

// 유저 정보 수정
exports.patchUsers = async function (req, res) {
  const googleToken = req.headers['authorization'];
  const googleTokenHeader = req.query.token;
  const userEmailFromJWT = req.verifiedToken.userIdx;
  const userIdx = req.params.userIdx;
  const { profileImg, firstName, secondName, gender, birth, email, phone } = req.body;
  const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/;

  // 유저 빈 값 체크
  if (!userIdx)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

  // 구글 인증
  if (googleTokenHeader) {

    if (!googleToken)
      return res.send(errResponse(baseResponse.TOKEN_GOOGLE_EMPTY));

    if (!googleTokenHeader)
      return res.send(errResponse(baseResponse.TOKEN_GOOGLE_PARAMS_EMPTY));

    if (googleTokenHeader != googleToken)
      return res.send(errResponse(baseResponse.GOOGLE_TOKEN_NOT_EXIST));
  }

  if (userEmailFromJWT != userIdx) {
    res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
  } else {

    // 성 빈 값 체크
    if (!firstName)
      return res.send(response(baseResponse.SIGNUP_FIRSTNAME_EMPTY));

    // 성 길이 체크
    if (firstName.length > 30)
      return res.send(response(baseResponse.SIGNUP_FIRSTNAME_LENGTH));

    // 이름 빈 값 체크
    if (!secondName)
      return res.send(response(baseResponse.SIGNUP_SECONDNAME_EMPTY));

    // 이름 길이 체크
    if (secondName.length > 40)
      return res.send(response(baseResponse.SIGNUP_SECONDNAME_LENGTH));

    // 성별 빈 값 체크
    if (!gender)
      return res.send(response(baseResponse.SIGNUP_GENDER_EMPTY));

    // 성별 형식 체크
    if (gender != 'M' && gender != 'W')
      return res.send(response(baseResponse.SIGNUP_GENDER_ERROR_TYPE));

    // 이메일 길이 체크
    if (email.length > 30)
      return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

    // 이메일 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email))
      return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    // 전화번호 포맷 체크
    if (!phoneRegex.test(phone))
      return res.send(response(baseResponse.SIGNUP_PHONE_ERROR_TYPE));

    const editUserInfo = await usersService.editUserInfo(profileImg ,firstName, secondName, gender, birth, email, phone, userIdx);

    return res.send(editUserInfo);
  }
};

// 유저 상태 수정
exports.patchUsersStatus = async function (req, res) {
  const googleToken = req.headers['authorization'];
  const googleTokenHeader = req.query.token;
  const userEmailFromJWT = req.verifiedToken.userIdx;
  const userIdx = req.params.userIdx;
  const {status} = req.body;

  // 유저 빈 값 체크
  if (!userIdx)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

  // 상태 값 빈값 체크
  if (!status)
    return res.send(errResponse(baseResponse.SIGNUP_STATUS_EMPTY));

  // 구글 인증
  if (googleTokenHeader) {
    if (!googleToken)
      return res.send(errResponse(baseResponse.TOKEN_GOOGLE_EMPTY));

    if (googleTokenHeader != googleToken)
      return res.send(errResponse(baseResponse.GOOGLE_TOKEN_NOT_EXIST));
  }

  // 유저 토큰 값 체크
  if (userEmailFromJWT != userIdx) {
    res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
  } else {
    if (status != 'LOCK' && status != 'DELETE' && status != 'ACTIVE')
      return res.send(errResponse(baseResponse.SIGNUP_STATUS_ERROR_TYPE));

    const editStatus = await usersService.editStatus(status, userIdx);

    return res.send(editStatus);
  }
};

/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
  const userEmailResult = req.verifiedToken.email;
  console.log(userEmailResult);
  return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
