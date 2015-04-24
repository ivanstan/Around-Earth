<?php

require '../vendor/autoload.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

$memcache = new Memcache;
$memcache->connect('localhost', 11211) or die ("Could not connect");

$memcache->delete('satellites');
$memcache->delete('tleList');
$memcache->delete('satelliteList');

?>
