from yafowil.base import factory
from yafowil.utils import entry_point
import os
import webresource as wr


resources_dir = os.path.join(os.path.dirname(__file__), 'resources')


##############################################################################
# Leaflet
##############################################################################

# webresource ################################################################

leaflet_js = wr.ScriptResource(
    name='leaflet-js',
    directory=os.path.join(resources_dir, 'leaflet'),
    path='yafowil-location/leaflet',
    resource='leaflet-src.js',
    compressed='leaflet.js'
)
leaflet_css = wr.StyleResource(
    name='leaflet-css',
    directory=os.path.join(resources_dir, 'leaflet'),
    path='yafowil-location/leaflet',
    resource='leaflet.css'
)
leaflet_geosearch_js = wr.ScriptResource(
    name='leaflet-geosearch-js',
    depends='leaflet-js',
    directory=os.path.join(resources_dir, 'leaflet-geosearch'),
    path='yafowil-location/leaflet-geosearch',
    resource='geosearch.umd.js'
)
leaflet_geosearch_css = wr.StyleResource(
    name='leaflet-geosearch-css',
    depends='leaflet-css',
    directory=os.path.join(resources_dir, 'leaflet-geosearch'),
    path='yafowil-location/leaflet-geosearch',
    resource='geosearch.css'
)

##############################################################################
# Default
##############################################################################

# webresource ################################################################

resources = wr.ResourceGroup(
    name='yafowil.widget.location',
    directory=resources_dir,
    path='yafowil-location'
)
resources.add(leaflet_js)
resources.add(leaflet_css)
resources.add(leaflet_geosearch_js)
resources.add(leaflet_geosearch_css)
resources.add(wr.ScriptResource(
    name='yafowil-location-js',
    directory=os.path.join(resources_dir, 'default'),
    depends=['jquery-js', 'leaflet-geosearch-js'],
    resource='widget.js',
    compressed='widget.min.js'
))
resources.add(wr.StyleResource(
    name='yafowil-location-css',
    directory=os.path.join(resources_dir, 'default'),
    depends='leaflet-geosearch-css',
    resource='widget.min.css'
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
    'resource': 'default/widget.min.css',
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
bootstrap5_resources.add(leaflet_js)
bootstrap5_resources.add(leaflet_css)
bootstrap5_resources.add(leaflet_geosearch_js)
bootstrap5_resources.add(leaflet_geosearch_css)
bootstrap5_resources.add(wr.ScriptResource(
    name='yafowil-location-js',
    directory=os.path.join(resources_dir, 'bootstrap5'),
    depends=['jquery-js', 'leaflet-geosearch-js'],
    resource='widget.js',
    compressed='widget.min.js'
))
bootstrap5_resources.add(wr.StyleResource(
    name='yafowil-location-css',
    directory=os.path.join(resources_dir, 'bootstrap5'),
    depends='leaflet-geosearch-css',
    resource='widget.min.css'
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
    'resource': 'bootstrap5/widget.min.css',
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
