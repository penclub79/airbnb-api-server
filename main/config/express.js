const express = require('express');
const compression = require('compression');
const methodOverride = require('method-override');
var cors = require('cors');
// const passport = require('passport');
const session = require('express-session');
// const passport = require('./passport');

module.exports = function () {
    const app = express();

    app.use(compression());

    app.use(express.json());

    app.use(express.urlencoded({extended: true}));

    app.use(methodOverride());

    app.use(cors());
    app.use(express.static(process.cwd() + '/public'));

    app.use(session({secret: 'MySecret', resave: false, saveUninitialized: true}));

    // // Passport setting
    // app.use(passport.initialize());
    // app.use(passport.session());
    /* App (Android, iOS) */
    // TODO: 도메인을 추가할 경우 이곳에 Route를 추가하세요.
    // require('../src/app/User/userRoute')(app);
    // require('../src/app/Board/boardRoute')(app);

    // app.get('/',
    //     (req, res) => res.send('Hello World'));
    //
    // app.get('/fail',
    //     (req, res) => res.send('Fail login'));

    // app.get('/auth/google',
    //     passport.authenticate('google', {scope : ['profile']}));

    // app.get('/oauth',
    //     passport.authenticate('google', {failureRedirect: '/fail'}),
    //     function(req, res) {
    //     // success
    //         res.redirect('/');
    //     });

    // 사용자
    require('../src/app/Users/usersRoute')(app);

    // 호스트
    require('../src/app/Host/hostRoute')(app);

    // 검색
    require('../src/app/Search/searchRoute')(app);

    // 예약
    require('../src/app/Reservation/reservationRoute')(app);

    // 위시리스트
    require('../src/app/WishList/wishlistRoute')(app);

    // 메세지
    require('../src/app/Message/messageRoute')(app);

    // 리뷰
    require('../src/app/Review/reviewRoute')(app);

    // 알림
    require('../src/app/Notice/noticeRoute')(app);

    //test
    // require('../src/app/Test/testRoute')(app);

    // google 로그인 인증
    require('../src/app/Auth/authRoute')(app);


    return app;
};