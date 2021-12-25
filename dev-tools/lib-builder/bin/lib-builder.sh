#!/usr/bin/env bash -v
set -eu

rm -rf dist/ dist-*/

tsc

if [ -f "api-extractor.json" ]; then
  $(dirname "$0")/../node_modules/.bin/api-extractor run --local
else
  echo No api-extractor.json found.
fi

find dist -type f \( -iname "*.d.ts" -o -iname "*.d.ts.map" \) -exec rm {} +;
