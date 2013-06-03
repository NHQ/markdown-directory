var path = require('path');
var fs = require('fs');
var marked = require('marked');
var through = require('through');

module.exports = function (dir) {
    return function (articleName) {
        if (/[\\\/.]/.test(articleName)) {
            error(400, new Error('malformed characters in request'));
            return tr;
        }
        
        var file = path.join(dir, articleName + '.markdown');
        var rs = fs.createReadStream(file);
        rs.on('error', function (err) {
            if (err && err.code === 'ENOENT') {
                error(404, new Error('article not found'));
            }
            else tr.emit('error', error(500, err));
        });
        
        var body = '';
        var tr = through(write, end);
        rs.pipe(tr);
        return tr;
        
        function error (code, e) {
            e.statusCode = code;
            process.nextTick(function () {
                tr.emit('error', e);
            });
        }
        
        function write (buf) { body += buf }
        
        function end () {
            this.queue(marked(body));
            this.queue(null);
        }
    };
};
