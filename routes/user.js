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

