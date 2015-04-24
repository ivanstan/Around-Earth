<?php

namespace system\cache;

use system\Application;

abstract class CacheHandler {
	protected $app;

	public function __construct(Application $app) {
		$this->app = $app;
	}

	public abstract function get($name);
	public abstract function set($name, $value);
}
