/*eslint-disable no-console*/
/*eslint no-undef: "error"*/
/*eslint-env node*/

//TCP client 모듈화 
var getConnection = require('./tcp_client').getConnection;
var writeData = require('./tcp_client').writeData;

// Express 기본 모듈 불러오기
var express = require('express')
  , http = require('http')
  , path = require('path');

// Express의 미들웨어 불러오기
var bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , static = require('serve-static')
  , errorHandler = require('errorhandler');

// 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

// Session 미들웨어 불러오기
var expressSession = require('express-session');
  

//===== Passport 사용 =====//
var passport = require('passport');
var flash = require('connect-flash');


// 모듈로 분리한 설정 파일 불러오기
var config = require('./config');

// 모듈로 분리한 데이터베이스 파일 불러오기
var database = require('./database/database');

// 모듈로 분리한 라우팅 파일 불러오기
var route_loader = require('./routes/route_loader');

// 익스프레스 객체 생성
var app = express();

var ready = false;
var payload;

//===== 뷰 엔진 설정 =====//
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
console.log('뷰 엔진이 ejs로 설정되었습니다.');

//===== 서버 변수 설정 및 static으로 public 폴더 설정  =====//
console.log('config.server_port : %d', config.server_port);
app.set('port', process.env.PORT || 3000);

// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }))

// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())

// public 폴더를 static으로 오픈
app.use('/public', static(path.join(__dirname, 'public')));
 
// cookie-parser 설정
app.use(cookieParser());

// 세션 설정
app.use(expressSession({
	secret:'my key',
	resave:true,
	saveUninitialized:true
}));



//===== Passport 사용 설정 =====//
// Passport의 세션을 사용할 때는 그 전에 Express의 세션을 사용하는 코드가 있어야 함
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

 
//라우팅 정보를 읽어 들여 라우팅 설정
var router = express.Router();
route_loader.init(app, router);


//===== Passport 관련 라우팅 =====//

// 홈 화면 - index.ejs 템플릿을 이용해 홈 화면이 보이도록 함
router.route('/').get(function(req, res) {
	console.log('/ 패스 요청됨.');
	res.render('index.ejs', {message: req.flash('loginMessage')});
});

// 로그인 화면 - login.ejs 템플릿을 이용해 로그인 화면이 보이도록 함
router.route('/login').get(function(req, res) {
	console.log('/login 패스 요청됨.');
	res.render('login.ejs', {message: req.flash('loginMessage')});
});

// 사용자 인증 - POST로 요청받으면 패스포트를 이용해 인증함
// 성공 시 /profile로 리다이렉트, 실패 시 인덱스 페이지로 리다이렉트함
// 인증 실패 시 검증 콜백에서 설정한 플래시 메시지가 응답 페이지에 전달되도록 함
router.route('/login').post(passport.authenticate('local-login', {
    successRedirect : '/profile', 
    failureRedirect : '/',		// 인덱스 페이지 리다이렉트 시, 화면 스크롤 조정 필요!
    failureFlash : true 
}));

// 회원가입 화면 - signup.ejs 템플릿을 이용해 회원가입 화면이 보이도록 함
router.route('/signup').get(function(req, res) {
	console.log('/signup 패스 요청됨.');
	res.render('signup.ejs', {message: req.flash('signupMessage')});
});

// 대회 Form 등록 요청시 대회 등록 화면으로
router.route('/registerForm').get(function(req, res) {
	console.log('/registerForm 패스 요청됨.');
	
	// 인증된 경우, req.user 객체에 사용자 정보 있으며, 인증안된 경우 req.user는 false값임
    console.log('req.user 객체의 값');
	console.dir(req.user);
    
    // 인증 안된 경우
    if (!req.user) {
        console.log('사용자 인증 안된 상태임.');
        res.redirect('/');
        return;
    }
	
	// 
	if (Array.isArray(req.user)) {
		res.render('registerForm.ejs', {user: req.user[0]._doc});
	} else {
		res.render('registerForm.ejs', {user: req.user});
	}
});

// 등록 Form 전부 완성 후, 확인버튼
router.route('/registerForm_confirm').post(function(req, res){
	console.log('enter-form 안에서 작동');
	
	// 쿼리문을 위한 변수들
	var student_id = req.body.student_id || req.query.student_id;
	var host_id = req.user.email;
	var authorizer_id = req.body.authorizer_id || req.query.authorizer_id;
	var student_organization = req.body.student_organization || req.query.student_organization;
	var contest_title = req.body.contest_title || req.query.contest_title;
	var contest_category = req.body.contest_category || req.query.contest_category;
	var date = req.body.date || req.query.date;
	var project_title = req.body.project_title || req.query.project_title;
	var awarded = req.body.awarded || req.query.awarded;
	var prize_name = req.body.prize_name || req.query.prize_name;
	
	// insert 폼에 맞게 쿼리문 작성
	var query = '{"insert":[{"student_id":"'+student_id
				+'","host_id":"'+host_id
				+'","authorizer_id":"'+authorizer_id
				+'","student_organization":"'+student_organization
				+'","contest_title":"'+contest_title
				+'","contest_category":"'+contest_category
				+'","date":"'+date
				+'","project_title":"'+project_title
				+'","awarded":"'+awarded
				+'","prize_name":"'+prize_name + '"}]}';
	
	// 쿼리문 출력
//	console.log(query);
	// 등록 완료후, 쿼리문 쓰고 프로필 페이지로 이동
	var socket = getConnection(2227, "192.168.43.249", "socket", res, req, 'profile/host.ejs');
    writeData(socket, query);
	res.redirect('/profile')
});

// 인증 완료 버튼 클릭시, 쿼리 전송 후 화면 업데이트
router.route('/verify').post(function(req, res){
	console.log('verify 안에서 작동');
	
	// 쿼리문을 위한 변수들
	var student_id = req.body.student_id || req.query.student_id;
	var authorizer_id = req.body.authorizer_id || req.query.authorizer_id;
	var contest_title = req.body.contest_title || req.query.contest_title;
	
	// insert 폼에 맞게 쿼리문 작성
	var query = '{"update_author":[{'
				+'","contest_title":"'+contest_title + '"}]}';
				+'"student_id":"'+student_id
				+'","authorizer_id":"'+authorizer_id
	
	// 쿼리문 출력
//	console.log(query);
	// 등록 완료후, 쿼리문 쓰고 프로필 페이지로 이동
	var socket = getConnection(2227, "192.168.43.249", "socket", res, req, 'profile/host.ejs');
    writeData(socket, query);
	res.redirect('/profile')
});

// 회원가입 - POST로 요청받으면 패스포트를 이용해 회원가입 유도함
// 인증 확인 후, 성공 시 /profile 리다이렉트, 실패 시 /signup으로 리다이렉트함
// 인증 실패 시 검증 콜백에서 설정한 플래시 메시지가 응답 페이지에 전달되도록 함
router.route('/signup').post(passport.authenticate('local-signup', {
    successRedirect : '/', 
    failureRedirect : '/signup', 
    failureFlash : true 
}));


// 프로필 화면 - 로그인 여부를 확인할 수 있도록 먼저 isLoggedIn 미들웨어 실행
router.route('/profile').get(function(req, res) {
	console.log('/profile 패스 요청됨.');
    
    // 인증된 경우, req.user 객체에 사용자 정보 있으며, 인증안된 경우 req.user는 false값임
    console.log('req.user 객체의 값');
	console.dir(req.user);
    
    // 인증 안된 경우
    if (!req.user) {
        console.log('사용자 인증 안된 상태임.');
        res.redirect('/');
        return;
    }
	
//	console.log("로그인 한 사람의 클래스: "+req.user.classCode)
	
	// 인증된 경우
	/****** classCode *****
	1. 대학생
	2. 대회주최자
	3. 시상인증자
	4. 기업
	**********************/
    
    
    console.log('사용자 인증된 상태임.');
	switch(req.user.classCode) {
		case "대학생":
            var query = '{"select_student":[{"student_id":"'+req.user.email+'"}]}';
            var socket = getConnection(2227, "192.168.43.249", "socket", res, req, 'profile/student.ejs');
            writeData(socket, query);
			break;

		case "대회주최자":
			console.log('이름: '+req.user.name);
            var query = '{"select_host":[{"host_id":"'+req.user.email+'"}]}';
            var socket = getConnection(2227, "192.168.43.249", "socket", res, req, 'profile/host.ejs');
            writeData(socket, query);
            break;

		case "시상인증자":
			console.log('이름: '+req.user.name);
			var query = '{"select_authorizer":[{"authorizer_id":"'+req.user.email+'"}]}';
            var socket = getConnection(2227, "192.168.43.249", "socket", res, req, 'profile/authorizer.ejs');
            writeData(socket, query);
            break;

		case "기업":
			console.log('이름: '+req.user.name);
			var query = '{"select_company":[{"company_id":"'+req.user.email+'"}]}';
            var socket = getConnection(2227, "192.168.43.249", "socket", res, req, 'profile/company.ejs');
            writeData(socket, query);
            break;
	}
});

// 로그아웃 - 로그아웃 요청 시 req.logout() 호출함
router.route('/logout').get(function(req, res) {
	console.log('/logout 패스 요청됨.');
    
	req.logout();
	res.redirect('/');
});



//===== Passport Strategy 설정 =====//

var LocalStrategy = require('passport-local').Strategy;

//패스포트 로그인 설정
passport.use('local-login', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true   // 이 옵션을 설정하면 아래 콜백 함수의 첫번째 파라미터로 req 객체 전달됨
	}, function(req, email, password, done) { 
		console.log('passport의 local-login 호출됨 : ' + email + ', ' + password);
		
		var database = app.get('database');
		database.UserModel.findOne({ 'email' :  email }, function(err, user) {
			if (err) { return done(err); }

			// 등록된 사용자가 없는 경우
			if (!user) {
				console.log('계정이 일치하지 않음.');
				return done(null, false, req.flash('loginMessage', '로그인 정보를 다시 확인해주세요'));  // 검증 콜백에서 두 번째 파라미터의 값을 false로 하여 인증 실패한 것으로 처리
			}
			
			// 비밀번호 비교하여 맞지 않는 경우
			var authenticated = user.authenticate(password, user._doc.salt, user._doc.hashed_password);
			if (!authenticated) {
				console.log('비밀번호 일치하지 않음.');
				return done(null, false, req.flash('loginMessage', '로그인 정보를 다시 확인해주세요'));  // 검증 콜백에서 두 번째 파라미터의 값을 false로 하여 인증 실패한 것으로 처리
			} 
			
			// 정상인 경우
			console.log('계정과 비밀번호가 일치함.');
			return done(null, user);  // 검증 콜백에서 두 번째 파라미터의 값을 user 객체로 넣어 인증 성공한 것으로 처리
		});

	}));


// 패스포트 회원가입 설정
passport.use('local-signup', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true    // 이 옵션을 설정하면 아래 콜백 함수의 첫번째 파라미터로 req 객체 전달됨
	}, function(req, email, password, done) {
        // 요청 파라미터 중 name 파라미터 확인
	var paramName = req.body.name || req.query.name;
	var paramClass = req.body.occup || req.query.occup;
	console.log('passport의 local-signup 호출됨 : ' + email + ', ' + password + ', ' + paramName + ', ' + paramClass);
	
	// findOne 메소드가 blocking되지 않도록 하고 싶은 경우, async 방식으로 변경
	process.nextTick(function() {
		var database = app.get('database');
		database.UserModel.findOne({ 'email' :  email }, function(err, user) {
			// 에러 발생 시
			if (err) {
				return done(err);
			}
			
			// 기존에 사용자 정보가 있는 경우
			if (user) {
				console.log('기존에 계정이 있음.');
				return done(null, false, req.flash('signupMessage', '계정이 이미 존재합니다'));  // 검증 콜백에서 두 번째 파라미터의 값을 false로 하여 인증 실패한 것으로 처리
			} else {
				// 모델 인스턴스 객체 만들어 저장
				var user = new database.UserModel({'email':email, 'password':password, 'name':paramName, 'classCode':paramClass});
				user.save(function(err) {
					if (err) {
						throw err;
					}
					
					console.log("사용자 데이터 추가함.");
					return done(null, user);  // 검증 콜백에서 두 번째 파라미터의 값을 user 객체로 넣어 인증 성공한 것으로 처리
				});
			}
		});    
	});

	}));

// 사용자 인증 성공 시 호출
// 사용자 정보를 이용해 세션을 만듦
// 로그인 이후에 들어오는 요청은 deserializeUser 메소드 안에서 이 세션을 확인할 수 있음
passport.serializeUser(function(user, done) {
//	console.log('serializeUser() 호출됨.');
	console.dir(user);
	
    done(null, user);  // 이 인증 콜백에서 넘겨주는 user 객체의 정보를 이용해 세션 생성
});

// 사용자 인증 이후 사용자 요청 시마다 호출
// user -> 사용자 인증 성공 시 serializeUser 메소드를 이용해 만들었던 세션 정보가 파라미터로 넘어온 것임
passport.deserializeUser(function(user, done) {
//	console.log('deserializeUser() 호출됨.');
	console.dir(user);
	
	// 사용자 정보 중 id나 email만 있는 경우 사용자 정보 조회 필요 - 여기에서는 user 객체 전체를 패스포트에서 관리
    // 두 번째 파라미터로 지정한 사용자 정보는 req.user 객체로 복원됨
    // 여기에서는 파라미터로 받은 user를 별도로 처리하지 않고 그대로 넘겨줌
	done(null, user);  
});




//===== 404 에러 페이지 처리 =====//
var errorHandler = expressErrorHandler({
 static: {
   '404': './public/404.html'
 }
});

app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );


//===== 서버 시작 =====//

//확인되지 않은 예외 처리 - 서버 프로세스 종료하지 않고 유지함
process.on('uncaughtException', function (err) {
	console.log('uncaughtException 발생함 : ' + err);
	console.log('서버 프로세스 종료하지 않고 유지함.');
	
	console.log(err.stack);
});

// 프로세스 종료 시에 데이터베이스 연결 해제
process.on('SIGTERM', function () {
    console.log("프로세스가 종료됩니다.");
    app.close();
});

app.on('close', function () {
	console.log("Express 서버 객체가 종료됩니다.");
	if (database.db) {
		database.db.close();
	}
});

// 시작된 서버 객체를 리턴받도록 합니다. 
var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));

	// 데이터베이스 초기화
	database.init(app, config);
   
});


