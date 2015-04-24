<?php
namespace models;

class TleSource
{
	const tleFile = '/backend/stations.txt';
	const cacheLifeTime = 300;
	const memcacheHost = 'localhost';
	const memcachePort = 11211;

	private $memcache;

	function __construct() {
		$this->memcache = class_exists('Memcache') ? new Memcache() : null;
		if($this->memcache) {
			$success = $this->memcache->connect(self::memcacheHost, self::memcachePort);

			if(!$success) {
				throw new Exception('Memcache could not connect.');
			}
		}
	}

	public function getTle($satellite) {
		$cached = $this->memcache->get('tleList');
		if($cached) {
			$tleList = $cached;
		} else {
			$tleList = $this->parseTleFile()['tleList'];
			$this->memcache->set('tleList', $tleList['tleList'], false, time() + self::cacheLifeTime);
		}

		foreach($tleList as $tle) {
			if(strcmp($satellite, $tle['name'])) {
				return $tle;
			}
		}

		return false;
	}

	public function getSatelliteList() {
		if($this->memcache && $cached = $this->memcache->get('satelliteList')) {
			return $cached;
		}

		$result = $this->parseTleFile();

		if($this->memcache) {
			$this->memcache->set('satelliteList', $result['satelliteList'], false, time() + self::cacheLifeTime);
		}

		return $result['satelliteList'];
	}

	public 	function find($search) {
		$sateliteList = $this->getSatelliteList();

		$rval = array();
		foreach($sateliteList as $satellite) {
			if(strpos(strtolower($satellite), strtolower($search)) !== false) {
				$rval[] = $satellite;
			}
		}

		return $rval;
	}

	public function parseTleFile() {
		if(!file_exists(APP_ROOT . self::tleFile)) {
			throw new Exception('File ' . APP_ROOT . self::tleFile . ' does not exists');
		}

		$stations      = file_get_contents(APP_ROOT . self::tleFile);
		$stations      = explode("\n", $stations);
		$satelliteList = array();
		$tleList       = array();
		foreach($stations as $key => $station) {
			$firstChar = substr($station, 0, 1);
			if(!empty($station) && strcmp($firstChar, '1') && strcmp($firstChar, '2')) {
				$satelliteList[] = trim($station);
				$tleList[]         = array(
					'name' => trim($station), 'line1' => trim($stations[$key + 1]), 'line2' => trim($stations[$key + 2]),
				);
			}
		}

		return array(
			'satelliteList' => $satelliteList, 'tleList' => $tleList
		);
	}

}
