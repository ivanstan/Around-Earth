<?php

namespace system;

use system\Application;

class Model {
	protected $app;
	protected $pdo;

	public function __construct(Application $app) {
		$this->app = $app;
		$this->pdo = $app->pdo;
	}
}