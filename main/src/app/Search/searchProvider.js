const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const searchDao = require("./searchDao");

exports.retrieveUserByHost = async function (values, startDate) {
  const connection = await pool.getConnection(async (conn) => conn);
  if (values.state) {
    const hostListResult = await searchDao.selectUserByHost(connection, values.state);

    // 호스트 필터링
    // 해당 지역의 검색조건으로 안나올때
    // 호스트 등록 날짜보다 이전 날짜,
    // 호스트 게스트 < 게스트 높을 때
    if (hostListResult.length == 0 || startDate > hostListResult[0].registerDate) {
      return [];
    } else {
      const userByHostResult = await searchDao.selectUserByHost(connection, values.state);
      connection.release();

      return userByHostResult;
    }
  } else {
    const hostNameListResult = await searchDao.selectUserByHostName(connection, values.hostIdx);

    // 호스트 필터링
    // 해당 지역의 검색조건으로 안나올때
    // 호스트 등록 날짜보다 이전 날짜,
    // 호스트 게스트 < 게스트 높을 때
    if (hostNameListResult.length == 0 || startDate > hostNameListResult[0].registerDate) {
      return [];
    } else {
      const userByHostNameResult = await searchDao.selectUserByHostName(connection, values.hostIdx);
      connection.release();

      return userByHostNameResult;
    }
  }

};