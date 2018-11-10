#!/bin/bash

screen -d -m ./run.sh
screen -d -m node read_pump_status.js SEPTIC-PUMP 25 5000
screen -d -m node read_pump_status.js SANDFILTER-PUMP 27 5000
