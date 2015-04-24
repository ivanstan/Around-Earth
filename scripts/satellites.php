<?php require_once 'TleSource.php';

header('Content Type: application/json');
header('Access-Control-Allow-Origin: *');

define('APP_ROOT', '../');

$source = new TleSource();

if(isset($_REQUEST['q'])) {
  $found = $source->find($_REQUEST['q']);
  print json_encode($found);
}



