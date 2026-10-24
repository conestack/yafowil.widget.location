import $ from 'jquery';

function create_map_dom(data = {}) {
    const wrapper = $('<div />').appendTo('body');
    const el = $('<div />')
        .addClass('location-map')
        .attr('id', 'leafletmap')
        .data('lat', 40)
        .data('lon', 20)
        .data('max_zoom', 18)
        .data('min_zoom', 2)
        .data('zoom', 14)
        .data('tile_layers', [])
        .appendTo(wrapper);
    for (const [key, value] of Object.entries(data)) {
        el.data(key, value);
    }
    $('<input />').addClass('location-lat').appendTo(wrapper);
    $('<input />').addClass('location-lon').appendTo(wrapper);
    $('<input />').addClass('location-zoom').appendTo(wrapper);
    return wrapper;
}

QUnit.module('LocationWidget', (hooks) => {
    let LocationWidget, register_array_subscribers;
    let wrapper, widget;

    hooks.before(async () => {
        // import magic
        const L = await import('leaflet');
        window.L = L;

        await import('leaflet-geosearch');

        const modules = await import('../src/default/widget.js');
        LocationWidget = modules.LocationWidget;
        register_array_subscribers = modules.register_array_subscribers;
    });

    hooks.afterEach(() => {
        if (widget) {
            widget.map.remove();
            widget = null;
        }
        if (wrapper) {
            wrapper.remove();
            wrapper = null;
        }
    });

    function create_widget(data = {}) {
        wrapper = create_map_dom(data);
        const el = $('div.location-map', wrapper);
        widget = new LocationWidget(el, {
            disable_interaction: el.data('disable_interaction'),
        });
        return widget;
    }

    function marker_layers() {
        return widget.markers.getLayers();
    }

    QUnit.test('test', (assert) => {
        const el = $('<div />')
            .addClass('location-map')
            .attr('id', 'leafletmap')
            .data('lat', 40)
            .data('lon', 20)
            .data('max_zoom', 18)
            .data('min_zoom', 2)
            .data('zoom', 14)
            .data('tile_layers', [
                {
                    urlTemplate: '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    options: {
                        attribution:
                            'Map data © &lt;a href="http://openstreetmap.org"&gt;OSM&lt;/a&gt;',
                    },
                },
            ])
            .appendTo('body');

        LocationWidget.initialize();
        let widget = el.data('yafowil-location');
        assert.ok(widget);

        widget = null;
        el.remove();
    });

    QUnit.test('register_array_subscribers', (assert) => {
        const _array_subscribers = {
            on_add: [],
        };

        // return if window.yafowil === undefined
        register_array_subscribers();
        assert.deepEqual(_array_subscribers.on_add, []);

        // patch yafowil_array
        window.yafowil_array = {
            on_array_event: (evt_name, evt_function) => {
                _array_subscribers[evt_name] = evt_function;
            },
            inside_template(elem) {
                return elem.parents('.arraytemplate').length > 0;
            },
        };
        register_array_subscribers();

        // create table DOM
        const table = $('<table />').append($('<tr />')).append($('<td />')).appendTo('body');

        const el = $('<div />')
            .addClass('location-map')
            .attr('id', 'leafletmap')
            .data('lat', 40)
            .data('lon', 20)
            .data('max_zoom', 18)
            .data('min_zoom', 2)
            .data('zoom', 14)
            .data('tile_layers', [
                {
                    urlTemplate: '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    options: {
                        attribution:
                            'Map data © &lt;a href="http://openstreetmap.org"&gt;OSM&lt;/a&gt;',
                    },
                },
            ]);
        $('td', table).addClass('arraytemplate');
        el.appendTo($('td', table));

        // invoke array on_add - returns
        _array_subscribers.on_add.apply(null, $('tr', table));
        let widget = el.data('yafowil-location');
        assert.notOk(widget);
        $('td', table).removeClass('arraytemplate');

        // invoke array on_add

        _array_subscribers.on_add.apply(null, $('tr', table));
        widget = el.data('yafowil-location');
        assert.ok(widget);

        table.remove();
        window.yafowil_array = undefined;
    });
    QUnit.test('constructor without value', (assert) => {
        create_widget();
        assert.strictEqual(widget.elem.data('yafowil-location'), widget);
        assert.strictEqual(widget.id, 'leafletmap');
        assert.strictEqual(widget.value, undefined);
        assert.strictEqual(widget.lat, 40);
        assert.strictEqual(widget.lon, 20);
        assert.strictEqual(widget.zoom, 14);
        assert.strictEqual(widget.min_zoom, 2);
        assert.strictEqual(widget.max_zoom, 18);
        assert.strictEqual(marker_layers().length, 0);
        assert.strictEqual($('.leaflet-geosearch-bar form', wrapper).length, 1);
    });

    QUnit.test('constructor with value', (assert) => {
        create_widget({ value: { lat: 1, lon: 2, zoom: 3 } });
        assert.deepEqual(widget.value, { lat: 1, lon: 2, zoom: 3 });
        assert.strictEqual(widget.lat, 1);
        assert.strictEqual(widget.lon, 2);
        assert.strictEqual(widget.zoom, 3);
        const markers = marker_layers();
        assert.strictEqual(markers.length, 1);
        assert.deepEqual(markers[0].getLatLng(), L.latLng(1, 2));
    });

    QUnit.test('value without coordinates or zoom', (assert) => {
        create_widget({ value: { zoom: 5 } });
        assert.strictEqual(widget.lat, 40);
        assert.strictEqual(widget.lon, 20);
        assert.strictEqual(widget.zoom, 5);

        widget.value = { lat: 1 };
        assert.strictEqual(widget.lat, 40);
        assert.strictEqual(widget.lon, 20);
        assert.strictEqual(widget.zoom, 5);

        widget.value = { lat: 1, lon: 2 };
        assert.strictEqual(widget.lat, 1);
        assert.strictEqual(widget.lon, 2);
        assert.strictEqual(widget.zoom, 5);

        widget.value = null;
        assert.strictEqual(widget.value, null);
        assert.strictEqual(widget.lat, 1);
    });

    QUnit.test('setters update inputs', (assert) => {
        create_widget();
        widget.lat = 5;
        widget.lon = 6;
        widget.zoom = 7;
        assert.strictEqual(widget.lat, 5);
        assert.strictEqual(widget.lon, 6);
        assert.strictEqual(widget.zoom, 7);
        assert.strictEqual($('input.location-lat', wrapper).val(), '5');
        assert.strictEqual($('input.location-lon', wrapper).val(), '6');
        assert.strictEqual($('input.location-zoom', wrapper).val(), '7');
    });

    QUnit.test('map click', (assert) => {
        create_widget({ value: { lat: 1, lon: 2 } });
        assert.strictEqual(marker_layers().length, 1);

        widget.map.fire('click', { latlng: L.latLng(10, 11) });
        const markers = marker_layers();
        assert.strictEqual(markers.length, 1);
        assert.deepEqual(markers[0].getLatLng(), L.latLng(10, 11));
        assert.strictEqual(widget.lat, 10);
        assert.strictEqual(widget.lon, 11);
        assert.strictEqual(widget.zoom, widget.map.getZoom());
        assert.strictEqual($('input.location-lat', wrapper).val(), '10');
        assert.strictEqual($('input.location-lon', wrapper).val(), '11');
        assert.strictEqual($('input.location-zoom', wrapper).val(), `${widget.map.getZoom()}`);
    });

    QUnit.test('marker popup removes marker', (assert) => {
        create_widget({ value: { lat: 1, lon: 2, zoom: 3 } });
        const marker = marker_layers()[0];
        const link = marker.getPopup().getContent();
        assert.strictEqual(link.tagName, 'A');
        assert.strictEqual(link.innerHTML, 'Remove');

        assert.false(link.onclick());
        assert.strictEqual(marker_layers().length, 0);
        assert.strictEqual(widget.lat, '');
        assert.strictEqual(widget.lon, '');
        assert.strictEqual(widget.zoom, '');
        assert.strictEqual($('input.location-lat', wrapper).val(), '');
        assert.strictEqual($('input.location-lon', wrapper).val(), '');
        assert.strictEqual($('input.location-zoom', wrapper).val(), '');
    });

    QUnit.test('marker dragend', (assert) => {
        create_widget({ value: { lat: 1, lon: 2, zoom: 3 } });
        const marker = marker_layers()[0];
        assert.true(marker.options.draggable);

        marker.setLatLng([3, 4]);
        marker.fire('dragend');
        assert.strictEqual(widget.lat, 3);
        assert.strictEqual(widget.lon, 4);
        assert.strictEqual(widget.zoom, widget.map.getZoom());
    });

    QUnit.test('geosearch show location', (assert) => {
        create_widget({ value: { lat: 1, lon: 2, zoom: 3 } });
        widget.map.fire('geosearch/showlocation', { location: { x: 7, y: 8 } });
        const markers = marker_layers();
        assert.strictEqual(markers.length, 1);
        assert.deepEqual(markers[0].getLatLng(), L.latLng(8, 7));
        assert.strictEqual(widget.lat, 8);
        assert.strictEqual(widget.lon, 7);
        assert.strictEqual($('input.location-lat', wrapper).val(), '8');
        assert.strictEqual($('input.location-lon', wrapper).val(), '7');
    });

    QUnit.test('change lat and lon inputs', (assert) => {
        create_widget();
        const input_lat = $('input.location-lat', wrapper);
        const input_lon = $('input.location-lon', wrapper);

        input_lat.val('12.5').trigger('change');
        assert.strictEqual(widget.lat, 12.5);
        let markers = marker_layers();
        assert.strictEqual(markers.length, 1);
        assert.deepEqual(markers[0].getLatLng(), L.latLng(12.5, 20));

        input_lon.val('21.5').trigger('change');
        assert.strictEqual(widget.lon, 21.5);
        markers = marker_layers();
        assert.strictEqual(markers.length, 1);
        assert.deepEqual(markers[0].getLatLng(), L.latLng(12.5, 21.5));
        assert.strictEqual(widget.map.getZoom(), 14);

        // invalid input resets value
        input_lat.val('abc').trigger('change');
        assert.strictEqual(input_lat.val(), '12.5');
        assert.strictEqual(widget.lat, 12.5);

        input_lon.val('').trigger('change');
        assert.strictEqual(input_lon.val(), '21.5');
        assert.strictEqual(widget.lon, 21.5);
    });

    QUnit.test('disable interaction', (assert) => {
        create_widget({
            disable_interaction: true,
            value: { lat: 1, lon: 2, zoom: 3 },
        });
        assert.true(widget.disable_interaction);
        assert.strictEqual($('.leaflet-geosearch-bar form', wrapper).length, 0);

        const marker = marker_layers()[0];
        assert.strictEqual(marker.getPopup(), undefined);

        widget.map.fire('click', { latlng: L.latLng(10, 11) });
        assert.deepEqual(marker_layers(), [marker]);
        assert.strictEqual(widget.lat, 1);
        assert.strictEqual(widget.lon, 2);

        $('input.location-lat', wrapper).val('12').trigger('change');
        assert.deepEqual(marker_layers(), [marker]);
        assert.strictEqual(widget.lat, 1);
        assert.strictEqual($('input.location-lat', wrapper).val(), '12');
    });
});

QUnit.module('BS5LocationWidget', (hooks) => {
    let BS5LocationWidget, BS5LocationWidgetMarker, register_array_subscribers;
    let wrapper, widget, orig_global_jquery;

    hooks.before(async () => {
        const L = await import('leaflet');
        window.L = L;

        await import('leaflet-geosearch');

        const modules = await import('../src/bootstrap5/widget.js');
        BS5LocationWidget = modules.BS5LocationWidget;
        BS5LocationWidgetMarker = modules.BS5LocationWidgetMarker;
        register_array_subscribers = modules.register_array_subscribers;
    });

    hooks.beforeEach(() => {
        orig_global_jquery = window.$;
    });

    hooks.afterEach(() => {
        window.$ = orig_global_jquery;
        window.yafowil_array = undefined;
        if (widget) {
            widget.map.remove();
            widget = null;
        }
        if (wrapper) {
            wrapper.remove();
            wrapper = null;
        }
    });

    function marker_layers() {
        return widget.markers.getLayers();
    }

    QUnit.test('initialize', (assert) => {
        wrapper = create_map_dom({ value: { lat: 1, lon: 2, zoom: 3 } });
        BS5LocationWidget.initialize();
        widget = $('div.location-map', wrapper).data('yafowil-location');
        assert.true(widget instanceof BS5LocationWidget);
        assert.strictEqual(widget.lat, 1);
        assert.strictEqual(widget.lon, 2);
        assert.strictEqual(widget.zoom, 3);
        assert.strictEqual($('.leaflet-geosearch-bar form', wrapper).length, 1);

        const markers = marker_layers();
        assert.strictEqual(markers.length, 1);
        const marker = markers[0];
        assert.deepEqual(marker.getLatLng(), L.latLng(1, 2));
        assert.strictEqual(marker.options.icon.options.className, 'leaflet-div-icon');
        assert.strictEqual(
            marker.options.icon.options.html,
            '<i class="bi bi-geo-alt-fill custom-marker"></i>',
        );
        assert.strictEqual(marker.getPopup().getContent().innerHTML, 'Remove');

        assert.true(widget.create_marker(5, 6) instanceof BS5LocationWidgetMarker);
    });

    QUnit.test('initialize skips array template', (assert) => {
        wrapper = create_map_dom();
        window.yafowil_array = {
            inside_template: () => true,
        };
        BS5LocationWidget.initialize(wrapper);
        assert.strictEqual($('div.location-map', wrapper).data('yafowil-location'), undefined);
    });

    QUnit.test('initialize without global jQuery', (assert) => {
        // global ``$`` is not available with ``jQuery.noConflict()``
        window.$ = undefined;
        wrapper = create_map_dom();
        BS5LocationWidget.initialize(wrapper);
        widget = $('div.location-map', wrapper).data('yafowil-location');
        assert.true(widget instanceof BS5LocationWidget);
    });

    QUnit.test('marker dragend', (assert) => {
        wrapper = create_map_dom({ value: { lat: 1, lon: 2, zoom: 3 } });
        BS5LocationWidget.initialize(wrapper);
        widget = $('div.location-map', wrapper).data('yafowil-location');
        const marker = marker_layers()[0];
        assert.true(marker.options.draggable);
        assert.true(marker.dragging.enabled());

        marker.setLatLng([3, 4]);
        marker.fire('dragend');
        assert.strictEqual(widget.lat, 3);
        assert.strictEqual(widget.lon, 4);
        assert.strictEqual(widget.zoom, widget.map.getZoom());
        assert.strictEqual($('input.location-lat', wrapper).val(), '3');
        assert.strictEqual($('input.location-lon', wrapper).val(), '4');
    });

    QUnit.test('disable interaction', (assert) => {
        wrapper = create_map_dom({
            disable_interaction: true,
            value: { lat: 1, lon: 2, zoom: 3 },
        });
        BS5LocationWidget.initialize(wrapper);
        widget = $('div.location-map', wrapper).data('yafowil-location');
        assert.true(widget.disable_interaction);
        assert.strictEqual($('.leaflet-geosearch-bar form', wrapper).length, 0);

        const marker = marker_layers()[0];
        assert.strictEqual(marker.getPopup(), undefined);

        marker.setLatLng([3, 4]);
        marker.fire('dragend');
        assert.strictEqual(widget.lat, 1);
        assert.strictEqual(widget.lon, 2);
    });

    QUnit.test('register_array_subscribers', (assert) => {
        const subscribers = {};

        // returns if window.yafowil_array is undefined
        register_array_subscribers();
        assert.deepEqual(subscribers, {});

        window.yafowil_array = {
            on_array_event: (evt_name, evt_function) => {
                subscribers[evt_name] = evt_function;
            },
            inside_template: () => false,
        };
        register_array_subscribers();
        assert.deepEqual(Object.keys(subscribers), ['on_add']);

        wrapper = create_map_dom();
        subscribers.on_add({}, wrapper);
        widget = $('div.location-map', wrapper).data('yafowil-location');
        assert.true(widget instanceof BS5LocationWidget);
    });
});
