<?php
namespace controllers;

use system\Controller;
use system\Application;

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
	 * @path example/index
	 */
	public function indexAction() {

	}
}
