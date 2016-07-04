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

	public function actionIndex()
		{
		return $this->render('index');
		}


	}
