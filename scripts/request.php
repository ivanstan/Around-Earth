<?php
header('Content Type: application/json');
header('Access-Control-Allow-Origin: *');

error_reporting(E_ALL);
ini_set('display_errors', 1);

$controllers = array('astro');

if(!isset($_REQUEST['controller']) || !in_array($_REQUEST['controller'], $controllers)) {
  print json_encode(array('result' => 'error'));
} else {
  unset($_REQUEST['controller']);
  $params = '';
  foreach ($_REQUEST as $param) {
    $params .= escapeshellarg($param) . ' ';
  }

  echo shell_exec("python astro.py $params 2>&1");
}


