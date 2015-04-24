<?php
/**
 * Created by PhpStorm.
 * User: Ivan
 * Date: 4/19/2015
 * Time: 8:25 PM
 */
require_once '../vendor/autoload.php';

use Symfony\Component\Yaml\Parser;
$yaml = new Parser();
$config = $yaml->parse(file_get_contents('../settings.yaml'));

$db = new PDO("mysql:host={$config['database']['host']};dbname={$config['database']['database']};charset=utf8", $config['database']['username'], $config['database']['password']);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

$stmt = $db->query("SELECT * FROM launch_sites");
$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content Type: application/json');
header('Access-Control-Allow-Origin: *');
print json_encode($result);
