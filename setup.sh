#!/usr/bin/env bash
python3 -m venv venv --clear --upgrade-deps
. venv/bin/activate
pip install -r requirements.txt