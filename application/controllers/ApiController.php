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
		print shell_exec("python {$this->scriptRoot}astronomical_position.py {$this->debug}");
		exit();
	}

	public function astronomicalOrbitAction() {
		print shell_exec("python {$this->scriptRoot}astronomical_orbit.py {$this->debug}");
		exit();
	}

	public function satelliteAction() {
		$satellite = escapeshellarg($_REQUEST['satellite']);
		$userLatitude = escapeshellarg($_REQUEST['user_latitude']);
		$userLongitude = escapeshellarg($_REQUEST['user_longitude']);
		$userAltitude = escapeshellarg($_REQUEST['user_altitude']);

		$tleSource = new TleSource($this->app);
		$tle = $tleSource->getTle($satellite);

		if(!$tle) die('Tle not found');

		print shell_exec("python {$this->scriptRoot}calculate.py $satellite $userLatitude $userLongitude $userAltitude '{$tle['line1']}' '{$tle['line2']}' {$this->debug}");
		exit();
	}

	public function groundStationsAction() {
		$stmt = $this->app->pdo->query("SELECT * FROM launch_sites");
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		print json_encode($result);
		exit();
	}

	public function searchSatellitesAction() {
		if(!isset($_REQUEST['q'])) exit();
		$tleSource = new TleSource($this->app);
		$found = $tleSource->find($_REQUEST['q']);
		print json_encode($found);
	}

}
