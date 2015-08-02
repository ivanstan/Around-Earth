<?php namespace models;

class IMU {
	private $app;

	/**
	 * IMU constructor.
	 */
	public function __construct(\system\Application $app) {
		$this->app = $app;
		$this->app->assetManager->addJavascript('javascripts/IMU.js');
	}

	public function startServer() {
//		shell_exec('python ' . $this->app->appRoot . '/scripts/imu_stream.py &');
	}

	public function isServerRunning() {

	}

}