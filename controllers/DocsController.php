<?php

namespace app\controllers;

use Yii;
use yii\filters\AccessControl;
use yii\web\Controller;
use yii\filters\VerbFilter;
use app\models\LoginForm;
use app\models\ContactForm;

class DocsController extends Controller
	{

	public function actionIndex($docFile)
		{

		$jsonDoc = file_get_contents('../web/ddt-platform'.$docFile);
//		$doc = json_decode($json, true);

//		echo $jsonDoc ; die;
		return $this->render('index', [
			'jsonDoc'=>$jsonDoc
		]);
		}


	}
