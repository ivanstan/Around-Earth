<?php namespace system;

class AssetManager {

	private $css = array();
	private $javascript = array();

	/**
	 * @return array
	 */
	public function getCss() {
		return $this->css;
	}

	/**
	 * @param array $css
	 */
	public function addCss($css) {
		$this->css[] = $css;
	}

	/**
	 * @return array
	 */
	public function getJavascript() {
		return $this->javascript;
	}

	/**
	 * @param array $javascript
	 */
	public function addJavascript($javascript) {
		$this->javascript[] = $javascript;
	}

}