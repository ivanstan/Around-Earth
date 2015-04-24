<?php

namespace system;

use system\Application;

class Router {
	const pathQueryParameter = 'q';

	public static function parseRoute(Application $app) {
		$config = $app->config;

		$defaultControllerName = 'Index';
		$defaultControllerActionName = 'index';

		$request = $_SERVER['REQUEST_URI'];
		$parameters = $_GET;

		$path = $parameters[self::pathQueryParameter];
		unset($parameters[self::pathQueryParameter]);
		$controllerParts = explode('/', $path);

		$controller = isset($controllerParts[0]) && $controllerParts[0]!=''
			? $controllerParts[0] : $defaultControllerName;
		$path = $controller;
		$controller = implode(array_map('ucfirst',explode('-', $controller)));
		$controllerClassName = 'controllers\\' . $controller . 'Controller';

		$action = isset($controllerParts[1]) && $controllerParts[1]!=''
			? $controllerParts[1] : $defaultControllerActionName;
		$path .= '/'.$action;
		$action = lcfirst(implode(array_map('ucfirst',explode('-', $action))));
		$actionMethodName = $action . 'Action';

		$status = method_exists('\\' . $controllerClassName, $actionMethodName) ?
			$app::ROUTE_FOUND : $app::ROUTE_NOT_FOUND;

		$route = array(
			'request' => $request,
			'path'	=> $path,
			'controller' => $controller,
			'controller_class' => $controllerClassName,
			'action' => $action,
			'action_method' => $actionMethodName,
			'params' => $parameters,
			'status' => $status,
		);

		return $route;
	}
}
