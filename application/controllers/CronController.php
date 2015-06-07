<?php namespace controllers;

/**
 * Created by PhpStorm.
 * User: Ivan
 * Date: 4/29/2015
 * Time: 8:11 PM
 */
use models\TleSource;
use system\Controller;
use system\Application;
use Guzzle\Http\Client;
use models\Tle;
use Symfony\Component\DomCrawler\Crawler;

class CronController extends Controller {

	public function __construct($app) {
		parent::__construct($app);
		require_once $app->appRoot . 'vendor/TLE/Parser.php';
		require_once $app->appRoot . 'vendor/TLE/Constant.php';

		if(!isset($_GET['cron_key']) || $_GET['cron_key'] != $this->app->config['cron_key']) {
			die('Invalid cron key.');
		}
	}

	/**
	 * cron/update-tle-data&cron_key=xxx
	 */
	public function updateTleDataAction() {
		set_time_limit(0);

		$tle = new Tle($this->app);
		$existing = $tle->getList();

		$countUpdated = 0;
		$countNew = 0;

		foreach($this->app->config['tle_sources'] as $tle_file) {
			$curl = curl_init();
			curl_setopt_array($curl, array(
				CURLOPT_RETURNTRANSFER => 1,
				CURLOPT_URL => $tle_file
			));
			$content = curl_exec($curl);
			$content = explode("\n", $content);
			$content = array_filter($content);
			$content = array_chunk($content, 3);

			$insertArray = array();
			$updateArray = array();
			foreach($content  as $item) {
				$tleItem = implode("\n", $item);
				$parser = new \Tle\Parser($tleItem);

				 $tleArray = array(
					'id' => $parser->satelliteNumber,
					'name' => trim($parser->name),
					'epoch' => $parser->epochUnixTimestamp,
					'first_line' => $parser->firstLine,
					'first_line_checksum' => $parser->firstLineChecksum,
					'second_line' => $parser->secondLine,
					'second_line_checksum' => $parser->secondLineChecksum
				);

				if(isset($existing[$parser->satelliteNumber])) {
					if($existing[$parser->satelliteNumber]['epoch'] < $parser->epochUnixTimestamp) {
						$updateArray[] = $tleArray;
						$countUpdated++;
					}
				} else {
					$insertArray[] = $tleArray;
					$countNew++;
				}
			}

			curl_close($curl);

			foreach(array_chunk($insertArray, 50) as $item) {
				$tle->insert($item);
			}

			foreach(array_chunk($updateArray, 50) as $item) {
				$tle->update($item);
			}
		}

		echo json_encode(array(
			'updated' => $countUpdated,
			'created' => $countNew
		));

		exit();
	}

	public function indexAction() {
		return array();
	}
	
	public function groundStationsAction() {

		exit();
	}


}
