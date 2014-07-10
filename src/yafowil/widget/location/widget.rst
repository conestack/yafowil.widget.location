Import requirements::

    >>> import yafowil.loader
    >>> from yafowil.base import factory

Render map widget with defaults::

    >>> widget = factory('location', 'default')
    >>> pxml(widget())
    <div class="location-wrapper location" id="location-default">
      <div class="location-map" data-lat="47.2667" data-lon="11.3833" data-max_zoom="18" data-min_zoom="2" data-zoom="12" id="location-map-default"> </div>
      <input class="location-lat" id="location-lat-default" name="default.lat" type="hidden"/>
      <input class="location-lon" id="location-lon-default" name="default.lon" type="hidden"/>
      <input class="location-zoom" id="location-zoom-default" name="default.zoom" type="hidden"/>
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
      <div class="location-map" data-lat="47.2667" data-lon="11.3833" data-max_zoom="18" data-min_zoom="2" data-value="{&quot;lat&quot;: 47.25, &quot;lon&quot;: 11.3333, &quot;zoom&quot;: 14}" data-zoom="12" id="location-map-default"> </div>
      <input class="location-lat" id="location-lat-default" name="default.lat" type="hidden" value="47.25"/>
      <input class="location-lon" id="location-lon-default" name="default.lon" type="hidden" value="11.3333"/>
      <input class="location-zoom" id="location-zoom-default" name="default.zoom" type="hidden" value="14"/>
    </div>
    <BLANKLINE>

Widget extraction without preset value::

    >>> widget = factory('location', 'default', props={'required': True})
    >>> request = {}
    >>> data = widget.extract(request)
    >>> data.extracted
    <UNSET>

    >>> request = {
    ...     'default.lat': '',
    ...     'default.lon': '',
    ...     'default.zoom': '',
    ... }
    >>> data = widget.extract(request)

    >>> data.errors
    [ExtractionError('Mandatory field was empty',)]

    >>> data.extracted
    {}

    >>> request = {
    ...     'default.lat': '47.2667',
    ...     'default.lon': '11.3833',
    ...     'default.zoom': '6',
    ... }
    >>> data = widget.extract(request)

    >>> data.errors
    []

    >>> data.extracted
    {'lat': 47.2667, 'lon': 11.3833, 'zoom': 6}

Widget extraction with preset value::

    >>> value = {
    ...     'lat': '47.0',
    ...     'lon': '11.0',
    ... }
    >>> widget = factory('location', 'default', value=value,
    ...     props={
    ...         'required': True,
    ...     })
    >>> request = {}
    >>> data = widget.extract(request)
    >>> data.extracted
    <UNSET>

    >>> pxml(widget(data=data))
    <div class="location-wrapper location" id="location-default">
      <div class="location-map" data-lat="47.2667" data-lon="11.3833" data-max_zoom="18" data-min_zoom="2" data-value="{&quot;lat&quot;: &quot;47.0&quot;, &quot;lon&quot;: &quot;11.0&quot;}" data-zoom="12" id="location-map-default"> </div>
      <input class="location-lat" id="location-lat-default" name="default.lat" type="hidden" value="47.0"/>
      <input class="location-lon" id="location-lon-default" name="default.lon" type="hidden" value="11.0"/>
      <input class="location-zoom" id="location-zoom-default" name="default.zoom" type="hidden"/>
    </div>
    <BLANKLINE>

    >>> request = {
    ...     'default.lat': '',
    ...     'default.lon': '',
    ...     'default.zoom': '',
    ... }
    >>> data = widget.extract(request)

    >>> data.errors
    [ExtractionError('Mandatory field was empty',)]

    >>> data.extracted
    {}

    >>> pxml(widget(data=data))
    <div class="location-wrapper error location" id="location-default">
      <div class="location-map" data-lat="47.2667" data-lon="11.3833" data-max_zoom="18" data-min_zoom="2" data-zoom="12" id="location-map-default"> </div>
      <input class="location-lat" id="location-lat-default" name="default.lat" type="hidden"/>
      <input class="location-lon" id="location-lon-default" name="default.lon" type="hidden"/>
      <input class="location-zoom" id="location-zoom-default" name="default.zoom" type="hidden"/>
    </div>
    <BLANKLINE>

    >>> request = {
    ...     'default.lat': '47.2667',
    ...     'default.lon': '11.3833',
    ...     'default.zoom': '8',
    ... }
    >>> data = widget.extract(request)

    >>> data.errors
    []

    >>> data.extracted
    {'lat': 47.2667, 'lon': 11.3833, 'zoom': 8}

    >>> pxml(widget(data=data))
    <div class="location-wrapper location" id="location-default">
      <div class="location-map" data-lat="47.2667" data-lon="11.3833" data-max_zoom="18" data-min_zoom="2" data-value="{&quot;lat&quot;: 47.2667, &quot;lon&quot;: 11.3833, &quot;zoom&quot;: 8}" data-zoom="12" id="location-map-default"> </div>
      <input class="location-lat" id="location-lat-default" name="default.lat" type="hidden" value="47.2667"/>
      <input class="location-lon" id="location-lon-default" name="default.lon" type="hidden" value="11.3833"/>
      <input class="location-zoom" id="location-zoom-default" name="default.zoom" type="hidden" value="8"/>
    </div>
    <BLANKLINE>
