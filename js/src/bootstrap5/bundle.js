import $ from 'jquery';

import {BS5LocationWidget} from './widget.js';
import {register_array_subscribers} from './widget.js';

export * from './widget.js';

$(function() {
    if (window.ts !== undefined) {
        ts.ajax.register(BS5LocationWidget.initialize, true);
    } else if (window.bdajax !== undefined) {
        bdajax.register(BS5LocationWidget.initialize, true);
    } else {
        BS5LocationWidget.initialize();
    }
    register_array_subscribers();
});
