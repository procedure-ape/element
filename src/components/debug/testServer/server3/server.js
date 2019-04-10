var http = require('http')

http.createServer(function (req,res){
    res.writeHead(200, {'Content-Type': 'text/html;  charset=utf-8'});
    if(req.url !== './favicon.ico'){
        res.write('hello world');
        res.end()
    }

}).listen(8000);

console.log('Server  running  at  http://127.0.0.1:8000/');
