import $ from 'jquery';

export class LocationWidgetMarkerPopup {

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

export class LocationWidgetMarker {

    constructor(widget, lat, lon) {
        this.widget = widget;
        let marker = new L.Marker([lat, lon], {draggable: true});
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

export class LocationWidgetSearch {

    constructor(widget) {
        this.widget = widget;
        // add geosearch widget
        let geosearch = this.geosearch = new GeoSearch.GeoSearchControl({
            provider: new GeoSearch.OpenStreetMapProvider(),
            style: 'bar',
            autoClose: true
        });
        widget.map.addControl(geosearch);
        // show result label on geo search submit and focus map
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

export class LocationWidget {

    static initialize(context) {
        $('div.location-map', context).each(function() {
            if ($(this).parents('.arraytemplate').length) {
                return;
            }
            new LocationWidget($(this));
        });
    }

    constructor(elem) {
        elem.data('yafowil-location', this);
        this.elem = elem;
        this.id = elem.attr('id');
        // form inputs
        let wrapper = elem.parent();
        this._input_lat = $('input.location-lat', wrapper);
        this._input_lon = $('input.location-lon', wrapper);
        this._input_zoom = $('input.location-zoom', wrapper);
        // input handles
        this.change_lat_handle = this.change_lat_handle.bind(this);
        this._input_lat.on('change', this.change_lat_handle);
        this.change_lon_handle = this.change_lon_handle.bind(this);
        this._input_lon.on('change', this.change_lon_handle);
        // settings
        this.min_zoom = elem.data('min_zoom');
        this.max_zoom = elem.data('max_zoom');
        this.tile_layers = elem.data('tile_layers');
        // default value
        this._lat = elem.data('lat');
        this._lon = elem.data('lon');
        this._zoom = elem.data('zoom');
        // current value
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
        // create map
        let map = this.map = new L.Map(this.id);
        this.map.setView([this.lat, this.lon], this.zoom);
        // create tile layers
        for (let layer of this.tile_layers) {
            layer.options.minZoom = this.min_zoom;
            layer.options.maxZoom = this.max_zoom;
            new L.TileLayer(layer.urlTemplate, layer.options).addTo(map);
        }
        // create markers feature group
        let markers = this.markers = new L.FeatureGroup();
        map.addLayer(markers);
        // add marker if value given
        if (this.value) {
            new LocationWidgetMarker(this, this.lat, this.lon);
        }
        // add or move marker on map click
        map.on('click', this.click_handle.bind(this));
    }

    click_handle(evt) {
        // XXX: confirmation dialog
        this.markers.clearLayers();
        let latlng = evt.latlng;
        new LocationWidgetMarker(this, latlng.lat, latlng.lng);
        this.lat = latlng.lat;
        this.lon = latlng.lng;
        this.zoom = this.map.getZoom();
    }

    change_val(elem, name) {
        let val = parseFloat(elem.val());
        if (isNaN(val)) {
            elem.val(this[name]);
            return;
        }
        this[name] = val;
        this.markers.clearLayers();
        new LocationWidgetMarker(this, this.lat, this.lon);
        this.map.setView([this.lat, this.lon], this.zoom);
    }

    change_lat_handle(evt) {
        evt.preventDefault();
        this.change_val($(evt.currentTarget), '_lat');
    }

    change_lon_handle(evt) {
        evt.preventDefault();
        this.change_val($(evt.currentTarget), '_lon');
    }
}

//////////////////////////////////////////////////////////////////////////////
// yafowil.widget.array integration
//////////////////////////////////////////////////////////////////////////////

function location_on_array_add(inst, context) {
    LocationWidget.initialize(context);
}

export function register_array_subscribers() {
    if (window.yafowil_array === undefined) {
        return;
    }
    window.yafowil_array.on_array_event('on_add', location_on_array_add);
}
