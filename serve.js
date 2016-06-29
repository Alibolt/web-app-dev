'use strict';

const express = require('express'),
      app = express(),
      fs = require('fs'),
      path = require('path'),
      url = require('url'),
      http = require('https').createServer({
          cert: fs.readFileSync(path.resolve(__dirname, 'ssl', 'server.crt')),
          key: fs.readFileSync(path.resolve(__dirname, 'ssl', 'server.key'))
      }, app),
      exec = require('child_process').exec,
      util = require('util'),
      nextPort = require('next-port'),
      open = require('open'),
      ip = require('my-ip'),
      bodyParser = require('body-parser'),
      basicAuth = require('basic-auth'),
      proxy = require('express-http-proxy');

var child = exec(`node_modules/.bin/reveal-md ./classes/${process.argv[2]}.md --disableAutoOpen --scripts scripts/styles.js,scripts/fragmentize.js,scripts/qr.js,scripts/notes.js,scripts/sync.js --port 8080 --highlightTheme zenburn --theme blood`, function (err, stderr) {
    console.log(err);
    console.log(stderr);
}).stdout.on('data', function (data) {
    let port;
    let stateRequests = [];

    app.use('/proxy', proxy('localhost:8080', {
        forwardPath: function (req) {
            return url.parse(req.url).path;
        }
    }));

    app.get('/state', function (req, res) {
        res.set('Transfer-Encoding', 'chunked');
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET');
        
        console.log('* Received request for state');
        stateRequests.push(res);
    });

    app.use(function (req, res, next) {
        let user = basicAuth(req);

        if (!user || user.pass !== process.env.SV_PASS) {
            res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
            res.sendStatus(401);
        } else next();
    });

    app.post('/state', bodyParser.json(), function (req, res) {
        console.log(req.body);
        console.log('* Updated state for %s requests', stateRequests.length);

        stateRequests.forEach((_res) => {
            _res.write( JSON.stringify(req.body) + '\0' );
        });

        // avoid hanging the XHRs
        res.end('Thanks.');
    });

    app.use(function (req, res) {
        const url = req.url === '/' ? '/index.html' : req.url;

        if (url === '/index.html') {
            res.end(util.format(fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8'), process.argv[2], process.argv[2]));
        } else {
            res.sendFile(path.resolve(__dirname, '.' + url));
        }
    });

    nextPort().then((_port) => http.listen(_port, function () {
        port = _port;
        console.log(`LISTEN :${port}`);
        //open(`http://localhost:${port}/`);
    }));
});

process.on('beforeExit', () => child.kill());
