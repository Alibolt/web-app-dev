/**
 * Syncs with the presentation with the speaker view.
 */

~ function () {
    'use strict';

    var offset = 0;

    // download the latest state by http chunked streaming
    var fetch = function (resolve) {
        var xhr = new XMLHttpRequest();

        var parseNext = function () {
            var len, data = xhr.responseText;

            for (len = 1; (offset + len) < data.length; len += 1) {
                if ( data[offset + len] === '\0' ) {
                    break;
                }
            }

            data = JSON.parse( data.substr(offset, len) );
            offset += len + 1;

            console.log('read ' + offset + '/' + xhr.responseText.length + ' bytes');
            resolve( data );

            if (offset < xhr.responseText.length) {
                parseNext();
            }
        };

        xhr.onerror = function () { fetch(resolve) };
        xhr.onprogress = parseNext;

        xhr.open('get', 'https://' + location.host.split(':')[0] + ':1024/state', true);
        xhr.send();
    };

    // add styling for later
    document.getElementById('styles').innerHTML += '@-webkit-keyframes spinAndGrow{100%{-webkit-transform:rotate(360deg) scale(1)}50%{-webkit-transform:rotate(180deg) scale(1.5)}}@-moz-keyframes spinAndGrow{100%{-moz-transform:rotate(360deg) scale(1)}50%{-moz-transform:rotate(180deg) scale(1.5)}}@keyframes spinAndGrow{100%{-webkit-transform:rotate(360deg) scale(1);transform:rotate(360deg) scale(1)}50%{-webkit-transform:rotate(180deg) scale(1.5);transform:rotate(180deg) scale(1.5)}}';
    style({
        '.syncd': {
            '-webkit-animation': 'spinAndGrow 1s linear 1',
            '-moz-animation': 'spinAndGrow 1s linear 1',
            'animation': 'spinAndGrow 1s linear 1'
        }
    });

    // do a long poll for the state. upon resolution,
    // update Reveal then go again
    window.sync = function () {
        qr.classList.add( 'syncd' );
        fetch(function (state) { Reveal.setState( state ) });
    };

    // attach to QR code
    var qr = document.getElementById( 'qr-code' );
    qr.title = 'Click me to sync to the speaker\'s presentation!';
    qr.style.cursor = 'pointer';
    qr.style.zIndex = '1000';
    qr.addEventListener('click', window.sync);
}();