/**
 * scripts/fragmentize.js - web-apps
 * Force all `li` to become fragments.
 * Copyright (C) 2016 Karim Alibhai.
 */

~ function ( Reveal ) {
    Reveal.addEventListener('slidechanged', function () {
        [].slice.call(document.getElementsByTagName('li')).forEach(function (li) {
            if (!li.classList.contains('fragment')) {
                li.classList.add('fragment');
            }
        });
    });
}( window.Reveal || document.creatElement('div') );