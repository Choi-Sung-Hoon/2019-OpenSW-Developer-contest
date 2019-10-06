/*eslint-disable no-console*/
/*eslint no-undef: "error"*/
/*eslint-env node*/


var listRecord_uv = function(req, res) {
	console.log('user 모듈 안에 있는 listRecord_uv 호출됨.');
 
    // 통신하고 나서 받은 값으로 바꿔야지 
	var database = req.app.get('database');
    
    // TCP/IP가 연결되어 있다면
	if (database.db) {
		
		database.UserModel.findAll(function(err, payloads) { // 자바 서버에게 요청한 것을 받았다면
			
			// 에러 발생 시, 클라이언트로 에러 전송
			if (err) {
                console.error('대학생의 수상/참여 리스트 조회 중 에러 발생 : ' + err.stack);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>사용자 리스트 조회 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
				res.end();
                
                return;
            }

			if (payloads) {
				console.dir(payloads); 
 
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                
                	var data = [
		{
			"student_id": "doho",
			"host_id": "host",
			"authorizer_id": "Minister",
			"student_organization": "경북대학교",
			"contest_title": "공개SW 개발자 대회",
			"contest_category": "마케팅",
			"date": "2019-01-01",
			"project_title": "CCMS",
			"awarded": true,
			"prize_name": "장관상"
		},
		{
			"student_id": "seungmin",
			"host_id": "host",
			"authorizer_id": "Minister",
			"student_organization": "경북대학교",
			"contest_title": "GLOBAL INNOVATOR FESTA",
			"contest_category": "로봇/인공지능",
			"date": "2019-12-01",
			"project_title": "터틀 봇을 이용한 계단오르기",
			"awarded": true,
			"prize_name": "2등상"
		},
		{
			"student_id": "suho",
			"host_id": "NEXON",
			"authorizer_id": "KimJungJu",
			"student_organization": "경북대학교",
			"contest_title": "Nexon 안티치트",
			"contest_category": "학술/논문",
			"date": "2018-10-11",
			"project_title": "NGS 게임가드의 취약점",
			"awarded": false,
			"prize_name": "-"
		}
	];
payloads = data;
				
				// 뷰 템플레이트를 이용하여 렌더링한 후 전송
				var context = {payloads:payloads};
				req.app.render('profile/student.ejs', context, function(err, html) {
					if (err) {throw err;}
					console.log('rendered : ' + html);
					res.end(html);
				});
				
			} else { // payload가 없다면
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>사용자 리스트 조회  실패</h2>');
				res.end();
			}
		});
	} else { //TCP/ IP 소켓 연결 실패 
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
	
};





module.exports.listRecord_uv = listRecord_uv

