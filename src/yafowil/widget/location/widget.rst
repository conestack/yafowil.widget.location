Import requirements::

    >>> import yafowil.loader
    >>> from yafowil.base import factory

Render map widget with defaults::

    >>> widget = factory('location', 'default')
    >>> pxml(widget())
    <div class="location-wrapper location" id="location-default">
      <div class="location-map" data-lat="47.2667" data-lon="11.3833" data-max_zoom="18" data-min_zoom="2" data-zoom="12" id="location-map-default"/>
      <input class="location-lat" id="location-lat-default" name="default.lat" type="hidden"/>
      <input class="location-lon" id="location-lon-default" name="default.lon" type="hidden"/>
    </div>
    <BLANKLINE>

Render map widget with defaults value::

    >>> value = {
    ...     'lat': 47.2500,
    ...     'lon': 11.3333,
    ...     'zoom': 14,
    ... }
    >>> widget = factory('location', 'default', value=value)
    >>> pxml(widget())
    <div class="location-wrapper location" id="location-default">
      <div class="location-map" data-lat="47.2667" data-lon="11.3833" data-max_zoom="18" data-min_zoom="2" data-value="{&quot;lat&quot;: 47.25, &quot;lon&quot;: 11.3333, &quot;zoom&quot;: 14}" data-zoom="12" id="location-map-default"/>
      <input class="location-lat" id="location-lat-default" name="default.lat" type="hidden" value="47.25"/>
      <input class="location-lon" id="location-lon-default" name="default.lon" type="hidden" value="11.3333"/>
    </div>
    <BLANKLINE>
