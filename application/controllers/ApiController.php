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

	public function __construct($app) {
		header('Content Type: application/json');
		header('Access-Control-Allow-Origin: *');

		$this->scriptRoot = $app->appRoot . 'scripts/';
		parent::__construct($app);
	}

	public function satelliteAction() {
		$satellite = escapeshellarg($_REQUEST['satellite']);
		$userLatitude = escapeshellarg($_REQUEST['user_latitude']);
		$userLongitude = escapeshellarg($_REQUEST['user_longitude']);
		$userAltitude = escapeshellarg($_REQUEST['user_altitude']);

		$tleSource = new TleSource($this->app);
		$tle = $tleSource->getTle($satellite);

		if(!$tle) {
			die('Tle not found');
		}

		echo shell_exec("python {$this->scriptRoot}calculate.py $satellite $userLatitude $userLongitude $userAltitude '{$tle['line1']}' '{$tle['line2']}' 2>&1");

		exit();
	}

}
