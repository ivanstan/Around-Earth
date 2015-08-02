<?php namespace controllers;

use system\Controller;
use system\AssetManager;
use models\Tle;
use models\IMU;

/**
 * Controller documentation.
 */
class IndexController extends Controller {
	/**
	 * Controller constructor.
	 *
	 * @param \system\Application $app Application singleton
	 */
	public function __construct($app) {
		parent::__construct($app);
	}

	/**
	 * @path index/index
	 */
	public function indexAction() {
		//		$cacheDir = $this->app->appRoot . 'cache';
		//
		//		$browserCap = new Browscap($cacheDir);
		//		$browser = $browserCap->getBrowser();
		//		$browserCap->doAutoUpdate = false;
		//		$browserCap->updateMethod= Browscap::UPDATE_LOCAL;
		//		$browserCap->localFile = $this->app->appRoot . 'scripts/full_php_browscap.ini';
		//		echo '<pre>'; print_r($browser); echo '</pre>'; die();
		//
		//		if ($browser->isMobileDevice) {
		//
		//
		//		}

		return $this->webAction();
	}

	public function webAction() {
		$tle     = new Tle($this->app);
		$satList = $tle->getList();

		$frontEndTpl = scandir($this->app->appRoot . '/application/views/front-end');
		$tpls        = '';
		foreach($frontEndTpl as $tpl) {
			if($tpl == '.' || $tpl == '..') {
				continue;
			}
			$tpls .= file_get_contents($this->app->appRoot . 'application/views/front-end/' . $tpl);
		}


		$this->app->assetManager->addCss('stylesheets/styles.css');
		$this->app->assetManager->addCss('stylesheets/select2.min.css');
		$this->app->assetManager->addJavascript('https://code.jquery.com/jquery-2.1.3.min.js');
		$this->app->assetManager->addJavascript('http://maps.googleapis.com/maps/api/js?sensor=false&libraries=visualization,geometry');
		$this->app->assetManager->addJavascript('javascripts/framework.js');
		$this->app->assetManager->addJavascript('javascripts/functions.js');
		$this->app->assetManager->addJavascript('vendor/bootstrap.min.js');
		$this->app->assetManager->addJavascript('vendor/daynightoverlay.js');
		$this->app->assetManager->addJavascript('vendor/d3.v3.min.js');
		$this->app->assetManager->addJavascript('vendor/radar.chart.js');
		$this->app->assetManager->addJavascript('javascripts/mapStyles.js');
		$this->app->assetManager->addJavascript('javascripts/app.js');
		$this->app->assetManager->addJavascript('javascripts/map.js');
		$this->app->assetManager->addJavascript('javascripts/orbit.js');
		$this->app->assetManager->addJavascript('javascripts/altitudeChart.js');
		$this->app->assetManager->addJavascript('javascripts/astronomical.js');
		$this->app->assetManager->addJavascript('javascripts/rightPanel.js');
		$this->app->assetManager->addJavascript('javascripts/contextualPopup.js');
		$this->app->assetManager->addJavascript('javascripts/groundStations.js');
		$this->app->assetManager->addJavascript('vendor/highcharts/highcharts.js');
		$this->app->assetManager->addJavascript('vendor/lightstreamer.js');
		$this->app->assetManager->addJavascript('javascripts/isstelemetry.js');
		$this->app->assetManager->addJavascript('vendor/highcharts/highcharts-more.js');
		$this->app->assetManager->addJavascript('vendor/highcharts/modules/solid-gauge.js');
		$this->app->assetManager->addJavascript('vendor/infobox.js');
		$this->app->assetManager->addJavascript('vendor/select2.full.min.js');
		$this->app->assetManager->addJavascript('vendor/handlebars-v3.0.3.js');
		$this->app->assetManager->addJavascript('vendor/orb.js/core.js');
		$this->app->assetManager->addJavascript('vendor/orb.js/satellite.js');
		$this->app->assetManager->addJavascript('vendor/moment/moment.js');
		$this->app->assetManager->addJavascript('javascripts/sky.js');

		$imu = new IMU($this->app);
		$imu->startServer();

		$variables = array(
			'javascriptSettings' => $this->app->config['javascript'],
			'satelliteList'      => array_slice($satList, 0, 50),
			'satelliteCount'     => count($satList),
			'frontEndTemplates'  => $tpls,
			'debug'              => $this->app->config['debug'],
		);

		return $variables;
	}

	public function mobileAction() {
		return array();
	}
}
