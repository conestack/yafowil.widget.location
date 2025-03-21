var yafowil_location = (function (exports, $$1) {
    'use strict';

    class LocationWidgetMarkerPopup {
        constructor(widget, marker) {
            this.widget = widget;
            this.marker = marker;
            this.create_popup();
        }
        create_popup() {
            let popup = document.createElement('a');
            popup.href = "#";
            popup.innerHTML = "Remove";
            popup.onclick = this.remove_handle.bind(this);
            this.marker.bindPopup(popup);
        }
        remove_handle() {
            let widget = this.widget;
            widget.markers.removeLayer(this.marker);
            widget.lat = '';
            widget.lon = '';
            widget.zoom = '';
            return false;
        }
    }
    class LocationWidgetMarker {
        constructor(widget, lat, lon) {
            this.widget = widget;
            let marker = new L.Marker([lat, lon], {draggable: true});
            marker.addTo(widget.markers);
            if (this.widget.disable_interaction) {
                return;
            }
            new LocationWidgetMarkerPopup(widget, marker);
            marker.on('dragend', this.dragend_handle.bind(this));
        }
        dragend_handle(evt) {
            let latlng = evt.target._latlng,
                widget = this.widget;
            widget.lat = latlng.lat;
            widget.lon = latlng.lng;
            widget.zoom = widget.map.getZoom();
        }
    }
    class LocationWidgetSearch {
        constructor(widget) {
            this.widget = widget;
            let geosearch = this.geosearch = new GeoSearch.GeoSearchControl({
                provider: new GeoSearch.OpenStreetMapProvider(),
                style: 'bar',
                autoClose: true
            });
            widget.map.addControl(geosearch);
            widget.map.on(
                'geosearch/showlocation',
                this.showloaction_handle.bind(this)
            );
        }
        showloaction_handle(result) {
            let location = result.location,
                lat = location.y,
                lon = location.x,
                widget = this.widget;
            widget.markers.clearLayers();
            this.widget.create_marker(lat, lon);
            widget.lat = lat;
            widget.lon = lon;
        }
    }
    class LocationWidget {
        static initialize(context) {
            $$1('div.location-map', context).each(function() {
                if (window.yafowil_array !== undefined &&
                    window.yafowil_array.inside_template($$1(this))) {
                    return;
                }
                let options = {
                    disable_interaction: $$1(this).data('disable_interaction')
                };
                new LocationWidget($$1(this), options);
            });
        }
        constructor(elem, options) {
            elem.data('yafowil-location', this);
            this.elem = elem;
            this.disable_interaction = options.disable_interaction;
            this.id = elem.attr('id');
            let wrapper = elem.parent();
            this._input_lat = $$1('input.location-lat', wrapper);
            this._input_lon = $$1('input.location-lon', wrapper);
            this._input_zoom = $$1('input.location-zoom', wrapper);
            this.change_lat_handle = this.change_lat_handle.bind(this);
            this._input_lat.on('change', this.change_lat_handle);
            this.change_lon_handle = this.change_lon_handle.bind(this);
            this._input_lon.on('change', this.change_lon_handle);
            this.min_zoom = elem.data('min_zoom');
            this.max_zoom = elem.data('max_zoom');
            this.tile_layers = elem.data('tile_layers');
            this._lat = elem.data('lat');
            this._lon = elem.data('lon');
            this._zoom = elem.data('zoom');
            this.value = this.elem.data('value');
            this.create_map();
            if (!this.disable_interaction) {
                new LocationWidgetSearch(this);
            }
        }
        get value() {
            return this._value;
        }
        set value(val) {
            this._value = val;
            if (val) {
                if (val.lat !== undefined && val.lon !== undefined) {
                    this._lat = val.lat;
                    this._lon = val.lon;
                }
                if (val.zoom !== undefined) {
                    this._zoom = val.zoom;
                }
            }
        }
        get lat() {
            return this._lat;
        }
        set lat(val) {
            this._lat = val;
            this._input_lat.val(val);
        }
        get lon() {
            return this._lon;
        }
        set lon(val) {
            this._lon = val;
            this._input_lon.val(val);
        }
        get zoom() {
            return this._zoom;
        }
        set zoom(val) {
            this._zoom = val;
            this._input_zoom.val(val);
        }
        create_marker(lat, lon) {
            return new LocationWidgetMarker(this, lat, lon);
        }
        create_map() {
            let map = this.map = new L.Map(this.id);
            this.map.setView([this.lat, this.lon], this.zoom);
            for (let layer of this.tile_layers) {
                layer.options.minZoom = this.min_zoom;
                layer.options.maxZoom = this.max_zoom;
                new L.TileLayer(layer.urlTemplate, layer.options).addTo(map);
            }
            let markers = this.markers = new L.FeatureGroup();
            map.addLayer(markers);
            if (this.value) {
                this.create_marker(this.lat, this.lon);
            }
            map.on('click', this.click_handle.bind(this));
        }
        click_handle(evt) {
            if (this.disable_interaction) {
                return;
            }
            this.markers.clearLayers();
            let latlng = evt.latlng;
            this.create_marker(latlng.lat, latlng.lng);
            this.lat = latlng.lat;
            this.lon = latlng.lng;
            this.zoom = this.map.getZoom();
        }
        change_val(elem, name) {
            if (this.disable_interaction) {
                return;
            }
            let val = parseFloat(elem.val());
            if (isNaN(val)) {
                elem.val(this[name]);
                return;
            }
            this[name] = val;
            this.markers.clearLayers();
            this.create_marker(this.lat, this.lon);
            this.map.setView([this.lat, this.lon], this.zoom);
        }
        change_lat_handle(evt) {
            evt.preventDefault();
            this.change_val($$1(evt.currentTarget), '_lat');
        }
        change_lon_handle(evt) {
            evt.preventDefault();
            this.change_val($$1(evt.currentTarget), '_lon');
        }
    }

    const locationIcon = L.divIcon({
        html: '<i class="bi bi-geo-alt-fill custom-marker"></i>',
        className: 'leaflet-div-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });
    class BS5LocationWidgetMarker {
        constructor(widget, lat, lon) {
            this.widget = widget;
            let marker = new L.Marker([lat, lon], {icon: locationIcon}, {draggable: true});
            marker.addTo(widget.markers);
            if (this.widget.disable_interaction) {
                return;
            }
            new LocationWidgetMarkerPopup(widget, marker);
            marker.on('dragend', this.dragend_handle.bind(this));
        }
        dragend_handle(evt) {
            let latlng = evt.target._latlng,
                widget = this.widget;
            widget.lat = latlng.lat;
            widget.lon = latlng.lng;
            widget.zoom = widget.map.getZoom();
        }
    }
    class BS5LocationWidget extends LocationWidget {
        static initialize(context) {
            $('div.location-map', context).each(function() {
                if (window.yafowil_array !== undefined &&
                    window.yafowil_array.inside_template($(this))) {
                    return;
                }
                let options = {
                    disable_interaction: $(this).data('disable_interaction')
                };
                new BS5LocationWidget($(this), options);
            });
        }
        constructor(elem, options) {
            super(elem, options);
        }
        create_marker(lat, lon) {
            return new BS5LocationWidgetMarker(this, lat, lon);
        }
    }
    function location_on_array_add(inst, context) {
        BS5LocationWidget.initialize(context);
    }
    function register_array_subscribers() {
        if (window.yafowil_array === undefined) {
            return;
        }
        window.yafowil_array.on_array_event('on_add', location_on_array_add);
    }

    $$1(function() {
        if (window.ts !== undefined) {
            ts.ajax.register(BS5LocationWidget.initialize, true);
        } else if (window.bdajax !== undefined) {
            bdajax.register(BS5LocationWidget.initialize, true);
        } else {
            BS5LocationWidget.initialize();
        }
        register_array_subscribers();
    });

    exports.BS5LocationWidget = BS5LocationWidget;
    exports.BS5LocationWidgetMarker = BS5LocationWidgetMarker;
    exports.register_array_subscribers = register_array_subscribers;

    Object.defineProperty(exports, '__esModule', { value: true });


    window.yafowil = window.yafowil || {};
    window.yafowil.location = exports;


    return exports;

})({}, jQuery);
