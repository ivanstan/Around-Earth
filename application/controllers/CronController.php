<?php namespace controllers;

/**
 * Created by PhpStorm.
 * User: Ivan
 * Date: 4/29/2015
 * Time: 8:11 PM
 */
use system\Controller;
use system\Application;
use Guzzle\Http\Client;
use Symfony\Component\DomCrawler\Crawler;

class CronController extends Controller {

	public function __construct($app) {
		parent::__construct($app);

		if(!isset($_GET['cron_key']) || $_GET['cron_key'] != $this->app->config['cron_key']) {
			die('Invalid cron key.');
		}
	}

	public function getTleDataAction() {
		set_time_limit(0);

		$output = '';
		foreach($this->app->config['tle_sources'] as $tle_file) {
			$curl = curl_init();
			curl_setopt_array($curl, array(
				CURLOPT_RETURNTRANSFER => 1,
				CURLOPT_URL => $tle_file
			));
			$output .= curl_exec($curl);
			curl_close($curl);
		}

		file_put_contents($this->app->appRoot . 'scripts/stations.txt', $output);
	}

	public function indexAction() {
		return array();
	}
	
	public function groundStationsAction() {
		$client = new Client();
		$request = $client->get($this->app->config['ground_stations_url']);
		$response = $request->send();

		$crawler = new Crawler($response->getBody(true));
		$filter = $crawler->filter('table tr');

		$result = array();
		foreach ($filter as $i => $content) {
			if($i < 4) continue;

			$crawler = new Crawler($content);
			$temp = array();
			foreach($crawler->filter('td') as $v => $col) {
				if($v > 3) continue;
				if(trim($col->nodeValue)) {
					if($v == 0) $key = 'country';
					if($v == 1) $key = 'location';
					if($v == 2) $key = 'latitude';
					if($v == 3) $key = 'longitude';

					$temp[$key] = trim($col->nodeValue);
				}
			}
			if(count($temp) == 4) {
				$result[] = $temp;
			}

    	}
		
		echo "<pre>"; print_r($result); echo "</pre>"; die();

		exit();
	}


}
