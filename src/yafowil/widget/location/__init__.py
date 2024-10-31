from yafowil.base import factory
from yafowil.utils import entry_point
import os
import webresource as wr


resources_dir = os.path.join(os.path.dirname(__file__), 'resources')


##############################################################################
# Default
##############################################################################

# webresource ################################################################

resources = wr.ResourceGroup(
    name='yafowil.widget.location',
    directory=resources_dir,
    path='yafowil-location'
)
resources.add(wr.ScriptResource(
    name='leaflet-js',
    directory=os.path.join(resources_dir, 'leaflet'),
    path='yafowil-location/leaflet',
    resource='leaflet-src.js',
    compressed='leaflet.js'
))
resources.add(wr.ScriptResource(
    name='leaflet-geosearch-js',
    depends='leaflet-js',
    directory=os.path.join(resources_dir, 'leaflet-geosearch'),
    path='yafowil-location/leaflet-geosearch',
    resource='geosearch.umd.js'
))
resources.add(wr.ScriptResource(
    name='yafowil-location-js',
    depends=['jquery-js', 'leaflet-geosearch-js'],
    resource='default/widget.js',
    compressed='default/widget.min.js'
))
resources.add(wr.StyleResource(
    name='leaflet-css',
    directory=os.path.join(resources_dir, 'leaflet'),
    path='yafowil-location/leaflet',
    resource='leaflet.css'
))
resources.add(wr.StyleResource(
    name='leaflet-geosearch-css',
    depends='leaflet-css',
    directory=os.path.join(resources_dir, 'leaflet-geosearch'),
    path='yafowil-location/leaflet-geosearch',
    resource='geosearch.css'
))
resources.add(wr.StyleResource(
    name='yafowil-location-css',
    depends='leaflet-geosearch-css',
    resource='default/widget.css'
))

# B/C resources ##############################################################

js = [{
    'group': 'yafowil.widget.location.dependencies',
    'resource': 'leaflet/leaflet.js',
    'order': 20,
}, {
    'group': 'yafowil.widget.location.dependencies',
    'resource': 'leaflet-geosearch/geosearch.umd.js',
    'order': 21,
}, {
    'group': 'yafowil.widget.location.common',
    'resource': 'default/widget.js',
    'order': 23,
}]
css = [{
    'group': 'yafowil.widget.location.dependencies',
    'resource': 'leaflet/leaflet.css',
    'order': 20,
}, {
    'group': 'yafowil.widget.location.dependencies',
    'resource': 'leaflet-geosearch/geosearch.css',
    'order': 21,
}, {
    'group': 'yafowil.widget.location.common',
    'resource': 'default/widget.css',
    'order': 22,
}]


##############################################################################
# Bootstrap 5
##############################################################################

# webresource ################################################################

bootstrap5_resources = wr.ResourceGroup(
    name='yafowil.widget.location',
    directory=resources_dir,
    path='yafowil-location'
)
bootstrap5_resources.add(wr.ScriptResource(
    name='leaflet-js',
    directory=os.path.join(resources_dir, 'leaflet'),
    path='yafowil-location/leaflet',
    resource='leaflet-src.js',
    compressed='leaflet.js'
))
bootstrap5_resources.add(wr.ScriptResource(
    name='leaflet-geosearch-js',
    depends='leaflet-js',
    directory=os.path.join(resources_dir, 'leaflet-geosearch'),
    path='yafowil-location/leaflet-geosearch',
    resource='geosearch.umd.js'
))
bootstrap5_resources.add(wr.ScriptResource(
    name='yafowil-location-js',
    depends=['jquery-js', 'leaflet-geosearch-js'],
    resource='bootstrap5/widget.js',
    compressed='bootstrap5/widget.min.js'
))
bootstrap5_resources.add(wr.StyleResource(
    name='leaflet-css',
    directory=os.path.join(resources_dir, 'leaflet'),
    path='yafowil-location/leaflet',
    resource='leaflet.css'
))
bootstrap5_resources.add(wr.StyleResource(
    name='leaflet-geosearch-css',
    depends='leaflet-css',
    directory=os.path.join(resources_dir, 'leaflet-geosearch'),
    path='yafowil-location/leaflet-geosearch',
    resource='geosearch.css'
))
bootstrap5_resources.add(wr.StyleResource(
    name='yafowil-location-css',
    depends='leaflet-geosearch-css',
    resource='bootstrap5/widget.css'
))
# B/C resources ##############################################################
bootstrap5_js = [{
    'group': 'yafowil.widget.location.dependencies',
    'resource': 'leaflet/leaflet.js',
    'order': 20,
}, {
    'group': 'yafowil.widget.location.dependencies',
    'resource': 'leaflet-geosearch/geosearch.umd.js',
    'order': 21,
}, {
    'group': 'yafowil.widget.location.common',
    'resource': 'bootstrap5/widget.js',
    'order': 23,
}]
bootstrap5_css = [{
    'group': 'yafowil.widget.location.dependencies',
    'resource': 'leaflet/leaflet.css',
    'order': 20,
}, {
    'group': 'yafowil.widget.location.dependencies',
    'resource': 'leaflet-geosearch/geosearch.css',
    'order': 21,
}, {
    'group': 'yafowil.widget.location.common',
    'resource': 'bootstrap5/widget.css',
    'order': 22,
}]

##############################################################################
# Registration
##############################################################################

@entry_point(order=10)
def register():
    from yafowil.widget.location import widget  # noqa

    widget_name = 'yafowil.widget.location'

    # Default
    factory.register_theme(
        'default',
        widget_name,
        resources_dir,
        js=js,
        css=css
    )
    factory.register_resources('default', widget_name, resources)

    # Bootstrap 5
    factory.register_theme(
        ['bootstrap5'],
        widget_name,
        resources_dir,
        js=bootstrap5_js,
        css=bootstrap5_css
    )

    factory.register_resources(
        ['bootstrap5'],
        widget_name,
        bootstrap5_resources
    )
