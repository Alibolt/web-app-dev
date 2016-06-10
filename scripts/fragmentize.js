/**
 * Force fragmentizes all <li> elements to become
 * reveal.js fragments.
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