from node.tests import NodeTestCase
from node.utils import UNSET
from yafowil.base import ExtractionError
from yafowil.base import factory
from yafowil.tests import fxml
import yafowil.widget.location
import yafowil.loader


class TestLocationWidget(NodeTestCase):

    def test_render_base(self):
        # Render map widget with defaults
        widget = factory(
            'location',
            name='default')
        self.check_output("""
        <div class="location-wrapper location" id="location-default">
          <div class="location-map" data-lat="47.2667" data-lon="11.3833"
               data-max_zoom="18" data-min_zoom="2" data-zoom="12"
               id="location-map-default">
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
        self.check_output("""
        <div class="location-wrapper location" id="location-default">
          <div class="location-map" data-lat="47.2667" data-lon="11.3833"
               data-max_zoom="18" data-min_zoom="2"
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
        err = self.expect_error(
            ValueError,
            widget.extract,
            request
        )
        msg = 'Malformed request. Cannot extract Coordinates'
        self.assertEqual(str(err), msg)

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
        self.assertEqual(data.extracted, {})

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
        self.check_output("""
        <div class="location-wrapper location" id="location-default">
          <div class="location-map" data-lat="47.2667" data-lon="11.3833"
               data-max_zoom="18" data-min_zoom="2"
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
        self.assertEqual(data.extracted, {})
        self.check_output("""
        <div class="location-wrapper error location" id="location-default">
          <div class="location-map" data-lat="47.2667" data-lon="11.3833"
               data-max_zoom="18" data-min_zoom="2" data-zoom="12"
               id="location-map-default">
          </div>
          <input class="location-lat" id="location-lat-default"
                 name="default.lat" type="hidden"/>
          <input class="location-lon" id="location-lon-default"
                 name="default.lon" type="hidden"/>
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
        self.check_output("""
        <div class="location-wrapper location" id="location-default">
          <div class="location-map" data-lat="47.2667" data-lon="11.3833"
               data-max_zoom="18" data-min_zoom="2"
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


if __name__ == '__main__':
    unittest.main()                                          # pragma: no cover
