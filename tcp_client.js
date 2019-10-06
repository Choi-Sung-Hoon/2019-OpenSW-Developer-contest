var net = require('net');
var database = require('./database/database');

exports.getConnection = function getConnection(portNum, hostIP, option, res, req, viewFile, sessionID, ) {
    var client = net.connect({ port: portNum, host: hostIP }, function() {
        console.log('   local = %s:%s', this.localAddress, this.localPort);
        console.log('   remote = %s:%s', this.remoteAddress, this.remotePort);
        this.setTimeout(500);
        this.setEncoding('utf8');
        this.on('data', function(data) {
            reply = data.toString();
            console.log("socket From Server: " + reply);
            var payloads = JSON.parse(reply).record;
            console.log(payloads)
            
            switch(option){
                case "insert" : 
                    break;
                case "company" : //일단은 DB 부르는 걸 company 라고 하자 
                     /* var database = req.app.get('database');
                        if(datbase.db) {
                        var query = database.UserModel.findOne({ 'email': yy }); //payloads[i].student_id
                        query.select('name');
                        query.exec(function (err, tuple) {
                    if (err) return handleError(err);
                        console.log(tuple);
                    });
                }*/
                    break;
                case "default" :
                    res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                    // 뷰 템플레이트를 이용하여 렌더링한 후 전송
                    var context = { user: req.user, payloads: payloads };
                    req.app.render(viewFile, context, function(err, html) {
                        if (err) {
                        console.error('뷰 렌더링 중 에러 발생 : ' + err.stack);
                        return;
                    }
                    res.end(html);
                });
                break;
            }
            
            /*
            //insert한 경우 
            
            if(record.success == true) //insert 성공하면
            {
                    미지정 그 외에는 밑에 꺼, 구현 예정
            }
            */
            
            //기업인 경우

            //일반적으론 이 case
            /*
            res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
            
            // 뷰 템플레이트를 이용하여 렌더링한 후 전송
            var context = { user: req.user, payloads: payloads };
            req.app.render(viewFile, context, function(err, html) {
                if (err) {
                    console.error('뷰 렌더링 중 에러 발생 : ' + err.stack);
                    return;
                }
                console.log('rendered : ' + html);
                //res.end(html);
            });
            //this.end();
            */
        });
        this.on('end', function() {
            console.log(connName + ' Client disconnected');
        });
        this.on('error', function(err) {
            console.log('Socket Error: ', JSON.stringify(err));
        });
        this.on('timeout', function() {
            console.log('Socket Timed Out');
        });
        this.on('close', function() {
            console.log('Socket Closed');
        });
    });
    return client;
}

exports.writeData = function writeData(socket, data) {
    console.log('send' + data)
    var success = !socket.write(data);
    if (!success) {
        (function(socket, data) {
            socket.once('drain', function() {
                writeData(socket, data);
            });
        })(socket, data);
    }
}