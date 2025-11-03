Changes
=======

2.0.0 (unreleased)
------------------

- Introduce ``disable_interaction`` widget property and ``location_display_renderer``.
  [lenadax]

- Update jQuery to version ``4.0.0-beta.2``.
  [lenadax]

- Use Bootstrap icons as custom Leaflet markers.
  [lenadax]

- Implement dark theme for ``Bootstrap5`` dark theme mode using css filters.
  [lenadax]

- Use rollup for bundling scss. Use ``make rollup`` to compile js and scss.
  [lenadax]

- Use ``webtestrunner`` instead of ``karma`` for js tests. Use ``make wtr`` to run tests.
  [lenadax]

- Use ``pnpm`` as package manager.
  [lenadax]

- Use default ``zoom`` if ``extract_zoom`` is ``True`` but no zoom given on
  request.
  [rnix]

- Prevent initialize if widget is part of array template.
  [lenadax]

- Extend JS by ``location_on_array_add`` and ``register_array_subscribers``
  functions to enable usage in ``yafowil.widget.array``.
  [lenadax]

- Rewrite JavaScript using ES6.
  [rnix]

- Introduce ``show_lat_lon`` widget property. If True, latitude and longtude
  additionally can be entered manually in inpuf fields.
  [rnix]

- Consider ``emptyvalue`` at extraction time.
  [rnix]

- Introdude ``factory`` widget property. Defines a factory which is used to
  instance ectraction value.
  [rnix]

- Introduce ``extract_zoom`` widget property. Defines whether to include
  zoom level on extracted value.
  [rnix]

- Create Bootstrap5 widget version.
  [lenadax]

- Rewrite Javascript with ES6 classes.
  [rnix]

- Update leaflet to 1.7.1 and leaflet-geosearch to 3.5.0.
  [rnix]

**Breaking changes**

- Empty extration value is ``None`` instead of empty dictionary.
  [rnix]


1.2 (2018-07-16)
----------------

- Python 3 compatibility.
  [rnix]

- Convert doctests to unittests.
  [rnix]


1.1 (2017-03-01)
----------------

- Use ``yafowil.utils.entry_point`` decorator.
  [rnix, 2016-06-28]

- Raise ``ValueError`` in ``location_extractor`` if malformed request is
  received.
  [rnix]

1.0 (2015-01-23)
----------------

- Make it work.
  [rnix]
