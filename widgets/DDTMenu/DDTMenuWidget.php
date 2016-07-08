<?php
namespace app\widgets\DDTMenu;

use yii\base\Widget;

/**
 * Description of CrudTableWidget
 *
 * @author pvo
 */
class DDTMenuWidget extends \dmstr\widgets\Menu
	{
	public $ddtPlatformRoot;

	static $testExt     = '.test.js';
	static $autoTestExt = '.autotest.js';
	static $resultExt   = '.result.json';
	static $docJsonExt  = '.doc.json';
	static $docExt      = '.doc.md';
	static $entityExt   = '_entity';

	public function init()
		{

		//		$this->itemsDescr = [
		//			'test' => '.test.js',
		//			'testResult' => '.result.json',
		//			'docJson' => '.doc.json',
		//			'docMD' => '.doc.md',
		//			'entity' => '_entity',
		//		];

		//		$this->items = [
		//			[
		//				'label' => 'Dictionary',
		//				'items' => [
		//					[
		//						'label' => 'Docs',
		//						'items' => [
		//							['label' => 'Dictionary', 'url' => ['docs/index', 'entity' => 'dictionary']],
		//						],
		//					],
		//					[
		//						'label' => 'Tests',
		//						'items' => [
		//							['label' => 'Dictionary', 'url' => ['tests/index', 'entity' => 'dictionary']],
		//						],
		//					],
		//				],
		//			],
		//		];
		$this->items = $this->generateItems($this->ddtPlatformRoot, true);

		parent::init();
		}

	public function generateItems($path, $addAutoTest = false, $entity = '', $relativePath = '')
		{

		$items = [];

		if ($addAutoTest == true)
			{
			$items [] = [
				'label' => 'auto-test', //str_replace(static::$testExt, '', $dirItem),
				'url' => [
					'tests/auto-test',
					'path' => $path,
				],
			];
			}

		$list = scandir($path);

		foreach ($list as $dirItem)
			{

			if ($dirItem == '.' || $dirItem == '..')
				{
				continue;
				}

			if ($this->endsWith($dirItem, static::$testExt))
				{
				$items[] = [
					'label' => $dirItem, //str_replace(static::$testExt, '', $dirItem),
					'url' => [
						'tests/test',
//						'entity' => $entity,
						'testJsFile' => $relativePath . '/' . $dirItem,
					],
				];
				}
			elseif ($this->endsWith($dirItem, static::$docJsonExt))
				{
				$items[] = [
					'label' => $dirItem, //str_replace(static::$docJsonExt, '', $dirItem),
					'url' => [
						'docs/index',
//						'entity' => $entity,
						'docFile' => $relativePath . '/' . $dirItem,
					],
				];
				}
			elseif ($this->endsWith($dirItem, static::$resultExt))
				{
				}
			elseif ($this->endsWith($dirItem, static::$docExt))
				{
				}
			else
				{
				$addAutoTest = false;
				if ($this->endsWith($dirItem, static::$entityExt))
					{
					$entity = str_replace(static::$entityExt, '', $dirItem);
					$addAutoTest = true;
					}

				$items[] = [
					'label' => $dirItem,
					'items' => $this->generateItems($path . '/' . $dirItem, $addAutoTest, $entity, $relativePath . '/' . $dirItem),
				];
				}
			}

		return $items;
		}

	public function endsWith($haystack, $needle)
		{
		// search forward starting from end minus needle length characters
		return $needle === "" || (($temp = strlen($haystack) - strlen($needle)) >= 0 && strpos($haystack, $needle, $temp) !== false);
		}

	}
