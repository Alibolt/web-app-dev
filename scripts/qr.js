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
    elm.style.width = '10%';
    elm.style.height = 'auto';

    elm.style.position = 'fixed';
    elm.style.right = '10px';
    elm.style.bottom = '10px';

    // inject into body
    document.body.appendChild( elm );
}();