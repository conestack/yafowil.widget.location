from node.utils import UNSET
from yafowil.base import ExtractionError
from yafowil.base import factory
from yafowil.compat import IS_PY2
from yafowil.tests import fxml
from yafowil.tests import YafowilTestCase
import os
import unittest


if not IS_PY2:
    from importlib import reload


def np(path):
    return path.replace('/', os.path.sep)


class TestLocationWidget(YafowilTestCase):

    def setUp(self):
        super(TestLocationWidget, self).setUp()
        from yafowil.widget import location
        reload(location.widget)
        location.register()

    def test_render_base(self):
        # Render map widget with defaults
        widget = factory(
            'location',
            name='default')
        self.checkOutput("""
        <div class="location-wrapper location" id="location-default">
          <div class="location-map" data-lat="47.2667" data-lon="11.3833"
               data-max_zoom="18" data-min_zoom="2" data-tile_layers="[...]"
               data-zoom="12" id="location-map-default">
          </div>
          <input class="location-lat" id="location-lat-default"
                 name="default.lat" type="hidden"/>
          <input class="location-lon" id="location-lon-default"
                 name="default.lon" type="hidden"/>
          <input class="location-zoom" id="location-zoom-default"
                 name="default.zoom" type="hidden"/>
        </div>
        """, fxml(widget()))

    def test_render_with_preset_value(self):
        # Render map widget with defaults value
        value = {
            'lat': 47.2500,
            'lon': 11.3333,
            'zoom': 14
        }
        widget = factory(
            'location',
            name='default',
            value=value)
        self.checkOutput("""
        <div class="location-wrapper location" id="location-default">
          <div class="location-map" data-lat="47.2667" data-lon="11.3833"
               data-max_zoom="18" data-min_zoom="2"
               data-tile_layers="[...]"
               data-value="{&quot;lat&quot;: 47.25, &quot;lon&quot;: 11.3333, &quot;zoom&quot;: 14}"
               data-zoom="12" id="location-map-default">
          </div>
          <input class="location-lat" id="location-lat-default"
                 name="default.lat" type="hidden" value="47.25"/>
          <input class="location-lon" id="location-lon-default"
                 name="default.lon" type="hidden" value="11.3333"/>
          <input class="location-zoom" id="location-zoom-default"
                 name="default.zoom" type="hidden" value="14"/>
        </div>
        """, fxml(widget()))

    def test_render_with_lat_lon_shown(self):
        widget = factory(
            'location',
            name='default',
            props={
                'show_lat_lon': True
            })
        self.checkOutput("""
        <div class="location-wrapper location" id="location-default">
          <div class="location-map" data-lat="47.2667" data-lon="11.3833"
               data-max_zoom="18" data-min_zoom="2" data-tile_layers="[...]"
               data-zoom="12" id="location-map-default">
          </div>
          <label class="location-lat-label control-label"
                 for="default.lat">Latitude:</label>
          <input class="location-lat form-control"
                 id="location-lat-default" name="default.lat" type="text"/>
          <label class="location-lon-label control-label"
                 for="default.lon">Longitude:</label>
          <input class="location-lon form-control"
                 id="location-lon-default" name="default.lon" type="text"/>
          <input class="location-zoom" id="location-zoom-default"
                 name="default.zoom" type="hidden"/>
        </div>
        """, fxml(widget()))

    def test_render_display_not_implemented(self):
        # Display renderer is not implemented
        widget = factory(
            'location',
            name='default',
            mode='display')
        self.assertEqual(widget(), None)

    def test_extract_with_invalid_request(self):
        # Widget extraction with invalid request
        widget = factory(
            'location',
            name='default',
            props={
                'required': True
            })
        request = {
            'default.lat': ''
        }
        with self.assertRaises(ValueError) as arc:
            widget.extract(request)
        msg = 'Malformed request. Cannot extract Coordinates'
        self.assertEqual(str(arc.exception), msg)

    def test_extract_without_preset_value(self):
        # Widget extraction without preset value
        widget = factory(
            'location',
            name='default',
            props={
                'required': True
            })
        request = {}
        data = widget.extract(request)
        self.assertEqual(data.extracted, UNSET)

        request = {
            'default.lat': '',
            'default.lon': '',
            'default.zoom': ''
        }
        data = widget.extract(request)
        self.assertEqual(
            data.errors,
            [ExtractionError('Mandatory field was empty')]
        )
        self.assertEqual(data.extracted, None)

        request = {
            'default.lat': '47.2667',
            'default.lon': '11.3833',
            'default.zoom': '6'
        }
        data = widget.extract(request)
        self.assertEqual(data.errors, [])
        self.assertEqual(data.extracted, {
            'lat': 47.2667,
            'lon': 11.3833,
            'zoom': 6
        })

    def test_extract_with_preset_value(self):
        # Widget extraction with preset value
        value = {
            'lat': '47.0',
            'lon': '11.0'
        }
        widget = factory(
            'location',
            name='default',
            value=value,
            props={
                'required': True
            })
        request = {}
        data = widget.extract(request)
        self.assertEqual(data.extracted, UNSET)
        self.checkOutput("""
        <div class="location-wrapper location" id="location-default">
          <div class="location-map" data-lat="47.2667" data-lon="11.3833"
               data-max_zoom="18" data-min_zoom="2" data-tile_layers="[...]"
               data-value="{&quot;lat&quot;: &quot;47.0&quot;, &quot;lon&quot;: &quot;11.0&quot;}"
               data-zoom="12" id="location-map-default">
          </div>
          <input class="location-lat" id="location-lat-default"
                 name="default.lat" type="hidden" value="47.0"/>
          <input class="location-lon" id="location-lon-default"
                 name="default.lon" type="hidden" value="11.0"/>
          <input class="location-zoom" id="location-zoom-default"
                 name="default.zoom" type="hidden"/>
        </div>
        """, fxml(widget(data=data)))

        request = {
            'default.lat': '',
            'default.lon': '',
            'default.zoom': ''
        }
        data = widget.extract(request)
        self.assertEqual(
            data.errors,
            [ExtractionError('Mandatory field was empty')]
        )
        self.assertEqual(data.extracted, None)
        self.checkOutput("""
        <div class="location-wrapper error location" id="location-default">
          <div class="location-map" data-lat="47.2667" data-lon="11.3833"
               data-max_zoom="18" data-min_zoom="2" data-tile_layers="[...]"
               data-zoom="12" id="location-map-default">
          </div>
          <input class="location-lat" id="location-lat-default"
                 name="default.lat" type="hidden" value=""/>
          <input class="location-lon" id="location-lon-default"
                 name="default.lon" type="hidden" value=""/>
          <input class="location-zoom" id="location-zoom-default"
                 name="default.zoom" type="hidden"/>
        </div>
        """, fxml(widget(data=data)))

        request = {
            'default.lat': '47.2667',
            'default.lon': '11.3833',
            'default.zoom': '8'
        }
        data = widget.extract(request)
        self.assertEqual(data.errors, [])
        self.assertEqual(data.extracted, {
            'lat': 47.2667,
            'lon': 11.3833,
            'zoom': 8
        })
        self.checkOutput("""
        <div class="location-wrapper location" id="location-default">
          <div class="location-map" data-lat="47.2667" data-lon="11.3833"
               data-max_zoom="18" data-min_zoom="2" data-tile_layers="[...]"
               data-value="{&quot;lat&quot;: 47.2667, &quot;lon&quot;: 11.3833, &quot;zoom&quot;: 8}"
               data-zoom="12" id="location-map-default">
          </div>
          <input class="location-lat" id="location-lat-default"
                 name="default.lat" type="hidden" value="47.2667"/>
          <input class="location-lon" id="location-lon-default"
                 name="default.lon" type="hidden" value="11.3833"/>
          <input class="location-zoom" id="location-zoom-default"
                 name="default.zoom" type="hidden" value="8"/>
        </div>
        """, fxml(widget(data=data)))

    def test_extraction_errors(self):
        widget = factory(
            'location',
            name='default')

        request = {
            'default.lat': 'a',
            'default.lon': ''
        }
        data = widget.extract(request)
        self.assertEqual(
            data.errors,
            [ExtractionError('Latitude is not floating point number')]
        )

        request = {
            'default.lat': '1',
            'default.lon': 'a'
        }
        data = widget.extract(request)
        self.assertEqual(
            data.errors,
            [ExtractionError('Longitude is not floating point number')]
        )

        request = {
            'default.lat': '91',
            'default.lon': '0'
        }
        data = widget.extract(request)
        self.assertEqual(
            data.errors,
            [ExtractionError('Latitude must be between -90 and +90 degrees')]
        )

        request = {
            'default.lat': '0',
            'default.lon': '181'
        }
        data = widget.extract(request)
        self.assertEqual(
            data.errors,
            [ExtractionError('Longitude must be between -180 and +180 degrees')]
        )

    def test_resources(self):
        factory.theme = 'default'
        resources = factory.get_resources('yafowil.widget.location')
        self.assertTrue(resources.directory.endswith(np('/location/resources')))
        self.assertEqual(resources.path, 'yafowil-location')

        scripts = resources.scripts
        self.assertEqual(len(scripts), 3)

        self.assertTrue(
            scripts[0].directory.endswith(np('/location/resources/leaflet'))
        )
        self.assertEqual(scripts[0].path, 'yafowil-location/leaflet')
        self.assertEqual(scripts[0].file_name, 'leaflet.js')
        self.assertTrue(os.path.exists(scripts[0].file_path))

        self.assertTrue(
            scripts[1].directory.endswith(np('/location/resources/leaflet-geosearch'))
        )
        self.assertEqual(scripts[1].path, 'yafowil-location/leaflet-geosearch')
        self.assertEqual(scripts[1].file_name, 'geosearch.umd.js')
        self.assertTrue(os.path.exists(scripts[1].file_path))

        self.assertTrue(scripts[2].directory.endswith(np('/location/resources')))
        self.assertEqual(scripts[2].path, 'yafowil-location')
        self.assertEqual(scripts[2].file_name, 'widget.min.js')
        self.assertTrue(os.path.exists(scripts[2].file_path))

        styles = resources.styles
        self.assertEqual(len(styles), 3)

        self.assertTrue(
            styles[0].directory.endswith(np('/location/resources/leaflet'))
        )
        self.assertEqual(styles[0].path, 'yafowil-location/leaflet')
        self.assertEqual(styles[0].file_name, 'leaflet.css')
        self.assertTrue(os.path.exists(styles[0].file_path))

        self.assertTrue(
            styles[1].directory.endswith(np('/location/resources/leaflet-geosearch'))
        )
        self.assertEqual(styles[1].path, 'yafowil-location/leaflet-geosearch')
        self.assertEqual(styles[1].file_name, 'geosearch.css')
        self.assertTrue(os.path.exists(styles[1].file_path))

        self.assertTrue(styles[2].directory.endswith(np('/location/resources')))
        self.assertEqual(styles[2].path, 'yafowil-location')
        self.assertEqual(styles[2].file_name, 'widget.css')
        self.assertTrue(os.path.exists(styles[2].file_path))


if __name__ == '__main__':
    unittest.main()
