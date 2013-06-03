var http = require('http');
var fs = require('fs');
var hyperstream = require('hyperstream');
var article = require('../')(__dirname + '/articles');

var server = http.createServer(function (req, res) {
    var m = RegExp('^/article/(.+)').exec(req.url);
    if (m) {
        res.setHeader('content-type', 'text/html');
        var stream = article(m[1]);
        stream.on('error', function (err) {
            res.end(err + '\n')
        });
        
        fs.createReadStream(__dirname + '/article.html')
            .pipe(hyperstream({
                'title': m[1],
                '#article': stream,
            }))
            .pipe(res)
        ;
    }
    else res.end('beep boop\n')
});
server.listen(9000);
