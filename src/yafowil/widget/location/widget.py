from collections import OrderedDict
from node.utils import UNSET
from yafowil.base import factory
from yafowil.base import fetch_value
from yafowil.common import generic_required_extractor
from yafowil.utils import attr_value
from yafowil.utils import css_managed_props
from yafowil.utils import cssclasses
from yafowil.utils import cssid
from yafowil.utils import data_attrs_helper
from yafowil.utils import managedprops
import json


@managedprops('extract_zoom', 'factory', 'emptyvalue')
def location_extractor(widget, data):
    lat = data.request.get('{0}.lat'.format(widget.dottedpath))
    lon = data.request.get('{0}.lon'.format(widget.dottedpath))
    zoom = data.request.get('{0}.zoom'.format(widget.dottedpath))
    if lat is None:
        return UNSET
    # if lat and no lon given, something went totally wrong
    if lon is None:
        raise ValueError('Malformed request. Cannot extract Coordinates')
    if not lat:
        return attr_value('emptyvalue', widget, data)
    value = widget.attrs['factory']()
    value['lat'] = float(lat)
    value['lon'] = float(lon)
    if attr_value('extract_zoom', widget, data):
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
        # use OrderedDict for generating data attribute value to ensure
        # correct order. Needed for tests.
        ordered_val = OrderedDict()
        for key in sorted(value.keys()):
            ordered_val[key] = value[key]
        map_attrs['data-value'] = json.dumps(ordered_val)
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
    extractors=[
        location_extractor,
        generic_required_extractor
    ],
    edit_renderers=[
        location_edit_renderer
    ],
    display_renderers=[
        location_display_renderer
    ]
)

factory.doc['blueprint']['location'] = """\
Add-on blueprint
`yafowil.widget.location <http://github.com/conestack/yafowil.widget.location/>`_
"""

factory.defaults['location.class'] = 'location'

factory.defaults['location.required'] = False

factory.defaults['location.error_class'] = 'error'

factory.defaults['location.message_class'] = 'errormessage'

factory.defaults['location.emptyvalue'] = None

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

factory.defaults['location.extract_zoom'] = True
factory.doc['props']['location.extract_zoom'] = """\
Flag whether to include zoom level when extracting value from request.
"""

factory.defaults['location.factory'] = dict
factory.doc['props']['location.factory'] = """\
A class used as factory for creating location value at extraction time.
"""
