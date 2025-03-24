from yafowil.base import factory


DOC_LOCATION = """
Location
--------

Location picker widget.

.. code-block:: python

    location = factory('#field:location', props={
        'label': 'Location',
        'help': 'Search and pick a location on the map',
        'required': 'Location is required',
        'lat': 47.2667,
        'lon': 11.3833,
        'zoom': 14,
    })
"""


def location_example():
    form = factory('fieldset', name='yafowil.widget.location.location')
    form['location'] = factory('#field:location', props={
        'label': 'Location',
        'help': 'Search and pick a location on the map',
        'required': 'Location is required',
        'lat': 47.2667,
        'lon': 11.3833,
        'zoom': 14,
    })
    return {
        'widget': form,
        'doc': DOC_LOCATION,
        'title': 'Location',
    }


DOC_LOCATION_WITH_PRESET_VALUE = """
Location with preset value
--------------------------

Location picker widget with preset value.

.. code-block:: python

    value = {
        'lat': 47.2667,
        'lon': 11.3833,
        'zoom': 14,
    }
    location = factory('#field:location', value=value, props={
        'label': 'Location',
        'help': 'Search and pick a location on the map',
        'required': 'Location is required',
    })
"""


def location_with_preset_value_example():
    name = 'yafowil.widget.location.location_with_preset_value'
    form = factory('fieldset', name=name)
    value = {
        'lat': 47.2667,
        'lon': 11.3833,
        'zoom': 14,
    }
    form['location'] = factory('#field:location', value=value, props={
        'label': 'Location',
        'help': 'Search and pick a location on the map',
        'required': 'Location is required',
    })
    return {
        'widget': form,
        'doc': DOC_LOCATION_WITH_PRESET_VALUE,
        'title': 'Location with preset value',
    }


DOC_LOCATION_DISPLAY = """
Display Mode / Disabled Mode
----------------------------

The ``disable_interaction`` widget attribute prevents interaction with the widget.
The widget's display mode automatically sets ``disable_interaction`` to True.

Zooming and panning is still supported, but Markers cannot be added, edited or removed.

The wrapper div can receive additional classes via the ``display_class``
widget attribute.

.. code-block:: python

    value = {
        'lat': 47.2667,
        'lon': 11.3833,
        'zoom': 14,
    }
    location = factory('#field:location', value=value, mode='display', props={
        'label': 'Location in Display Mode',
        'help': 'Search and pick a location on the map',
        'required': 'Location is required',
    })
"""


def location_display():
    name = 'yafowil.widget.location.display'
    form = factory('fieldset', name=name)
    value = {
        'lat': 47.2667,
        'lon': 11.3833,
        'zoom': 14,
    }
    form['location'] = factory('#field:location', value=value, mode='display', props={
        'label': 'Location in Display Mode',
        'help': 'Search and pick a location on the map',
        'required': 'Location is required',
        'display_class': 'border border-danger'
    })
    return {
        'widget': form,
        'doc': DOC_LOCATION_DISPLAY,
        'title': 'Display Mode',
    }


def get_example():
    return [
        location_example(),
        location_with_preset_value_example(),
        location_display()
    ]
