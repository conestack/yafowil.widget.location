(function (exports, $) {
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
            let marker = new L.marker([lat, lon], {draggable: true});
            marker.addTo(widget.markers);
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
            new LocationWidgetMarker(widget, lat, lon);
            widget.lat = lat;
            widget.lon = lon;
        }
    }
    class LocationWidget {
        static initialize(context) {
            $('div.location-map', context).each(function() {
                new LocationWidget($(this));
            });
        }
        constructor(elem) {
            this.elem = elem;
            this.id = elem.attr('id');
            let wrapper = elem.parent();
            this._input_lat = $('input.location-lat', wrapper);
            this._input_lon = $('input.location-lon', wrapper);
            this._input_zoom = $('input.location-zoom', wrapper);
            this.min_zoom = elem.data('min_zoom');
            this.max_zoom = elem.data('max_zoom');
            this._lat = elem.data('lat');
            this._lon = elem.data('lon');
            this._zoom = elem.data('zoom');
            this.value = this.elem.data('value');
            this.create_map();
            new LocationWidgetSearch(this);
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
        create_map() {
            let osm = 'Map data © <a href="http://openstreetmap.org">OSM</a>';
            let map = this.map = new L.map(this.id);
            this.map.setView([this.lat, this.lon], this.zoom);
            let tiles = new L.tileLayer(
                '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                {
                    attribution: osm,
                    minZoom: this.min_zoom,
                    maxZoom: this.max_zoom
                });
            tiles.addTo(map);
            let markers = this.markers = new L.FeatureGroup();
            map.addLayer(markers);
            if (this.value) {
                new LocationWidgetMarker(this, this.lat, this.lon);
            }
            map.on('click', this.click_handle.bind(this));
        }
        click_handle(evt) {
            this.markers.clearLayers();
            let latlng = evt.latlng;
            new LocationWidgetMarker(this, latlng.lat, latlng.lng);
            this.lat = latlng.lat;
            this.lon = latlng.lng;
            this.zoom = this.map.getZoom();
        }
    }

    $(function() {
        if (window.ts !== undefined) {
            ts.ajax.register(LocationWidget.initialize, true);
        } else {
            LocationWidget.initialize();
        }
    });

    exports.LocationWidget = LocationWidget;
    exports.LocationWidgetMarker = LocationWidgetMarker;
    exports.LocationWidgetMarkerPopup = LocationWidgetMarkerPopup;
    exports.LocationWidgetSearch = LocationWidgetSearch;

    Object.defineProperty(exports, '__esModule', { value: true });


    if (window.yafowil === undefined) {
        window.yafowil = {};
    }
    window.yafowil.location = exports;


    return exports;

})({}, jQuery);
//# sourceMappingURL=widget.js.map
