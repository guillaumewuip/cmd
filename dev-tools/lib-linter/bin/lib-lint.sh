#!/usr/bin/env bash -v
set -eu

TIMING=1 $(dirname "$0")/../node_modules/.bin/eslint $@
