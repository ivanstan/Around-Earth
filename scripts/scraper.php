<?php

require '../vendor/autoload.php';

use Symfony\Component\DomCrawler\Crawler;
// use Symfony\Component\Yaml\Parser;
// use Guzzle\Http\Client;
// use Symfony\Component\EventDispatcher\EventSubscriberInterface;

$curl = curl_init();
curl_setopt_array($curl, array(
    CURLOPT_RETURNTRANSFER => 1,
    CURLOPT_URL => 'http://www.nasa.gov/missions/schedule/'
));
$result = curl_exec($curl);
curl_close($curl);

// $yaml = new Parser();
// $config = $yaml->parse(file_get_contents('../settings.yaml'));

$crawler = new Crawler($result);
$crawler = $crawler->filter('.spacestn-features li');

foreach ($crawler as $domElement) {

      print '<pre>'; print_r($domElement); print '</pre>'; die();

    print $domElement->nodeName;
}

?>
