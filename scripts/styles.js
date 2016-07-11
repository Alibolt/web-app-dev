/**
 * Style hacks for the presentations.
 */

window.style = (function (styles) {
    'use strict';

    var tag = document.createElement( 'style' );

    tag.setAttribute( 'id', 'styles' );
    tag.setAttribute( 'type', 'text/css' );
    tag.innerHTML = '';

    document.body.appendChild( tag );
    return function ( styles ) {
        var selector, property;

        for ( selector in styles ) {
            if ( styles.hasOwnProperty( selector ) ) {
                tag.innerHTML += selector + '{';
                for ( property in styles[selector] ) {
                    if ( styles[selector].hasOwnProperty( property ) ) {
                        tag.innerHTML += property + ':' + styles[selector][property] + ';';
                    }
                }
                tag.innerHTML += '}';
            }
        }
    };
}());

style({
    '.pull-right': {
        float: 'right'
    },

    '.pull-left': {
        float: 'left'
    },

    '.clearfix': {
        clear: 'both'
    },

    '.reveal code': {
        'padding': '7px 10px',
        'margin': '0 5px',
        'font-size': '.8em',
        'background': '#000',

        '-webkit-border-radius': '10px',
        '-moz-border-radius': '10px',
        'border-radius': '10px'
    },
    
    '.reveal h1 > a': {
        'text-shadow': 'none',
        'padding-bottom': '20px',
        'border-bottom': 'dotted 10px'
    }
});