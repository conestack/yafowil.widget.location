from yafowil.base import factory
from yafowil.common import generic_required_extractor


def location_extractor(widget, data):
    pass


def location_edit_renderer(widget, data):
    pass


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
