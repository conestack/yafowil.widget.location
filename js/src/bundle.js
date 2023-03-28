import $ from 'jquery';

import {LocationWidget} from './widget.js';
import {register_array_subscribers} from './widget.js';

export * from './widget.js';

$(function() {
    if (window.ts !== undefined) {
        ts.ajax.register(LocationWidget.initialize, true);
    } else if (window.bdajax !== undefined) {
        bdajax.register(LocationWidget.initialize, true);
    } else {
        LocationWidget.initialize();
    }
    register_array_subscribers();
});
