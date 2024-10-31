import {importMapsPlugin} from '@web/dev-server-import-maps';

export default {
    nodeResolve: true,
    testFramework: {
        path: './node_modules/web-test-runner-qunit/dist/autorun.js',
        config: {
            noglobals: false
        }
    },
    files: [
        'js/tests/**/test_*.js'
    ],
    plugins: [
        importMapsPlugin({
            inject: {
                importMap: {
                    imports: {
                        'jquery': './node_modules/jquery/dist-module/jquery.module.js',
                        'leaflet': './src/yafowil/widget/location/resources/leaflet/dist/leaflet-src.esm.js',
                        'leaflet-geosearch': './src/yafowil/widget/location/resources/leaflet-geosearch/geosearch.umd.js'
                    },
                },
            },
        }),
    ],
}
