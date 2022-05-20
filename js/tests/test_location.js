import { LocationWidget } from "../src/widget.js";

QUnit.test('test', assert => {
    let el = $('<div />').addClass('location-map').attr('id', 'leafletmap')
        .data('lat', 40).data('lon', 20)
        .data('max_zoom', 18).data('min_zoom', 2)
        .data('zoom', 14)
        .data('tile_layers', [{
            urlTemplate: '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            options: {
                attribution: 'Map data © &lt;a href="http://openstreetmap.org"&gt;OSM&lt;/a&gt;'
            }
        }])
        .appendTo('body');

    LocationWidget.initialize();
    let widget = el.data('yafowil-location');
    assert.ok(widget);
});