node read_pump_status.js SEPTIC-PUMP 25 5000
node read_pump_status.js SANDFILTER-PUMP 27 5000
while [ 1 ] ; do node read_tank_level-lidar.js 40; sleep 300;  done

gpio readall
vcgencmd measure_temp
