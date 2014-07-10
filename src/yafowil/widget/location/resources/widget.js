/*
 * yafowil location widget
 *
 * Requires: Leaflet, L.GeoSearch
 * Optional: bdajax
 */

if (typeof(window.yafowil) == "undefined") yafowil = {};

(function($) {

    $(document).ready(function() {
        // initial binding
        yafowil.location.binder();

        // add after ajax binding if bdajax present
        if (typeof(window.bdajax) != "undefined") {
            $.extend(bdajax.binders, {
                location_binder: yafowil.location.binder
            });
        }
    });

    $.extend(yafowil, {

        location: {

            create_marker: function(markers, lat, lon) {
                var marker = L.marker(
                    [lat, lon],
                    { draggable: true }
                );
                marker.addTo(markers);
                var popup = document.createElement('a');
                popup.href = "#";
                popup.innerHTML = "Remove";
                popup.onclick = function() {
                    markers.removeLayer(marker);
                    return false;
                };
                marker.bindPopup(popup);
                marker.on('dragend', function(evt) {
                    console.log(evt.target._latlng);
                });
            },

            binder: function(context) {
                $('div.location-map', context).each(function() {
                    // extract data from DOM
                    var elem = $(this);
                    var lat = elem.data('lat');
                    var lon = elem.data('lon');
                    var zoom = elem.data('zoom');
                    var min_zoom = elem.data('min_zoom');
                    var max_zoom = elem.data('max_zoom');
                    var value = elem.data('value');
                    // take value data instead of defaults if given
                    if (value) {
                        lat = value.lat;
                        lon = value.lon;
                        if (value.zoom) {
                            zoom = value.zoom;
                        }
                    }
                    // create map
                    var id = elem.attr('id');
                    var osm = 'Map data © <a href="http://openstreetmap.org">OSM</a>';
                    var map = L.map(id).setView([lat, lon], zoom);
                    map.on('click', function(evt) {
                        console.log(evt);
                    });
                    // set OSM tiles
                    var tiles = L.tileLayer(
                        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        {
                            attribution: osm,
                            minZoom: min_zoom,
                            maxZoom: max_zoom
                        });
                    tiles.addTo(map);
                    // create markers feature group
                    var markers = new L.FeatureGroup();
                    map.addLayer(markers);
                    // add marker if value given
                    if (value) {
                        yafowil.location.create_marker(
                            markers, value.lat, value.lon);
                    }
                });
            }
        }
    });

})(jQuery);
