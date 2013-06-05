# markdown-directory

serve markdown files from a directory as html

[![build status](https://secure.travis-ci.org/substack/markdown-directory.png)](http://travis-ci.org/substack/markdown-directory)

# example

To render some markdown files in `articles/`, you could write:

``` js
var http = require('http');
var fs = require('fs');
var hyperstream = require('hyperstream');
var article = require('markdown-directory')(__dirname + '/articles');

var server = http.createServer(function (req, res) {
    var m = RegExp('^/article/(.+)').exec(req.url);
    if (m) {
        res.setHeader('content-type', 'text/html');
        
        fs.createReadStream(__dirname + '/article.html')
            .pipe(hyperstream({
                'title': m[1],
                '#article': article(m[1]),
            }))
            .pipe(res)
        ;
    }
    else res.end('beep boop\n')
});
server.listen(9000);
```

Now your markdown will be rendered into the article div of `article.html`:

```
$ curl -s http://localhost:9000/article/robot
<html>
  <head>
    <title>robot</title>
  </head>
  <body>
    <div id="article"><h1>robots</h1>
<p>Beep boop.</p>
</div>
  </body>
</html>
```

# methods

``` js
var mdir = require('markdown-directory')
```

## var article = mdir(dir)

Return a function `article(name)` for loading markdown files from the base
directory `dir`.

## var stream = article(name)

Return a readable stream for the markdown file `name + '.markdown'`.

`stream` will emit an `'error'` event but it has a default listener that inlines
the error message into the output stream so you don't need to worry about
handling messages unless you care especially much about setting the http status
codes on the response. The `'error'` events have a `.statusCode` property that
you can copy onto `res.statusCode` yourself if you want that.

# install

With [npm](https://npmjs.org) do:

```
npm install markdown-directory
```

# license

MIT
