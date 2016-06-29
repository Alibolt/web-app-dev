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

        // allows proper printing
        [].slice.call(document.getElementsByClassName('fragmentize')).forEach(function (elm) {
            elm.classList.add('fragment');
        });
    });
}( window.Reveal || document.creatElement('div') );