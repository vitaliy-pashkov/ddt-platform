<?php

/* @var $this yii\web\View */

$this->title = 'Docs';

$this->registerJsFile("/general/js/docs.js", ["depends"=>\app\assets\WidgetsAsset::className()]);
?>
<div class="site-index">
	<div id="jjson" class="jjson"></div>
</div>
