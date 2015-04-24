<?php

namespace system\cache;

use system\Application;
use system\cache\CacheHandler;

/**
 * Handlers data caching in MySQL Database
 */
class MySQLCacheHandler extends CacheHandler {
	private $errorType;
	private $cache_expire;

	public function __construct(Application $app) {
		parent::__construct($app);
		$config = $app->getConfig();

		$this->cache_expire = $config['mysql_cache_handler.cache_time'];
	}

	/**
	 * Get a cached value if cache exists and is valid, FALSE otherwise.
	 * @param  string $name Cache key.
	 * @return string       Cached data
	 */
	public function get($name) {
		$pdo = $this->app->getPdo();

		$query = $pdo->prepare("
			SELECT
				`cache`.key,
				`cache`.data,
				`cache`.created
			 FROM
				`cache`
			WHERE
				`cache`.key = :key
		");

		$query->execute(array(':key' => $name));
		$result = $query->fetchObject();

		$rval = false;
		if(isset($result->created) && ($result->created + $this->cache_expire > time())) {
			$rval = $result->data;
		}

		return $rval;
	}

	/**
	 * Write data to cache.
	 * @param string $name  Cache Key.
	 * @param string $value Data to cache.
	 */
	public function set($name, $value) {
		$pdo = $this->app->getPdo();

		//empty old value
		$cache = $this->get($name);
		if($this) {
			$query = $pdo->prepare("
				DELETE FROM `cache` WHERE `cache`.key = :key
			");
			$query->execute(array(':key' => $name));
		}

		$query = $pdo->prepare("
			INSERT INTO
				`cache` (`key`, `data`, `created`)
			VALUES
				(:key, :data, :created)
		");
		return $query->execute(array(':key' => $name, ':data' => $value, ':created' => time()));
	}

}
