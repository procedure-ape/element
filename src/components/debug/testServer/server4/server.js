var fs = require('fs');
var express = require('express');
var app = express();

app.get('/index', function(req, res, next){
    console.log('res index.html')
    var form = fs.readFileSync('./index.html', {encoding: 'utf8'});
    res.send(form);
});

app.listen(3000);