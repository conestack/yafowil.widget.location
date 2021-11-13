from collections import OrderedDict
from node.utils import UNSET
from yafowil.base import ExtractionError
from yafowil.base import factory
from yafowil.base import fetch_value
from yafowil.common import generic_required_extractor
from yafowil.tsf import TSF
from yafowil.utils import attr_value
from yafowil.utils import css_managed_props
from yafowil.utils import cssclasses
from yafowil.utils import cssid
from yafowil.utils import data_attrs_helper
from yafowil.utils import managedprops
import json


_ = TSF('yafowil.widget.loaction')


def request_value(widget, data, name):
    if not data.request:
        return None
    return data.request.get('{0}.{1}'.format(widget.dottedpath, name))


@managedprops('extract_zoom', 'factory', 'emptyvalue')
def location_extractor(widget, data):
    lat = request_value(widget, data, 'lat')
    lon = request_value(widget, data, 'lon')
    zoom = request_value(widget, data, 'zoom')
    if lat is None:
        return UNSET
    # if lat and no lon given, something went totally wrong
    if lon is None:
        raise ValueError('Malformed request. Cannot extract Coordinates')
    if not lat and not lon:
        return attr_value('emptyvalue', widget, data)
    value = widget.attrs['factory']()
    try:
        value['lat'] = float(lat)
    except ValueError:
        raise ExtractionError(_(
            'latitude_is_no_float',
            default='Latitude is not floating point number'
        ))
    try:
        value['lon'] = float(lon)
    except ValueError:
        raise ExtractionError(_(
            'longitude_is_no_float',
            default='Longitude is not floating point number'
        ))
    if value['lat'] < -90 or value['lat'] > 90:
        raise ExtractionError(_(
            'latitude_invalid_range',
            default='Latitude must be between -90 and +90 degrees'
        ))
    if value['lon'] < -180 or value['lon'] > 180:
        raise ExtractionError(_(
            'longitude_invalid_range',
            default='Longitude must be between -180 and +180 degrees'
        ))
    if attr_value('extract_zoom', widget, data):
        value['zoom'] = int(zoom)
    return value


def input_value(widget, data, value, name):
    return value[name] if value else request_value(widget, data, name)


def lat_lon_hidden_renderer_helper(widget, data, value):
    tag = data.tag
    # create hidden input for lat
    lat = tag('input', **{
        'type': 'hidden',
        'name': '{0}.lat'.format(widget.dottedpath),
        'value': input_value(widget, data, value, 'lat'),
        'id': cssid(widget, 'location-lat'),
        'class': 'location-lat',
    })
    # create hidden input for lon
    lon = tag('input', **{
        'type': 'hidden',
        'name': '{0}.lon'.format(widget.dottedpath),
        'value': input_value(widget, data, value, 'lon'),
        'id': cssid(widget, 'location-lon'),
        'class': 'location-lon',
    })
    return [lat, lon]


def lat_lon_input_renderer_helper(widget, data, value):
    tag = data.tag
    # create label and input for lat
    lat_label = tag('label', _('latitude', default='Latitude:'), **{
        'for': '{0}.lat'.format(widget.dottedpath),
        'class': 'location-lat-label control-label',
    })
    lat = tag('input', **{
        'type': 'text',
        'name': '{0}.lat'.format(widget.dottedpath),
        'value': input_value(widget, data, value, 'lat'),
        'id': cssid(widget, 'location-lat'),
        'class': 'location-lat form-control',
    })
    # create label and input for lon
    lon_label = tag('label', _('longitude', default='Longitude:'), **{
        'for': '{0}.lon'.format(widget.dottedpath),
        'class': 'location-lon-label control-label',
    })
    lon = tag('input', **{
        'type': 'text',
        'name': '{0}.lon'.format(widget.dottedpath),
        'value': input_value(widget, data, value, 'lon'),
        'id': cssid(widget, 'location-lon'),
        'class': 'location-lon form-control',
    })
    return [lat_label, lat, lon_label, lon]


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
    map_ = tag('div', ' ', **map_attrs)
    # create hidden input for current zoom
    zoom = tag('input', **{
        'type': 'hidden',
        'name': '{0}.zoom'.format(widget.dottedpath),
        'value': value.get('zoom') if value else None,
        'id': cssid(widget, 'location-zoom'),
        'class': 'location-zoom',
    })
    # create location widget wrapper
    children = [map_] + (
        lat_lon_input_renderer_helper(widget, data, value)
        if attr_value('show_lat_lon', widget, data)
        else lat_lon_hidden_renderer_helper(widget, data, value)
    ) + [zoom]
    wrapper = tag('div', *children, **{
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

factory.defaults['location.show_lat_lon'] = False
factory.doc['props']['location.show_lat_lon'] = """\
Flag whether to show lat lon inputs for direct value input.
"""
