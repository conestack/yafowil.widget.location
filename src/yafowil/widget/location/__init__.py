from yafowil.base import factory
from yafowil.utils import entry_point
import os
import webresource as wr


resources_dir = os.path.join(os.path.dirname(__file__), 'resources')


##############################################################################
# Default
##############################################################################

# webresource ################################################################

scripts = wr.ResourceGroup(name='scripts')
scripts.add(wr.ScriptResource(
    name='leaflet-js',
    # actually it not depends on jquery, but yafowil-location-js does
    # think about multiple depends values in webresource
    depends='jquery-js',
    directory=os.path.join(resources_dir, 'leaflet'),
    resource='leaflet-src.js',
    compressed='leaflet.js'
))
scripts.add(wr.ScriptResource(
    name='leaflet-geosearch-js',
    # actually it not depends on jquery, but yafowil-location-js does
    # think about multiple depends values in webresource
    depends='leaflet-js',
    directory=os.path.join(resources_dir, 'leaflet-geosearch'),
    resource='geosearch.umd.js'
))
scripts.add(wr.ScriptResource(
    name='yafowil-location-js',
    depends='leaflet-geosearch-js',
    directory=resources_dir,
    resource='widget.js',
    compressed='widget.min.js'
))

styles = wr.ResourceGroup(name='styles')
styles.add(wr.StyleResource(
    name='leaflet-css',
    directory=os.path.join(resources_dir, 'leaflet'),
    resource='leaflet.css'
))
styles.add(wr.StyleResource(
    name='leaflet-geosearch-css',
    depends='leaflet-css',
    directory=os.path.join(resources_dir, 'leaflet-geosearch'),
    resource='geosearch.css'
))
styles.add(wr.StyleResource(
    name='yafowil-location-css',
    depends='leaflet-geosearch-css',
    directory=resources_dir,
    resource='widget.css'
))

resources = wr.ResourceGroup(name='location-resources')
resources.add(scripts)
resources.add(styles)

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
    'resource': 'widget.js',
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
    'resource': 'widget.css',
    'order': 22,
}]


##############################################################################
# Registration
##############################################################################

@entry_point(order=10)
def register():
    from yafowil.widget.location import widget  # noqa

    # Default
    factory.register_theme(
        'default', 'yafowil.widget.location', resources_dir,
        js=js, css=css, resources=resources
    )
