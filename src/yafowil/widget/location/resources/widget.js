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
            }
        }
    });

})(jQuery);
