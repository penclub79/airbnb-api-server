const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const usersDao = require("./usersDao");

// 이메일 검색
exports.emailCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await usersDao.selectUserEmail(connection, email);
  connection.release();

  return emailCheckResult;
};

// 휴대폰 검색
exports.phoneCheck = async function (phone) {
  const connection = await pool.getConnection(async (conn) => conn);
  const phoneCheckResult = await usersDao.selectUserPhone(connection, phone);
  connection.release();

  return phoneCheckResult;
};

// 이메일 패스워드 검색
exports.emailPasswordCheck = async function (selectUserPasswordParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const passwordCheckResult = await usersDao.selectUserEmailPassword(connection, selectUserPasswordParams);
  connection.release();

  return passwordCheckResult;
};

// 휴대폰 패스워드 검색
exports.phonePasswordCheck = async function (selectUserPasswordParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const passwordCheckResult = await usersDao.selectUserPhonePassword(connection, selectUserPasswordParams);
  connection.release();

  return passwordCheckResult;
};

// 상태 검색
exports.accountCheck = async function (values) {
  if (values[0].phone){
    console.log('폰입니다.');
    const connection = await pool.getConnection(async (conn) => conn);
    const phoneAccountResult = await usersDao.selectPhoneAccount(connection, values[0].phone);
    connection.release();

    return phoneAccountResult;
  } else {
    console.log('이메일입니다.');
    const connection = await pool.getConnection(async (conn) => conn);
    const emailAccountResult = await usersDao.selectEmailAccount(connection, values[0].email);
    connection.release();

    return emailAccountResult;
  }
};

// 유저 검색
exports.retrieveUserList = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const usersListResult = await usersDao.selectUserId(connection);
  connection.release();

  return usersListResult;
};

// 상태값만 체크
exports.statusCheck = async function (userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const statusResult = await usersDao.selectStatus(connection, userIdx);
  connection.release();

  return statusResult;
};

