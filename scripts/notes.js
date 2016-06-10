/**
 * Expose slide notes through postMessage API.
 */

~ function () {
    'use strict';

    var sendNotes = function () {
        parent.postMessage(JSON.stringify({
            method: 'slidenotes',
            notes: (Reveal.getSlideNotes() || '').split('\n')
        }), '*');
    };

    document.addEventListener('ready', sendNotes);
    document.addEventListener('slidechanged', sendNotes);
}();