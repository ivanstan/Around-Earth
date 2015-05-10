<?php namespace controllers;

use system\Controller;
use system\Application;
use models\TleSource;
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
		$tleSource = new TleSource($this->app);
		$satList = $tleSource->getSatelliteList();

		$frontEndTpl = scandir($this->app->appRoot . '/application/views/front-end');
		$tpls = '';
		foreach($frontEndTpl as $tpl) {
			if($tpl == '.' || $tpl == '..') continue;
			$tpls .= file_get_contents($this->app->appRoot . '/application/views/front-end/' . $tpl);
		}

		$variables = array(
			'javascriptSettings' => $this->app->config['javascript'],
			'satelliteList' => array_slice($satList, 0, 50),
			'satelliteCount' => count($satList),
			'frontEndTemplates' => $tpls
		);

		return $variables;
	}
}
