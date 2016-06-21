/**
 * Syncs with the presentation with the speaker view.
 */

~ function () {
    'use strict';

    // download the latest state by long polling
    let fetch = (done) => new Promise((resolve) => {
        let xhr = new XMLHttpRequest();

        xhr.onload = () => resolve( JSON.parse( xhr.responseText ) );
        xhr.onerror = () => fetch(resolve);

        xhr.open('get', 'http://' + location.host.split(':')[0] + ':1024/state', true);
        xhr.send();
    }).then(done),

    // do a long poll for the state. upon resolution,
    // update Reveal then go again
    update = () => fetch((state) => {
        Reveal.setState( state );
        update();
    });

    // begin updates
    update();
}();