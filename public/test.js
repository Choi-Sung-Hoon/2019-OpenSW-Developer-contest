	// 출력할 데이터들
	var attr = [
		{field:"date"},
		{field:"student_organization"},
		{field:"contest_category"},
		{field:"contest_title"},
		{field:"awarded"},
		{field:"prize_name"}
	];
	// 샘플 데이터들
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
	
	// 추가하는 함수
	function add_table() {
		var table_body = $("#table_body");		
		$.each( data, function(index, row) {
			// 수상 여부 true/false를 수상/참여로 변환
			if(row.awarded) {
				row.awarded = "수상";
			} else {
				row.awarded = "참여";
			}
			var tr = $("<tr>").appendTo(table_body);
			$.each(attr, function(i, fieldInfo) {
				var td = $("<td>").appendTo(tr);
				td.html( row[fieldInfo.field]);
				td.addClass("body-item mbr-fonts-style display-7");
			});
			var td = $("<td>").appendTo(tr);
			td.html("<a class='btn-primary display-4' style='padding: 6px; margin-right:0.3rem; border-radius: 3px;'>자세히 보기</a>");
			td.addClass("body-item mbr-fonts-style display-7");
		});
	}

// 강제로 태그 로드시 함수 실행
var seq = $("#table_body").load(add_table());
