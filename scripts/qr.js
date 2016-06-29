/**
 * Generates a QR code for the presentation so people
 * can follow along.
 */

~ function () {
    'use strict';

    // use a PNG in an <img> element
    var elm = new Image();
    elm.id = 'qr-code';
    elm.src = 'https://api.qrserver.com/v1/create-qr-code/?size=500x500&format=png&data=' + encodeURIComponent(location.href);

    // add event listener to update image
    Reveal.addEventListener('slidechanged', function () {
        elm.src = 'https://api.qrserver.com/v1/create-qr-code/?size=500x500&format=png&data=' + encodeURIComponent(location.href);
    });

    // configure styles
    style({
        '#qr-code': {
            width: '10%',
            height: 'auto',
            position: 'fixed',
            right: '10px',
            bottom: '10px'
        }
    });

    // inject into body
    document.body.appendChild( elm );
}();