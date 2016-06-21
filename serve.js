'use strict';

const express = require('express'),
      app = express(),
      http = require('http').Server(app),
      exec = require('child_process').exec,
      util = require('util'),
      fs = require('fs'),
      path = require('path'),
      nextPort = require('next-port'),
      open = require('open'),
      ip = require('my-ip'),
      bodyParser = require('body-parser'),
      basicAuth = require('basic-auth');

var child = exec(`node_modules/.bin/reveal-md ./classes/${process.argv[2]}.md --disableAutoOpen --scripts scripts/fragmentize.js,scripts/qr.js,scripts/notes.js,scripts/sync.js --port 8080 --highlightTheme zenburn --theme sky`, function (err, stderr) {
    console.log(err);
    console.log(stderr);
}).stdout.on('data', function (data) {
    let port;
    let state = '{}';
    let hung = [];

    app.get('/state', function (req, res) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET');

        hung.push(res);
    });

    app.use(function (req, res, next) {
        let user = basicAuth(req);

        if (!user || user.pass !== process.env.SV_PASS) {
            res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
            res.sendStatus(401);
        } else next();
    });

    app.post('/state', bodyParser.json(), function (req, res) {
        state = req.body;

        hung.map((resp) => resp.end( JSON.stringify(state) ));
        hung = [];

        // respond to avoid hanging the XHR
        res.end('Thanks.');
    });

    app.use(function (req, res) {
        const url = req.url === '/' ? '/index.html' : req.url;

        if (url === '/index.html') {
            res.end(util.format(fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8'), `http://${ip()}:8080/${process.argv[2]}.md`, `http://${ip()}:8080/${process.argv[2]}.md`));
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
