import { overviewMap,section3Scrolly } from './section3.js';

import { section4Scrolly } from './section4.js';
import { section5Scrolly, overviewMap2 } from './section5.js';


window.onload=function(){
    setTimeout(function(){
        setTimeout(function(){
        $('#load-icon').hide();
        // $('#plot-2-svg').hide();
        }, 2000);
        overviewMap();
        section3Scrolly();
        section4Scrolly();
        section5Scrolly();
        overviewMap2();
    },5000);
}