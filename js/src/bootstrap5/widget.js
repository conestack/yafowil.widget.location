import {LocationWidgetMarkerPopup} from '../default/widget.js';
import {LocationWidget} from '../default/widget.js';

const locationIcon = L.divIcon({
    html: '<i class="bi bi-geo-alt-fill custom-marker"></i>',
    className: 'leaflet-div-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

export class BS5LocationWidgetMarker {

    /**
     * Creates a new marker at the specified latitude and longitude.
     * 
     * @param {BS5LocationWidget} widget - The location widget to which this
     *                                     marker belongs.
     * @param {number} lat - The latitude of the marker.
     * @param {number} lon - The longitude of the marker.
     */
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

    /**
     * Handles the drag end event of the marker, updating the widget's
     * latitude and longitude.
     * 
     * @param {Event} evt - The dragend event.
     */
    dragend_handle(evt) {
        let latlng = evt.target._latlng,
            widget = this.widget;
        widget.lat = latlng.lat;
        widget.lon = latlng.lng;
        widget.zoom = widget.map.getZoom();
    }
}

export class BS5LocationWidget extends LocationWidget {

    /**
     * Initializes each widget in the given DOM context.
     * 
     * @param {jQuery} context - DOM context for initialization.
     */
    static initialize(context) {
        $('div.location-map', context).each(function() {
            if (window.yafowil_array !== undefined &&
                window.yafowil_array.inside_template($(this))) {
                return;
            }
            let options = {
                disable_interaction: $(this).data('disable_interaction')
            }
            new BS5LocationWidget($(this), options);
        });
    }

    constructor(elem, options) {
        super(elem, options);
    }

    /**
     * Creates a new location marker at the specified latitude and longitude.
     * 
     * @param {number} lat - The latitude of the marker.
     * @param {number} lon - The longitude of the marker.
     * @returns {BS5LocationWidgetMarker} - The newly created marker.
     */
    create_marker(lat, lon) {
        return new BS5LocationWidgetMarker(this, lat, lon);
    }
}

//////////////////////////////////////////////////////////////////////////////
// yafowil.widget.array integration
//////////////////////////////////////////////////////////////////////////////

/**
 * Re-initializes widget on array add event.
 */
function location_on_array_add(inst, context) {
    BS5LocationWidget.initialize(context);
}

/**
 * Registers subscribers to yafowil array events.
 */
export function register_array_subscribers() {
    if (window.yafowil_array === undefined) {
        return;
    }
    window.yafowil_array.on_array_event('on_add', location_on_array_add);
}
