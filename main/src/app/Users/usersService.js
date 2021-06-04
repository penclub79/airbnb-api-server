const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const usersProvider = require("./usersProvider");
const usersDao = require("./usersDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// {
//   email :<- 화면 입력 값
//   password :<- 제이비가 코드로 넣는것
// }

exports.createUserEmail = async function (firstName, secondName, birth, email, password) {
  try {
    // 이메일 중복 확인
    const emailRows = await usersProvider.emailCheck(email);
    if (emailRows.length > 0)
      return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

    // 비밀번호 암호화
    const hashedPassword = await crypto
    .createHash("sha512")
    .update(password)
    .digest("hex")

    const insertUserInfoParams = [firstName, secondName, birth, email, hashedPassword];

    const connection = await pool.getConnection(async (conn) => conn);

    const userEmailResult = await usersDao.insertUserEmailInfo(connection, insertUserInfoParams);
    console.log(`추가된 회원 : ${userEmailResult[0].insertId}`);
    connection.release();
    return response(baseResponse.SUCCESS_JOIN, `추가된 회원Idx: ${userEmailResult[0].insertId}`);

  } catch (err) {
    logger.error(`App - createUserEmail Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.createUserPhone = async function (firstName, secondName, birth, phone, password) {
  try {
    // 휴대폰 중복 확인
    const phoneRows = await usersProvider.phoneCheck(phone);
    if (phoneRows.length > 0)
      return errResponse(baseResponse.SIGNUP_REDUNDANT_PHONE);

    // 비밀번호 암호화
    const hashedPassword = await crypto
    .createHash("sha512")
    .update(password)
    .digest("hex")

    const insertUserInfoParams = [firstName, secondName, birth, phone, hashedPassword];

    const connection = await pool.getConnection(async (conn) => conn);

    const userPhoneResult = await usersDao.insertUserPhoneInfo(connection, insertUserInfoParams);
    console.log(`추가된 회원 : ${userPhoneResult[0].insertId}`);
    connection.release();
    return response(baseResponse.SUCCESS_JOIN, `추가된 회원Idx: ${userPhoneResult[0].insertId}`);

  } catch (err) {
    logger.error(`App - createUserPhone Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// email 로그인
exports.postEmailSignIn = async function (email, password) {
  try {
    // 이메일 여부 확인
    const emailRows = await usersProvider.emailCheck(email);

    // 이메일 없을 때
    if (emailRows.length < 1) return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);

    const selectEmail = emailRows[0].email

    // 비밀번호 확인
    const hashedPassword = await crypto
    .createHash("sha512")
    .update(password)
    .digest("hex");

    const selectUserPasswordParams = [selectEmail, hashedPassword];
    const passwordRows = await usersProvider.emailPasswordCheck(selectUserPasswordParams)

    // 없는 비밀번호면
    if (passwordRows.length < 1) {
      return errResponse(baseResponse.SIGNIN_PASSWORD_EMPTY);
    }

    // 비밀번호가 맞지 않으면
    if (passwordRows[0].password !== hashedPassword) {
      return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
    }

    const userInfoRows = await usersProvider.accountCheck(emailRows);

    if (userInfoRows[0].status === "LOCK") {
      return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
    } else if (userInfoRows[0].status === "DELETE") {
      return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
    }

    console.log(userInfoRows[0])
    //토큰 생성 Service
    let token = await jwt.sign(
        {
          userIdx: userInfoRows[0].idx,
        }, // 토큰의 내용(payload)
        secret_config.jwtsecret, // 비밀키
        {
          expiresIn: "365d",
          subject: "userInfo",
        } // 유효 기간 365일
    );

    // 로그인 성공
    return response(baseResponse.SUCCESS_LOGIN, {'email': userInfoRows[0].email, 'jwt': token});

  } catch (err) {
    logger.error(`App - postEmailSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// phone 로그인
exports.postPhoneSignIn = async function (phone, password) {
  try {
    // 휴대폰 번호 여부 확인
    const phoneRows = await usersProvider.phoneCheck(phone);
    if (phoneRows.length < 1) return errResponse(baseResponse.SIGNIN_PHONE_WRONG);

    const selectPhone = phoneRows[0].phone

    // 비밀번호 확인
    const hashedPassword = await crypto
    .createHash("sha512")
    .update(password)
    .digest("hex");

    const selectUserPasswordParams = [selectPhone, hashedPassword];
    const passwordRows = await usersProvider.phonePasswordCheck(selectUserPasswordParams);

    // 없는 비밀번호면
    if (passwordRows.length < 1) {
      return errResponse(baseResponse.SIGNIN_PASSWORD_EMPTY);
    }

    // 비밀번호가 맞지 않으면
    if (passwordRows[0].password !== hashedPassword) {
      return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
    }

    // 계정 상태 확인(활성화인지 비활성화인지 LOCK인지)
    const userInfoRows = await usersProvider.accountCheck(phoneRows);

    if (userInfoRows[0].status === "LOCK") {
      return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
    } else if (userInfoRows[0].status === "DELETE") {
      return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
    }

    //토큰 생성 Service
    let token = await jwt.sign(
        {
          userIdx: userInfoRows[0].idx,
        }, // 토큰의 내용(payload)
        secret_config.jwtsecret, // 비밀키
        {
          expiresIn: "365d",
          subject: "userInfo",
        } // 유효 기간 365일
    );

    // 로그인 성공
    return response(baseResponse.SUCCESS_LOGIN, {'phone': userInfoRows[0].phone, 'jwt': token});

  } catch (err) {
    logger.error(`App - postPhoneSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 유저 정보 수정
exports.editUserInfo = async function (profileImg, firstName, secondName, gender, birth, email, phone, userIdx) {
  try {

    // 이메일 중복 확인
    const emailRows = await usersProvider.emailCheck(email);
    if (emailRows.length > 0)
      return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

    // 휴대폰 중복 확인
    const phoneRows = await usersProvider.phoneCheck(phone);
    if (phoneRows.length > 0)
      return errResponse(baseResponse.SIGNUP_REDUNDANT_PHONE);

    const connection = await pool.getConnection(async (conn) => conn);
    const editUserInfoResult = await usersDao.updateUserInfo(connection, profileImg, firstName, secondName, gender, birth, email, phone, userIdx)
    connection.release();

    return response(baseResponse.SUCCESS_MODIFY_USER,`수정된 회원Idx: ${userIdx}`);
  } catch (err) {
    logger.error(`App - editUserInfo Service error\n: ${err.message} \n${JSON.stringify(err)}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 유저 상태값 수정
exports.editStatus = async function (status, userIdx) {
  try {
    // 상태 값 중복 체크
    const statusRows = await usersProvider.statusCheck(userIdx);

    if (statusRows[0].status == status)
      return errResponse(baseResponse.SIGNUP_REDUNDANT_STATUS);

    // 상태 값 입력
    const connection = await pool.getConnection(async (conn) => conn);
    const editStatusResult = await usersDao.updateStatus(connection, status, userIdx);
    connection.release();

    return response(baseResponse.SUCCESS_STATUS_USER, `회원Idx:${userIdx} 상태:${status}`);
  } catch (err) {
    logger.error(`App - editStatus Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
