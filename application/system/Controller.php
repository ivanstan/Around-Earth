<?php

namespace system;

class Controller {
	/**
	 * @var \system\Application Application singleton
	 */
	protected $app;

	/**
	 * @var \Smarty Smarty singleton
	 */
	protected $smarty;

	public function __construct($app) {
		$this->app = $app;

	}

	public function redirect($url = '') {
		header("Location: {$this->app->getbaseUrl()}/$url");
		exit;
	}
}
