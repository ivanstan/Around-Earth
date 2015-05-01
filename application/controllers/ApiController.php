<?php namespace controllers;

/**
 * Created by PhpStorm.
 * User: Ivan
 * Date: 4/24/2015
 * Time: 3:22 PM
 */
use system\Controller;
use models\TleSource;

class ApiController extends Controller {

	protected $app;
	protected $scriptRoot;
	protected $debug;

	public function __construct($app) {
		parent::__construct($app);
		$config = $this->app->config;
		$this->debug = $config['debug'] == 1 ? '2>&1' : '';
		$this->scriptRoot = $this->app->appRoot . 'scripts/';

		header('Content Type: application/json');
		if($this->debug) header('Access-Control-Allow-Origin: *');
	}

	public function astronomicalPositionAction() {
		$lat = escapeshellarg($_REQUEST['latitude']);
		$lon = escapeshellarg($_REQUEST['longitude']);
		$alt = escapeshellarg($_REQUEST['altitude']);

		print shell_exec("python {$this->scriptRoot}astronomical_position.py $lat $lon $alt {$this->debug}");
		exit();
	}

	public function satelliteAction() {
		$sat = escapeshellarg($_REQUEST['satellite']);
		$lat = escapeshellarg($_REQUEST['latitude']);
		$lon = escapeshellarg($_REQUEST['longitude']);
		$alt = escapeshellarg($_REQUEST['altitude']);
		$orb = isset($_REQUEST['orbits']) ? escapeshellarg($_REQUEST['orbits']) : 1;

		$tleSource = new TleSource($this->app);
		$tle = $tleSource->getTle($sat);

		if(!$tle) die('Tle not found');

		print shell_exec("python {$this->scriptRoot}calculate.py $sat $lat $lon $alt '{$tle['line1']}' '{$tle['line2']}' $orb {$this->debug}");
		exit();
	}

	public function groundStationsAction() {
		$stmt = $this->app->pdo->query("SELECT * FROM launch_sites");
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		print json_encode($result);
		exit();
	}

	public function searchSatellitesAction() {
		if(!isset($_REQUEST['search'])) exit();
		$tleSource = new TleSource($this->app);
		$found = $tleSource->find($_REQUEST['search']);
		$found = array_unique($found);

		$response = array();
		foreach($found as $item) {
			$response[] = array('id'=>$item, 'text' => $item);
		}

		if(empty($response)) {
			$answer[] = array('id' => 0, 'text' => 'No results found...');
		}

		print json_encode($response);
		exit();
	}

}
