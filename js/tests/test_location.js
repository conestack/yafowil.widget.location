import $ from 'jquery';

QUnit.module('LocationWidget', hooks => {
    let LocationWidget, register_array_subscribers;

    hooks.before(async () => {
        // import magic
        const L = await import('leaflet');
        window.L = L;

        await import('leaflet-geosearch');

        const modules = await import('../src/default/widget.js');
        LocationWidget = modules.LocationWidget;
        register_array_subscribers = modules.register_array_subscribers;
    });

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

        widget = null;
        el.remove();
    });


    QUnit.test('register_array_subscribers', assert => {
        let _array_subscribers = {
            on_add: []
        };

        // return if window.yafowil === undefined
        register_array_subscribers();
        assert.deepEqual(_array_subscribers['on_add'], []);

        // patch yafowil_array
        window.yafowil_array = {
            on_array_event: function(evt_name, evt_function) {
                _array_subscribers[evt_name] = evt_function;
            },
            inside_template(elem) {
                return elem.parents('.arraytemplate').length > 0;
            }
        };
        register_array_subscribers();

        // create table DOM
        let table = $('<table />')
            .append($('<tr />'))
            .append($('<td />'))
            .appendTo('body');

        let el = $('<div />').addClass('location-map').attr('id', 'leafletmap')
            .data('lat', 40).data('lon', 20)
            .data('max_zoom', 18).data('min_zoom', 2)
            .data('zoom', 14)
            .data('tile_layers', [{
                urlTemplate: '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                options: {
                    attribution: 'Map data © &lt;a href="http://openstreetmap.org"&gt;OSM&lt;/a&gt;'
                }
            }]);
        $('td', table).addClass('arraytemplate');
        el.appendTo($('td', table));

        // invoke array on_add - returns
        _array_subscribers['on_add'].apply(null, $('tr', table));
        let widget = el.data('yafowil-location');
        assert.notOk(widget);
        $('td', table).removeClass('arraytemplate');

        // invoke array on_add

        _array_subscribers['on_add'].apply(null, $('tr', table));
        widget = el.data('yafowil-location');
        assert.ok(widget);

        table.remove();
        window.yafowil_array = undefined;
    });
});
