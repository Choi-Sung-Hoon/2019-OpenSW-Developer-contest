	// 출력할 학생의 데이터들
	var attr_student = [
		{field:"date"},
		{field:"student_organization"},
		{field:"contest_category"},
		{field:"contest_title"},
		{field:"awarded"},
		{field:"prize_name"}
	];
	// 대회주최자의 출력데이터
	var attr_host = [
		{field:"date"},
		{field:"contest_title"},
		{field:"contest_category"},
		{field:"student_id"},
		{field:"awarded"},
		{field:"project_title"}
	];
	// 인증자의 출력 데이터
	var attr_author = [
		{field:"date"},
		{field:"contest_title"},
		{field:"contest_category"},
		{field:"student_id"},
		{field:"awarded"},
		{field:"project_title"}
	];

	// 샘플 데이터들
	var data_before = document.getElementById('payload').innerHTML;
	var data2 = JSON.parse(data_before);

	var data3 = {"record":[ { "student_id":"stee123", "host_id":"qwert1163", "authorizer_id":"qwe123", "student_organization":"KNU", "contest_title":"Block_Chain", "contest_category":"software/develop", "date":"2019-01-01", "project_title":"null", "awarded":"true", "prize_name":"first" }]};
						   
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
	function add_table(attr) {
		var table_body = $("#table_body");		
		$.each( data2.record, function(index, row) {
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
var attr_type = $("#type").attr('name');
switch(attr_type) {
	case "대학생":
		var seq = $("#table_body").load(add_table(attr_student));
		break;
	case "대회주최자":
		var seq = $("#table_body").load(add_table(attr_host));
		break;
	case "기업":
		
		break;
	case "시상인증자":
		var seq = $("#table_body").load(add_table(attr_author));
		break;
}

