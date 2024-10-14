import {LocationWidgetMarkerPopup} from '../widget.js';
import {LocationWidget} from '../widget.js';

const locationIcon = L.divIcon({
    html: '<i class="bi bi-geo-alt-fill custom-marker"></i>',
    className: 'leaflet-div-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

export class BS5LocationWidgetMarker {

    constructor(widget, lat, lon) {
        this.widget = widget;
        let marker = new L.Marker([lat, lon], {icon: locationIcon}, {draggable: true});
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

export class BS5LocationWidget extends LocationWidget {

    static initialize(context) {
        $('div.location-map', context).each(function() {
            if (window.yafowil_array !== undefined &&
                window.yafowil_array.inside_template($(this))) {
                return;
            }
            new BS5LocationWidget($(this));
        });
    }

    constructor(elem) {
        super(elem);
    }

    create_marker(lat, lon) {
        console.log('XXXX')
        return new BS5LocationWidgetMarker(this, lat, lon);
    }
}

//////////////////////////////////////////////////////////////////////////////
// yafowil.widget.array integration
//////////////////////////////////////////////////////////////////////////////

function location_on_array_add(inst, context) {
    BS5LocationWidget.initialize(context);
}

export function register_array_subscribers() {
    if (window.yafowil_array === undefined) {
        return;
    }
    window.yafowil_array.on_array_event('on_add', location_on_array_add);
}
