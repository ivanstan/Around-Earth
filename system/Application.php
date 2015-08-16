<?php namespace system;

class Application {

	public function bootstrap() {
		set_error_handler('\system\Application::errorHandler');


//		$this->test(1);
	}

	public function test(\integer $a) {

	}

	public function errorHandler($errorLevel, $errorMessage) {
		\system\TypeHint::errorHandler($errorLevel, $errorMessage);

		return false;
	}

}

