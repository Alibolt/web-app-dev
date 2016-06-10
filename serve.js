'use strict';

const express = require('express'),
      app = express(),
      http = require('http').Server(app),
      exec = require('child_process').exec,
      util = require('util'),
      fs = require('fs'),
      path = require('path'),
      nextPort = require('next-port'),
      open = require('open');

var child = exec(`node_modules/.bin/reveal-md ./classes/${process.argv[2]}.md --disableAutoOpen --scripts scripts/fragmentize.js,scripts/qr.js,scripts/notes.js --port 8080 --highlightTheme zenburn --theme sky`, function (err, stderr) {
    console.log(err);
    console.log(stderr);
}).stdout.on('data', function (data) {
    for (let part of data.split(/\s+/g)) {
        if (part.substr(0, 5) === 'http:') {
            app.use(function (req, res) {
                const url = req.url === '/' ? '/index.html' : req.url;

                if (url === '/index.html') {
                    res.end(util.format(fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8'), `${part}/${process.argv[2]}.md`, `${part}/${process.argv[2]}.md`));
                } else {
                    res.sendFile(path.resolve(__dirname, '.' + url));
                }
            });

            nextPort().then((port) => http.listen(port, function () {
                console.log(`LISTEN :${port}`);
                open(`http://localhost:${port}/`);
            }));
            return;
        }
    }
});

process.on('beforeExit', () => child.kill());