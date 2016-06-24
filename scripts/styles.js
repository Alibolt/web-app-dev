/**
 * Style hacks for the presentations.
 * Uses Swirl (https://github.com/karimsa/swirl).
 */

window.style=(function(s,w,i,r,l){'use strict';w=new Style;w.tag.parentElement.removeChild(w.tag),document.body.appendChild(w.tag);for(i in s)if(s.hasOwnProperty(i)){w.attach(r=(new Rule).apply(i));for(l in s[i])s[i].hasOwnProperty(l)&&r[l](s[i][l])};return w}({
    '.pull-right': {
        float: 'right'
    },

    '.pull-left': {
        float: 'left'
    },

    '.clearfix': {
        clear: 'both'
    },
    
    '.padded-bottom': {
        'marginBottom': '50px'
    }
}));