module.exports = function(app) {
  const wishlist = require('./wishlistController');
  const jwtMiddleware = require('../../../config/jwtMiddleware');

  // 위시리스트 게시판 생성
  app.post('/app/:userIdx/wishLists', jwtMiddleware, wishlist.postWishList);

  // 위시 활성화 / 비활성화
  app.patch('/app/:userIdx/:wishListIdx/wish-hosts', jwtMiddleware, wishlist.patchWishHost);

  // 위시리스트 조회
  app.get('/app/wishLists/users', jwtMiddleware, wishlist.getWishList);

  // 위시리스트 게시판 수정
  app.patch('/app/wishLists/:userIdx/:wishListIdx', jwtMiddleware, wishlist.patchWishList);

  // 위시리스트 게시판 삭제
  app.patch('/app/wishLists/status/:userIdx/:wishListIdx', jwtMiddleware, wishlist.patchWishListStatus);

}