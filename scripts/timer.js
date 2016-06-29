/**
 * A simple timer for class assignments.
 */

~ function () {
    'use strict';

    Reveal.addEventListener('timeable', function () {
        setTimeout(function () {
            var out = Reveal.getCurrentSlide().getElementsByClassName('timer')[0];
            var tpl = out.innerHTML;
            var original = tpl;
            var start = '';
            var target;
            var i;

            for (i = 0; i < tpl.length; i += 1) {
                if (/[0-9]/.test(tpl[i])) {
                    tpl = tpl.substr(i).split(':');
                    tpl[1] = tpl[1].split('').filter(function (c) {
                        return /[0-9]/.test(c);
                    }).join('');

                    target = ((parseInt(tpl[0], 10) * 60) + parseInt(tpl[1])) * 1000;
                    break;
                } else start += tpl[i];
            }

            var starttime = +new Date();
            var count = function () {
                var elapsed = +(new Date()) - starttime;
                var eta = target - elapsed;
                var mins = Math.floor(eta / 60000);
                var seconds = Math.floor((eta / 1000) - (mins * 60));
                var milliseconds = Math.floor(eta - (seconds * 1000) - (mins * 60000));

                if (mins < 10) mins = '0' + mins;
                if (seconds < 10) seconds = '0' + seconds;
                if (milliseconds < 10) milliseconds = '0' + milliseconds;

                if ( elapsed < target ) {
                    out.innerHTML = start + mins + ':' + seconds + ':' + milliseconds;
                    setTimeout(count, 1);
                } else {
                    out.innerHTML = original;
                    Reveal.next();
                }
            };

            console.log(tpl);
            count();
        }, 1000);
    });
}();