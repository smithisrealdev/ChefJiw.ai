#!/bin/sh
set -e
cd .
python3 make2.py
python3 retone.py
python3 appify.py
