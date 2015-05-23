<?php namespace models;
/**
 * Created by PhpStorm.
 * User: Ivan
 * Date: 5/23/2015
 * Time: 5:12 PM
 */

use system\Application as Application;
use system\Model;

class Tle extends Model {

	public function __construct(Application $app) {
		parent::__construct($app);
	}

	/**
	 * Insert
	 *
	 * @param $tleArray		Array of tle values.
	 */
	public function insert($tleArray) {
		$params = array();
		$valuesQuery = '';
		foreach($tleArray as $id => $tle) {
			$valuesQueryArray = array();
			foreach($tle as $key => $value) {
				$valuesQueryArray[] = ':' . $key . '_' . $id;
				$params[':' . $key . '_' . $id] = $value;
			}
			$valuesQuery .= '(' . implode(', ', $valuesQueryArray) . '),';
		}
		$query = 'INSERT IGNORE INTO tle (id, name, epoch, first_line, first_line_checksum, second_line, second_line_checksum) VALUES '. rtrim($valuesQuery, ',');
		$stmt = $this->pdo->prepare($query);
		$stmt->execute($params);
	}

	public function update($tleArray) {
		foreach($tleArray as $item) {
			$query = 'UPDATE tle SET
				name = :name,
				epoch = :epoch,
				first_line = :first_line,
				first_line_checksum = :first_line_checksum,
				second_line = :second_line,
				second_line_checksum = :second_line_checksum
				WHERE id = :id
			';
			$stmt = $this->pdo->prepare($query);
			$stmt->execute($item);
		}
	}

	public function find($search) {
		$query = 'SELECT id, name FROM tle WHERE name LIKE ?';
		$stmt = $this->pdo->prepare($query);
		$stmt->execute(array('%' . $search . '%'));
		return $stmt->fetchAll(\PDO::FETCH_UNIQUE|\PDO::FETCH_ASSOC);
	}

	public function load($id) {
		$query = 'SELECT * FROM tle WHERE id = :id';
		$stmt = $this->pdo->prepare($query);
		$stmt->execute(array('id' => $id));
		return $stmt->fetch();
	}

	public function getList() {
		$query = 'SELECT id, name, epoch FROM tle';
		$stmt = $this->pdo->prepare($query);
		$stmt->execute();
		return $stmt->fetchAll(\PDO::FETCH_UNIQUE|\PDO::FETCH_ASSOC);
	}

}