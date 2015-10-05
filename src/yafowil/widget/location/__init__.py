from yafowil.base import factory
import os


resourcedir = os.path.join(os.path.dirname(__file__), 'resources')
js = [{
    'group': 'yafowil.widget.location.dependencies',
    'resource': 'Leaflet/leaflet-src.js',
    'order': 20,
}, {
    'group': 'yafowil.widget.location.dependencies',
    'resource': 'L.GeoSearch/l.control.geosearch.js',
    'order': 21,
}, {
    'group': 'yafowil.widget.location.dependencies',
    'resource': 'L.GeoSearch/l.geosearch.provider.openstreetmap.js',
    'order': 22,
}, {
    'group': 'yafowil.widget.location.common',
    'resource': 'widget.js',
    'order': 23,
}]
css = [{
    'group': 'yafowil.widget.location.dependencies',
    'resource': 'Leaflet/leaflet.css',
    'order': 20,
}, {
    'group': 'yafowil.widget.location.dependencies',
    'resource': 'L.GeoSearch/l.geosearch.css',
    'order': 21,
}, {
    'group': 'yafowil.widget.location.common',
    'resource': 'widget.css',
    'order': 22,
}]


def register():
    import widget
    factory.register_theme('default', 'yafowil.widget.location',
                           resourcedir, js=js, css=css)
