<?php namespace system;

class TypeHint {

//	const TYPEHINT_PCRE = '/^Argument (\d)+ passed to (?:(\w+)::)?(\w+)\(\) must be an instance of (\w+), (\w+) given/';
	const TYPEHINT_PCRE = '/^Argument (\d)+ passed to (.+)::(.+) must be an instance of (.+), (.+) given/';

	private static $Typehints = array(
		'boolean'  => 'is_bool',
		'integer'  => 'is_int',
		'float'    => 'is_float',
		'string'   => 'is_string',
		'resource' => 'is_resource'
	);

	public static function errorHandler($errorLevel, $errorMessage) {

		if($errorLevel == E_RECOVERABLE_ERROR) {

			if(preg_match(self::TYPEHINT_PCRE, $errorMessage, $ErrMatches)) {

				list($ErrMatch, $ThArgIndex, $ThClass, $ThFunction, $ThHint, $ThType) = $ErrMatches;

				if(isset(self::$Typehints[$ThHint])) {

					$ThBacktrace = debug_backtrace();
					$ThArgValue  = null;

					if(self::getTypehintedArgument($ThBacktrace, $ThFunction, $ThArgIndex, $ThArgValue)) {

						if(call_user_func(self::$Typehints[$ThHint], $ThArgValue)) {

							return true;
						}
					}
				}
			}
		}
	}



	private static function getTypehintedArgument($ThBackTrace, $ThFunction, $ThArgIndex, &$ThArgValue) {

		foreach($ThBackTrace as $ThTrace) {

			// Match the function; Note we could do more defensive error checking.
			if(isset($ThTrace['function']) && $ThTrace['function'] == $ThFunction) {

				$ThArgValue = $ThTrace['args'][$ThArgIndex - 1];

				return true;
			}
		}

		return false;
	}
}