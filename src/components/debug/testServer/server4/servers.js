var fs = require('fs');
var express = require('express');
var app = express();
var formidable = require('formidable')
var myDate = new Date();

app.post('/upload', function (req, res, next) {
    var mytime=myDate.toLocaleTimeString(); 
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    console.log(mytime + '接收到请求')
    var form = new formidable.IncomingForm()
    form.uploadDir = './myImage'
    form.keepExtensions = true

    form.on('field', (field, value) => {
      console.log(typeof field)
      console.log(typeof value)
    })
    form.on('end', () => {
      res.end('上传完成!')
    })
  
    form.parse(req)

    res.write('this is test')
    res.end()
});

app.listen(4000);