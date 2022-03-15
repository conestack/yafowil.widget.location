#!/bin/sh

set -e

./bin/coverage run \
    --source src/yafowil/widget/location \
    --omit src/yafowil/widget/location/example.py \
    -m yafowil.widget.location.tests
./bin/coverage report
./bin/coverage html
