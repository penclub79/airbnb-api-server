const authService = require("../../app/Auth/authService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

exports.getGoogleLogin = async function(req, res) {
  const googleToken = req.headers['authorization'] || req.query.token;

  // 구글 로그인 실패
  if (!googleToken) {
    return res.send(response(baseResponse.FAIL_GOOGLE_LOGIN));
  }
  // const signInAuth = await authService.postSignToken(googleToken);
  // // console.log(req.query.token);
  // // console.log(googleToken);
  // console.log(signInAuth);

  return res.send(
      response(baseResponse.SUCCESS_GOOGLE_LOGIN, {"accessToken":googleToken}));
};

// exports.getGoogleUserInfo = async function(req, res) {
//   const url = require('url');
//   const googleUserInfoToken = req.headers['authorization'];
//   const address = `https://www.googleapis.com/calendar/v3/users/me/calendarList`
//   console.log(req);
//   console.log(address);
//   console.log(googleUserInfoToken);
//
//   return res.send(
//       response(baseResponse.SUCCESS));
// };

// module.exports = googleToken;