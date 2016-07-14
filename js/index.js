~ function ( app ) {
    'use strict';

    const exec = require('child_process').exec
    const fs = require('fs')
    const path = require('path')
    const dir = require('tmp').dirSync()
    const marked = require('marked')
    const cal = new (require('public-google-calendar'))({
        calendarId: 'web-apps.co_fi15mde2a67i4sm4td2ajm0g2o@group.calendar.google.com'
    })

    let videos

    app.config(function ($sceProvider) {
        $sceProvider.enabled(false)
    })

    app.controller('TopCtl', function ($scope) {
        $scope.ready = false
        $scope.msg = 'Downloading classes'

        exec(`node clone.js ${dir.name}`, {
            cwd: path.resolve(__dirname, 'js')
        }, () => {
            $scope.msg += '\nFetching videos'
            $scope.$apply()
            cal.getEvents((err, evts) => {
                if (err) alert(err)
                else {
                    videos = evts.map(evt => ({
                        title: evt.summary,
                        url: evt.description
                    }))

                    $scope.msg += '\nInstalling dependencies'
                    $scope.$apply()
                    exec('npm i', {
                        cwd: dir.name
                    }, function () {
                        exec('node_modules/.bin/reveal-md ./classes/08-12.md --disableAutoOpen --scripts scripts/styles.js,scripts/fragmentize.js,scripts/qr.js,scripts/notes.js,scripts/sync.js,scripts/timer.js --port 8080 --highlightTheme zenburn --theme blood', {
                            cwd: dir.name
                        }, console.log.bind(console))

                        $scope.ready = true
                        $scope.$apply()
                    })
                }
            })
        })
    })

    app.controller('MainCtl', function ( $scope ) {
        $scope.viewSlides = { type: null }
        $scope.months = ['July', 'August']
        $scope.viewable = ['Presentations', 'Readings', 'Videos']
        $scope.inView = { name: 'Presentations' }
        $scope.dates = fs.readdirSync(path.resolve(dir.name, 'classes'))
                         .filter(name => name.substr(-3) === '.md' && name.length > 3)
                         .map(name => name.substr(0, name.length - 3))
        $scope.view = null
        $scope.videoShown = null

        $scope.translate = function (date) {
            date = date.split('-').map(n => parseInt(n, 10))
            return $scope.months[date[0] - 8] + ', ' + $scope.nth(date[1])
        }

        $scope.nth = function (n) {
            var endings = ['st', 'nd', 'rd', 'th']
            var num = n

            if ( n > 4 ) n = 4
            return num + endings[n - 1]
        }

        $scope.open = function (type, date) {
            $scope.view = date
            $scope.viewSlides.type = type === 'Presentations' ? 'slides' : 'reading'
        }

        $scope.slides = function () {
            return 'http://localhost:8080/' + $scope.view + '.md'
        }

        $scope.pdf = function () {
            return 'pdfjs/web/viewer.html?file=' + encodeURIComponent(path.resolve(dir.name, 'classes', 'pdfs', $scope.view + '.pdf'))
        }

        $scope.videos = function () {
            return videos
        }

        $scope.openVid = function (video) {
            $scope.videoShown = video.url.substr(video.url.indexOf('?v=') + 3)
            if ($scope.videoShown.indexOf('&') !== -1) {
                $scope.videoShown = $scope.videoShown.substr(0, $scope.videoShown.indexOf('&'))
            }
            $scope.viewSlides.type = 'video'
        }

        $scope.videoSrc = function () {
            return 'https://www.youtube.com/embed/' + $scope.videoShown
        }
        
        $scope.reading = function () {
            return marked(fs.readFileSync(path.resolve(dir.name, 'readings', $scope.view + '.md'), 'utf8'))
        }

        window.scope=$scope
    })
}( angular.module('viewer', []) )