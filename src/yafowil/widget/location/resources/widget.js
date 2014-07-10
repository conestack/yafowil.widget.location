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

            binder: function(context) {
                $('div.location-map', context).each(function() {
                    yafowil.location.initialize_map($(this));
                });
            },

            initialize_map: function(elem) {
                // related lat and lon inputs
                var wrapper = elem.parent();
                var input_lat = $('input.location-lat', wrapper);
                var input_lon = $('input.location-lon', wrapper);
                // extract data from DOM
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
                var osm =
                    'Map data © <a href="http://openstreetmap.org">OSM</a>';
                var map = new L.map(id).setView([lat, lon], zoom);
                // set OSM tiles
                var tiles = new L.tileLayer(
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
                // create marker helper
                var create_marker = function(marker_lat, marker_lon) {
                    var marker = new L.marker(
                        [marker_lat, marker_lon],
                        { draggable: true }
                    );
                    marker.addTo(markers);
                    // add remove marker handler
                    var popup = document.createElement('a');
                    popup.href = "#";
                    popup.innerHTML = "Remove";
                    popup.onclick = function() {
                        markers.removeLayer(marker);
                        input_lat.val('');
                        input_lon.val('');
                        return false;
                    };
                    marker.bindPopup(popup);
                    marker.on('dragend', function(evt) {
                        input_lat.val(evt.target._latlng.lat);
                        input_lon.val(evt.target._latlng.lng);
                    });
                };
                // add marker if value given
                if (value) {
                    create_marker(value.lat, value.lon);
                }
                // add or move marker on map click
                map.on('click', function(evt) {
                    // XXX: confirmation dialog
                    console.log('click map');
                    markers.clearLayers();
                    create_marker(evt.latlng.lat, evt.latlng.lng);
                    input_lat.val(evt.latlng.lat);
                    input_lon.val(evt.latlng.lng);
                });
                // add geosearch widget
                var geosearch = new L.Control.GeoSearch({
                    provider: new L.GeoSearch.Provider.OpenStreetMap(),
                    position: 'topright',
                    showMarker: false
                })
                geosearch.addTo(map);
                // show result label on geo search submit and focus map
                map.on('geosearch_showlocation', function(result) {
                    // XXX: find out how to set focus on map again
                    var res = geosearch._resultslist;
                    res.innerHTML = '<li>' + result.Location.Label + '</li>';
                    res.style.display = 'block';
                    setTimeout(function () {
                        res.style.display = 'none';
                    }, 3000);
                    console.log(geosearch._map._container);
                });
            }
        }
    });

})(jQuery);
