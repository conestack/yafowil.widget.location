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
            new LocationWidget($(this));
        });
    }

    constructor(elem) {
        this.elem = elem;
        this.id = elem.attr('id');
        // form inputs
        let wrapper = elem.parent();
        this._input_lat = $('input.location-lat', wrapper);
        this._input_lon = $('input.location-lon', wrapper);
        this._input_zoom = $('input.location-zoom', wrapper);
        // settings
        this.min_zoom = elem.data('min_zoom');
        this.max_zoom = elem.data('max_zoom');
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
        let osm = 'Map data © <a href="http://openstreetmap.org">OSM</a>';
        let map = this.map = new L.map(this.id);
        this.map.setView([this.lat, this.lon], this.zoom);
        // set OSM tiles
        let tiles = new L.tileLayer(
            '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                attribution: osm,
                minZoom: this.min_zoom,
                maxZoom: this.max_zoom
            });
        tiles.addTo(map);
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
}
