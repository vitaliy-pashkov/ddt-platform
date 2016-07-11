<?php

namespace app\controllers;

use Yii;
use yii\filters\AccessControl;
use yii\web\Controller;
use yii\filters\VerbFilter;
use app\models\LoginForm;
use app\models\ContactForm;

class TestsController extends Controller
	{

	public function actionAutoTest($path)
		{

		$tests = $this->collectAllTests($path);

		return $this->render('auto-test.tpl', [
			'path' => $path,
			'tests' => $tests,
			'testsJson' => json_encode($tests),
		]);
		}



	private function collectAllTests($path)
		{
		$list = scandir($path);
		$tests = [];
		foreach ($list as $fileName)
			{
			$fullPath = $path . '/' . $fileName;
			if ($this->endsWith($fileName, '.test.js'))
				{
				$webPath = str_replace('../web/ddt-platform', '', $fullPath);
				$tests[] = $webPath;
				}
			else
				{
				if ($fileName != '.' && $fileName != '..' && is_dir($fullPath))
					{
					$tests = array_merge($tests, $this->collectAllTests($fullPath));
					}
				}


			}
		return $tests;
		}

	public function actionTest( $testJsFile)
		{
		return $this->render('test', [
			'testJsFile' => $testJsFile,
		]);
		}

	public function actionTestPartial( $testJsFile)
		{
		return $this->renderPartial('test-partial', [
			'testJsFile' => $testJsFile,
		]);
		}

	public function actionSaveResult()
		{
		$result = Yii::$app->request->post("result");
		$testJsFile = urldecode(Yii::$app->request->post("testJsFile"));

		$testJsFile = '../web/ddt-platform' . $testJsFile;

		$JsonResultFile = str_replace('test.js', 'result.json', $testJsFile);
		//		echo $JsonResultFile;
		$writeResult = file_put_contents($JsonResultFile, $result);
		echo "write $writeResult byts to file: $JsonResultFile \r\n";

		$pathParts = explode('/', $JsonResultFile);
		unset($pathParts[ count($pathParts) - 1 ]);
		$path = implode('/', $pathParts);

		$this->generateDoc($path);
		}

	private function generateDoc($testsPath)
		{

		$testResults = $this->readTestResults($testsPath);

		$doc = [
			'entityName' => $testResults[0]['entityName'],
			'extends' => $testResults[0]['extends'],
			'optionsDescription' => $testResults[0]['optionsDescription'],
			'properties' => $this->collectProperties($testResults),
			'eventsDescription' => $testResults[0]['eventsDescription'],
			'entries' => $this->collectEntriesDescription($testResults),
			'functions' => $this->collectFunctionsDescription($testResults),

		];


		$pathParts = explode('/', $testsPath);
		unset($pathParts[ count($pathParts) - 1 ]);
		$docPath = implode('/', $pathParts) . '/docs/' . $doc['entityName'] . '.doc.json';
		$writeResult = file_put_contents($docPath, json_encode($doc));
		echo "write $writeResult byts to file: $docPath\r\n";
		}

	private function collectProperties($testResults)
		{
		$properties = [];
		foreach ($testResults as $testResult)
			{
			foreach ($testResult['properties'] as $proposeProperty)
				{
				$f = 0;
				foreach ($properties as $existProperty)
					{
					if($proposeProperty['name'] == $existProperty['name'])
						{
						$f=1;
						if($proposeProperty['type'] != $existProperty['type'])
							{
							$existProperty['type'] = $existProperty['type'].' | '.$proposeProperty['type'];
							}

						}
					}
				if($f==0)
					{
					$properties[] = $proposeProperty;
					}
				}
			}
		return $properties;
		}

	private function collectEntriesDescription($testResults)
		{
		$entries = [];
		foreach ($testResults as $testResult)
			{
			foreach ($testResult['entries'] as $proposeEntry)
				{
				$f = 0;
				foreach ($entries as $existEntry)
					{
					if ($proposeEntry['name'] == $existEntry['name'] && $proposeEntry['type'] == $existEntry['type'] && $proposeEntry['cause'] == $existEntry['cause'])
						{
						$f = 1;
						break;
						}
					}
				if ($f == 0)
					{
					unset($proposeEntry['stackTrace']);
					foreach ($proposeEntry['args'] as &$arg)
						{
						unset($arg['value']);
						}
					$entries [] = $proposeEntry;
					}
				}
			}
		return $entries;
		}

	private function collectFunctionsDescription($testResults)
		{
		$functions = [];

		$allFunctions = $this->getAllFunctions($testResults);

		foreach ($allFunctions as $proposeFunction)
			{
			$f = 0;
			foreach ($functions as $existsFunction)
				{
				if ($proposeFunction['name'] == $existsFunction['name'] && $proposeFunction['className'] == $existsFunction['className'] && count($proposeFunction['args']) == count($existsFunction['args']))
					{

					$subf = 1;
					for ($i = 0; $i < count($proposeFunction['args']); $i++)
						{
						if ($proposeFunction['args'][ $i ]['type'] != $existsFunction['args'][ $i ]['type'])
							{
							$subf = 0;
							}
						}

					if ($subf == 1)
						{
						$f = 1;
						break;
						}
					}
				}
			if ($f == 0)
				{
				$functions [] = $proposeFunction;
				}
			}

		return $functions;
		}

	private function getAllFunctions($testResults)
		{
		$allFunctions = [];
		foreach ($testResults as $testResult)
			{
			foreach ($testResult['entries'] as $entry)
				{
				$stackTrace = $entry['stackTrace'];
				unset($entry['stackTrace']);
				unset($entry['type']);
				unset($entry['cause']);
				foreach ($entry['args'] as &$arg)
					{
					unset($arg['value']);
					}

				$allFunctions [] = $entry;
				$allFunctions = array_merge($allFunctions, $this->getFunctionsFromStack($stackTrace));
				}
			}
		return $allFunctions;
		}

	private function getFunctionsFromStack($stackTrace)
		{
		$functions = [];
		foreach ($stackTrace as $function)
			{
			$stackTrace = $function['stackTrace'];
			unset($function['stackTrace']);
			foreach ($function['args'] as &$arg)
				{
				unset($arg['value']);
				}
			$functions [] = $function;
			$functions = array_merge($functions, $this->getFunctionsFromStack($stackTrace));
			}
		return $functions;
		}

	private function readTestResults($path)
		{
		$list = scandir($path);
		$testResults = [];
		foreach ($list as $fileName)
			{
			if ($this->endsWith($fileName, '.result.json'))
				{
				$json = file_get_contents($path . '/' . $fileName);
				$testResults[] = json_decode($json, true);
				}
			}
		return $testResults;
		}

	public function endsWith($haystack, $needle)
		{
		// search forward starting from end minus needle length characters
		return $needle === "" || (($temp = strlen($haystack) - strlen($needle)) >= 0 && strpos($haystack, $needle, $temp) !== false);
		}

	}
