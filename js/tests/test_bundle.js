import $ from 'jquery';

QUnit.module('bundle', (hooks) => {
    const ready_callbacks = [];
    let default_bundle, bs5_bundle;

    hooks.before(async () => {
        const L = await import('leaflet');
        window.L = L;

        await import('leaflet-geosearch');

        // capture DOM ready callbacks registered by the bundles
        const orig_ready = $.fn.ready;
        $.fn.ready = function (fn) {
            ready_callbacks.push(fn);
            return this;
        };
        try {
            default_bundle = await import('../src/default/bundle.js');
            bs5_bundle = await import('../src/bootstrap5/bundle.js');
        } finally {
            $.fn.ready = orig_ready;
        }
    });

    hooks.afterEach(() => {
        delete window.ts;
        delete window.bdajax;
        window.yafowil_array = undefined;
    });

    function assert_dom_ready_registration(assert, ready_callback, widget_class) {
        let registered = [];
        const register = (callback, instant) => {
            registered.push([callback, instant]);
        };

        window.ts = { ajax: { register } };
        ready_callback();
        assert.deepEqual(registered, [[widget_class.initialize, true]]);
        delete window.ts;

        registered = [];
        window.bdajax = { register };
        ready_callback();
        assert.deepEqual(registered, [[widget_class.initialize, true]]);
        delete window.bdajax;

        const orig_initialize = widget_class.initialize;
        const initialized = [];
        widget_class.initialize = (...args) => {
            initialized.push(args);
        };
        const subscribers = {};
        window.yafowil_array = {
            on_array_event: (evt_name, evt_function) => {
                subscribers[evt_name] = evt_function;
            },
        };
        try {
            ready_callback();
        } finally {
            widget_class.initialize = orig_initialize;
        }
        assert.deepEqual(initialized, [[]]);
        assert.deepEqual(Object.keys(subscribers), ['on_add']);
    }

    QUnit.test('exports', (assert) => {
        assert.deepEqual(Object.keys(default_bundle).sort(), [
            'LocationWidget',
            'LocationWidgetMarker',
            'LocationWidgetMarkerPopup',
            'LocationWidgetSearch',
            'register_array_subscribers',
        ]);
        assert.deepEqual(Object.keys(bs5_bundle).sort(), [
            'BS5LocationWidget',
            'BS5LocationWidgetMarker',
            'register_array_subscribers',
        ]);
        assert.strictEqual(ready_callbacks.length, 2);
    });

    QUnit.test('default DOM ready registration', (assert) => {
        assert_dom_ready_registration(assert, ready_callbacks[0], default_bundle.LocationWidget);
    });

    QUnit.test('bootstrap5 DOM ready registration', (assert) => {
        assert_dom_ready_registration(assert, ready_callbacks[1], bs5_bundle.BS5LocationWidget);
    });
});
