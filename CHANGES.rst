Changes
=======

2.0.2 (unreleased)
------------------

- Fix markers of the bootstrap5 location widget not being draggable. The
  ``draggable`` option was passed to ``L.Marker`` as a third argument and was
  ignored.
  [rnix]

- Fix the bootstrap5 location widget failing to initialize without a global
  ``$``, e.g. with ``jQuery.noConflict()``. It imports jQuery now.
  [rnix]

- Do not write a byte order mark into the compiled CSS.
  [rnix]

- Extend the JS tests to 100 % coverage, all modules including bundles are
  loaded by the tests now.
  [rnix]

- Lint and format the JS code with biome. ``make check`` runs ``biome check``,
  ``make format`` runs ``biome check --write`` (see ``include.mk``). Behavior
  unchanged.
  [rnix]

- JS tooling: Commit ``pnpm-lock.yaml``. Upgrade ``@web/test-runner`` to 1.0
  and run the JS tests headless in Chromium via Playwright, installed in the JS
  CI workflow. Drop the accidental ``install`` dev dependency. Pin patched
  versions of vulnerable transitive dependencies via ``pnpm.overrides``.
  [rnix]

- Modernise the code ruff flags as outdated: ``.format()`` over f-strings.
  Behaviour unchanged. ``super(Class, self)`` is kept, see ``cone.app``.
  [rnix]

- Sort the imports with ruff (one per line, ``from`` imports first, no
  sections) and format the code with ``ruff format`` (90 characters per line,
  single quotes).
  [rnix]

- Add ``qa.ruff`` domain to Makefile and pin the ruff configuration in
  ``pyproject.toml``, ``make check`` runs ``ruff check``.
  [rnix]

- Drop the Python 2 remnants: ``yafowil.compat`` usage, ``IS_PY2`` branches and
  ``# -*- coding: utf-8 -*-``.
  [rnix]

- Declare ``requires-python = ">=3.10"``.
  [rnix]


2.0.1 (2026-10-24)
------------------

- Add copies of the leaflet resources to the ``Bootstrap5`` resource group
  instead of sharing the instances with the default theme group. Sharing them
  left ``resource.parent`` pointing at the wrong group, which broke name based
  resource deduplication in consuming applications and ended in a
  ``ResourceConflictError`` when combined with another package shipping
  leaflet under the same resource names, e.g. ``cone.maps``.
  [rnix]


2.0.0 (2026-02-03)
------------------

- Refactor package layout to use ``pyproject.toml`` and implicit namespace packages.
  [rnix]

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


1.3 (2025-11-03)
----------------

- Pin upper versions of dependencies.
  [lenadax]


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
