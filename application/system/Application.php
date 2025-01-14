<?php

namespace system;

use system\Router;
use system\User;
use system\AssetManager;
use Symfony\Component\Yaml\Parser;

/**
 * First class thats instantiated in the lifecycle of the application.
 */
class Application {
	/**
	 * @var array Array with options read from config.ini (environment specific)
	 */
	public $config = array();

	/**
	 * @var array Array with route specific info (controller, action, ...)
	 */
	public $route = array();

	/**
	 * @var \PDO PDO singleton
	 */
	public $pdo = null;

	/**
	 * @var \Smarty Smarty singleton
	 */
	public $twig = null;

	public $baseUrl;

	public $appRoot;

	public $assetManager;

	private $cacheHandler;

	const ROUTE_FOUND         = 1;
	const ROUTE_NOT_FOUND     = 2;
	const ROUTE_SITE_OFFLINE  = 3;
	const ROUTE_ACCESS_DENIED = 4;

	public function getEnvironment() {
		return isset($_ENV['APP_ENVIRONMENT']) ? strtolower($_ENV['APP_ENVIRONMENT']) : 'integration';
	}

	/**
	 * First method called after application class is instantiated.
	 *
	 * It creates various singletons used by the application and ultimately renders the view.
	 *
	 * @param string $environment
	 */
	public function boot() {
		$this->appRoot = rtrim(getcwd(), '/\\') . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR;

		$yaml         = new Parser();
		$this->config = $yaml->parse(file_get_contents($this->appRoot . 'config/general.yaml'));

		$envConfig = $this->appRoot . 'config/' . $this->getEnvironment() . '.yaml';
		if(file_exists($envConfig)) {
			$this->config = array_merge($this->config, $yaml->parse(file_get_contents($envConfig)));
		}

		if($this->config['debug'] == 1) {
			error_reporting(E_ALL);
			ini_set('display_errors', 1);
		}

		$scheme        = isset($_SERVER['REQUEST_SCHEME']) ? $_SERVER['REQUEST_SCHEME'] : 'http';
		$baseUrl       = $scheme . '://' . $_SERVER['SERVER_NAME'];
		$this->baseUrl = $baseUrl;

		// PARSE ROUTE
		$this->route = Router::parseRoute($this);

		// CONNECT TO DATABASE
		$this->connectToDatabase();

		// SET LOCALE
		$this->setLocale();

		$this->assetManager = new AssetManager();

		if($this->route['status'] == self::ROUTE_FOUND) {
			// INSTANTIATE APPROPRIATE CONTROLLER
			$controllerClassName = $this->route['controller_class'];
			$controllerObject    = new $controllerClassName($this);

			// CALL APPROPRIATE CONTROLLER ACTION
			$actionMethodName = $this->route['action_method'];
			$variables        = $controllerObject->$actionMethodName();

			$variables['assetCss']        = $this->assetManager->getCss();
			$variables['assetJavascript'] = $this->assetManager->getJavascript();

			$this->setupTwig();
			$template = $this->twig->loadTemplate($this->route['action'] . '.html.twig');

			echo $template->render($variables);
		}
	}

	public function setupTwig() {
		\Twig_Autoloader::register();

		$loader = new \Twig_Loader_Filesystem($this->appRoot . 'application/views');

		$this->twig = new \Twig_Environment($loader);

		$this->twig = new \Twig_Environment($loader, array(
			'autoescape' => false
		));

		$this->twig->addFilter('var_dump', new \Twig_Filter_Function('var_dump'));

		return $this->twig;
	}

	/**
	 * List of available languages in application.
	 * The first one in the list is system default language.
	 *
	 * @return array
	 */
	public function getLanguages() {
		return array(
			'en_GB' => 'English',
		);
	}

	/**
	 * Set the locale of the application.
	 *
	 * @param string $locale
	 *    format aa_BB (aa represents the language and BB represents the country).
	 *    If omitted get user's prefered language or system default language.
	 */
	public function setLocale($locale = null) {
		if(is_null($locale)) {
			$languages = $this->getLanguages();
			$locale    = key($languages);
		}

		putenv("LC_ALL=$locale");
		setlocale(LC_ALL, $locale);
		bindtextdomain("messages", "./locale");
		textdomain("messages");
	}

	private function connectToDatabase() {
		if(isset($this->config['database'])) {
			$databaseHost     = $this->config['database']['host'];
			$databaseName     = $this->config['database']['database'];
			$databaseUsername = $this->config['database']['username'];
			$databasePassword = $this->config['database']['password'];
			$dsn              = "mysql:dbname={$databaseName};host={$databaseHost}";

			try {
				$this->pdo = new \PDO($dsn, $databaseUsername, $databasePassword);
				if($this->config['debug'] == 1) {
					$this->pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
				}
			} catch(\PDOException $e) {
				echo 'Connection failed: ' . $e->getMessage();
			}
		}
	}

	/**
	 * Returns cache handler class defined in configuration value default_cache_class.
	 *
	 * @return cacheHandler class extended from abstract CacheHandler
	 */
	public function getCacheHandler() {
		if(!$this->cacheHandler) {
			$config = $this->getConfig();

			$classExists = file_exists('system/cache/' . $config['default_cache_class'] . '.php');
			if($classExists) {
				$cacheHandlerClass = 'system\cache\\' . $config['default_cache_class'];
				if(class_exists($cacheHandlerClass)) {
					$this->cacheHandler = new $cacheHandlerClass($this);
				}
			}
		}

		return $this->cacheHandler;
	}

}
