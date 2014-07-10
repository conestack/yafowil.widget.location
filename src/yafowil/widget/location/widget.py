import json
from node.utils import UNSET
from yafowil.base import (
    factory,
    fetch_value,
)
from yafowil.common import generic_required_extractor
from yafowil.utils import (
    cssid,
    cssclasses,
    css_managed_props,
    managedprops,
    attr_value,
    data_attrs_helper,
)


def location_extractor(widget, data):
    lat = data.request.get('{0}.lat'.format(widget.dottedpath))
    lon = data.request.get('{0}.lon'.format(widget.dottedpath))
    zoom = data.request.get('{0}.zoom'.format(widget.dottedpath))
    if lat is None:
        return UNSET
    # if lat and no lon given, something went totally wrong
    if lon is None:
        return ValueError('Malformed request. Cannot extract Coordinates')
    # return value is empty dict if no coordinates found. needed for
    # generic required extractor to work correctly
    value = dict()
    if lat:
        value['lat'] = float(lat)
        value['lon'] = float(lon)
        value['zoom'] = int(zoom)
    return value


@managedprops('lat', 'lon', 'zoom', *css_managed_props)
def location_edit_renderer(widget, data):
    tag = data.tag
    value = fetch_value(widget, data)
    # create map
    map_attrs = {
        'id': cssid(widget, 'location-map'),
        'class': 'location-map',
    }
    if (value):
        map_attrs['data-value'] = json.dumps(value)
    map_attrs.update(data_attrs_helper(
        widget, data, ['lat', 'lon', 'zoom', 'min_zoom', 'max_zoom']))
    map = tag('div', ' ', **map_attrs)
    # create hidden input for lat
    lat = tag('input', **{
        'type': 'hidden',
        'name': '{0}.lat'.format(widget.dottedpath),
        'value': value and value['lat'] or None,
        'id': cssid(widget, 'location-lat'),
        'class': 'location-lat',
    })
    # create hidden input for lon
    lon = tag('input', **{
        'type': 'hidden',
        'name': '{0}.lon'.format(widget.dottedpath),
        'value': value and value['lon'] or None,
        'id': cssid(widget, 'location-lon'),
        'class': 'location-lon',
    })
    # create hidden input for current zoom
    zoom = tag('input', **{
        'type': 'hidden',
        'name': '{0}.zoom'.format(widget.dottedpath),
        'value': value and value.get('zoom') or None,
        'id': cssid(widget, 'location-zoom'),
        'class': 'location-zoom',
    })
    # create location widget wrapper
    wrapper = tag('div', map, lat, lon, zoom, **{
        'id': cssid(widget, 'location'),
        'class': ' '.join(['location-wrapper', cssclasses(widget, data)]),
    })
    return wrapper


def location_display_renderer(widget, data):
    pass


factory.register(
    'location',
    extractors=[location_extractor, generic_required_extractor],
    edit_renderers=[location_edit_renderer],
    display_renderers=[location_display_renderer])

factory.doc['blueprint']['location'] = \
"""Add-on blueprint
`yafowil.widget.location <http://github.com/bluedynamics/yafowil.widget.location/>`_
"""

factory.defaults['location.class'] = 'location'

factory.defaults['location.required'] = False

factory.defaults['location.error_class'] = 'error'

factory.defaults['location.message_class'] = 'errormessage'

factory.defaults['location.lat'] = 47.2667
factory.doc['props']['location.lat'] = """\
Initial map center point latitude (north/south).
"""

factory.defaults['location.lon'] = 11.3833
factory.doc['props']['location.lon'] = """\
Initial map center point longitude (east/west).
"""

factory.defaults['location.zoom'] = 12
factory.doc['props']['location.zoom'] = """\
Initial map zoom level.
"""

factory.defaults['location.min_zoom'] = 2
factory.doc['props']['location.min_zoom'] = """\
Minimum map zoom level.
"""

factory.defaults['location.max_zoom'] = 18
factory.doc['props']['location.min_zoom'] = """\
Maximum map zoom level.
"""
