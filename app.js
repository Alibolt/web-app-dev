'use strict';

const express = require('express'),
      app = express(),
      redirect = express(),
      transport = require('nodemailer').createTransport(`smtps://karim%40alibhai.co:${process.env.MAILPASS}@smtp.gmail.com`),
      fs = require('fs'),
      path = require('path'),
      qs = require('querystring'),
      https = require('http2').createServer({
          key: fs.readFileSync(path.resolve(__dirname, 'ssl', 'web-apps.co.key'), 'utf8'),
          cert: fs.readFileSync(path.resolve(__dirname, 'ssl', '1_web-apps.co_bundle.crt'), 'utf8'),
          ca: fs.readFileSync(path.resolve(__dirname, 'ssl', 'ca.pem'), 'utf8')
      }, function (req, res) {
          const url = require('url').parse(req.url);
          let file = url.pathname;
          file = file === '/' ? '/index.html' : file;
          
          if (file === '/post') {
              const data = qs.parse(url.query);

              transport.sendMail({
                  subject: 'New Question',
                  to: 'web-apps@apps.alibhai.co',
                  from: 'questions@web-apps.co',
                  text: `A user from web-apps.co has asked:\n\n"${data.question}"`,
                  html: `<i>A user from web-apps.co has asked:</i><br><br><blockquote>${data.question}</blockquote>`
              }, (err) => {
                  if (err) {
                      console.log(err);
                      res.statusCode = 500;
                  }

                  res.end();
              });
          } else {
              const fd = path.resolve(__dirname, '.' + file);

              if (fs.existsSync(fd)) {
                  fs.createReadStream(fd).pipe(res);
              } else {
                  res.statusCode = 404;
                  res.end();
              }
          };
      }),
      http = require('http').createServer(redirect);

redirect.use((req, res) => res.redirect(301, `https://web-apps.co${req.originalUrl}`));

http.listen(80, () => console.log('HTTP redirect setup on :80'))
https.listen(443, () => console.log('listening on :443'));
