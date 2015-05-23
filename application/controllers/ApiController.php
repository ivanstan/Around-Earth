<?php namespace controllers;

/**
 * Created by PhpStorm.
 * User: Ivan
 * Date: 4/24/2015
 * Time: 3:22 PM
 */
use system\Controller;
use models\TleSource;
use models\Tle;

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

		$tle = new Tle($this->app);
		$tle = $tle->load(str_replace('"', '', $sat));

		$tleSource = new TleSource($this->app);
		$tle = $tleSource->getTle($sat);

		if(!$tle) die('Tle not found');

		print shell_exec("python {$this->scriptRoot}calculate.py $sat $lat $lon $alt '{$tle['first_line']}' '{$tle['second_line']}' $orb {$this->debug}");
		exit();
	}

	public function groundStationsAction() {
		$stmt = $this->app->pdo->prepare("SELECT id, `name`, `type`, latitude, longitude, `range`, description FROM ground");
		$stmt->execute();
		$result = $stmt->fetchAll(\PDO::FETCH_ASSOC);

		foreach($result as &$item) {
			$item['description'] = utf8_encode($item['description']);
		}

		print json_encode($result);
		exit();
	}

	public function searchSatellitesAction() {
		if(!isset($_REQUEST['search'])) exit();
		$tle = new Tle($this->app);
		$found = $tle->find($_REQUEST['search']);

		$response = array();
		foreach($found as $id => $value) {
			$response[] = array('id'=>$id, 'text' => $value['name']);
		}

		if(empty($response)) {
			$answer[] = array('id' => 0, 'text' => 'No results found...');
		}

		print json_encode($response);
		exit();
	}

}
