import { LocationWidget } from "../src/widget.js";

QUnit.test('test', assert => {
    let el = $('<div />').addClass('location-map').appendTo('body');
    LocationWidget.initialize();
    let widget = el.data('location');
    assert.ok(widget);
});