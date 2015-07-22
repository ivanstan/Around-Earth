<?php

class Ajax {

	/**
	 * Response formats
	 */
	const RESPONSE_FORMAT_JSON = 'JSON';

	/**
	 * Result
	 * @var mixed
	 */
	private $_result;

	/**
	 * Status
	 * @var boolean
	 */
	private $_status;

	/**
	 * Message (info, error)
	 * @var string
	 */
	private $_message;

	/**
	 *
	 * @param mixed $result Result
	 * @param boolean $status Operation status
	 * @param string $message Message (info, error)
	 */
	public function __construct($result = NULL, $status = TRUE, $message = '') {
		$this->_result = $result;
		$this->_status = $status;
		$this->_message = $message;
	}

	/**
	 * Make response
	 *
	 * @param boolean $echo Echo response
	 * @param string $format Format
	 * @param boolean $setHeaders Set headers depending on choosen format
	 * @return string
	 */
	public function make($format = self::RESPONSE_FORMAT_JSON, $setHeaders = TRUE) {
		// Output
		switch($format) {
			case self::RESPONSE_FORMAT_JSON:
			default:
				if($setHeaders) {
					header('Content-type: application/json');
				}

				$output = json_encode(array(
					'result' => $this->_result,
					'status' => $this->_status,
					'message' => $this->_message
				));
		}

		print $output;
		exit();
	}

	/**
	 * Make response
	 *
	 * @param mixed $result Result
	 * @param boolean $status Operation status
	 * @param string $message Message (info, error)
	 * @param boolean $echo Echo response
	 * @param string $format Format
	 * @param boolean $setHeaders Set headers depending on choosen format
	 * @return string
	 */
	public static function makeResponse($result = NULL, $status = TRUE, $message = '', $format = self::RESPONSE_FORMAT_JSON, $setHeaders = TRUE) {
		$ajaxResponse = new self($result, $status, $message);
		return $ajaxResponse->make($format, $setHeaders);
	}

	/**
	 * Get result
	 *
	 * @return mixed
	 */
	public function getResult() {
		return $this->_result;
	}

	/**
	 * Set result
	 *
	 * @param mixed $result
	 */
	public function setResult($result) {
		$this->_result = $result;
	}

	/**
	 * Get status
	 *
	 * @return boolean
	 */
	public function getStatus() {
		return $this->_status;
	}

	/**
	 * Set status
	 *
	 * @param boolean $status
	 */
	public function setStatus($status) {
		$this->_status = $status;
	}

	/**
	 * Get message
	 *
	 * @return string
	 */
	public function getMessage() {
		return $this->_message;
	}

	/**
	 * Set message
	 *
	 * @param string $message
	 */
	public function setMessage($message) {
		$this->_message = $message;
	}

}