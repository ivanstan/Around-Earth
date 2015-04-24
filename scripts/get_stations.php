<?php require '../vendor/autoload.php';

$tle_sources = array(
  'http://celestrak.com/NORAD/elements/stations.txt',
  'http://celestrak.com/NORAD/elements/tle-new.txt',
  'http://celestrak.com/NORAD/elements/visual.txt',
  'http://celestrak.com/NORAD/elements/1999-025.txt',
  'http://celestrak.com/NORAD/elements/iridium-33-debris.txt',
  'http://celestrak.com/NORAD/elements/cosmos-2251-debris.txt',
  'http://celestrak.com/NORAD/elements/2012-044.txt',
  'http://celestrak.com/NORAD/elements/weather.txt',
  'http://celestrak.com/NORAD/elements/noaa.txt',
  'http://celestrak.com/NORAD/elements/goes.txt',
  'http://celestrak.com/NORAD/elements/resource.txt',
  'http://celestrak.com/NORAD/elements/sarsat.txt',
  'http://celestrak.com/NORAD/elements/dmc.txt',
  'http://celestrak.com/NORAD/elements/tdrss.txt',
  'http://celestrak.com/NORAD/elements/argos.txt',
  'http://celestrak.com/NORAD/elements/geo.txt',
  'http://celestrak.com/NORAD/elements/intelsat.txt',
  'http://celestrak.com/NORAD/elements/gorizont.txt',
  'http://celestrak.com/NORAD/elements/raduga.txt',
  'http://celestrak.com/NORAD/elements/molniya.txt',
  'http://celestrak.com/NORAD/elements/iridium.txt',
  'http://celestrak.com/NORAD/elements/orbcomm.txt',
  'http://celestrak.com/NORAD/elements/globalstar.txt',
  'http://celestrak.com/NORAD/elements/amateur.txt',
  'http://celestrak.com/NORAD/elements/x-comm.txt',
  'http://celestrak.com/NORAD/elements/other-comm.txt',
  'http://celestrak.com/NORAD/elements/gps-ops.txt',
  'http://celestrak.com/NORAD/elements/glo-ops.txt',
  'http://celestrak.com/NORAD/elements/galileo.txt',
  'http://celestrak.com/NORAD/elements/beidou.txt',
  'http://celestrak.com/NORAD/elements/sbas.txt',
  'http://celestrak.com/NORAD/elements/nnss.txt',
  'http://celestrak.com/NORAD/elements/musson.txt',
  'http://celestrak.com/NORAD/elements/science.txt',
  'http://celestrak.com/NORAD/elements/geodetic.txt',
  'http://celestrak.com/NORAD/elements/education.txt',
  'http://celestrak.com/NORAD/elements/engineering.txt',
  'http://celestrak.com/NORAD/elements/military.txt',
  'http://celestrak.com/NORAD/elements/radar.txt',
  'http://celestrak.com/NORAD/elements/other.txt',
  'http://celestrak.com/NORAD/elements/cubesat.txt',
);

set_time_limit(0);

$output = '';
foreach($tle_sources as $tle_file) {
  $curl = curl_init();
  curl_setopt_array($curl, array(
      CURLOPT_RETURNTRANSFER => 1,
      CURLOPT_URL => $tle_file
  ));
  $output .= curl_exec($curl);
  curl_close($curl);
}

file_put_contents('stations.txt', $output);
