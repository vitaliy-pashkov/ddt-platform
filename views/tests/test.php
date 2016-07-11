<?php
/* @var $this yii\web\View */

$this->title = 'Tests';

$this->registerJsFile('/ddt-platform' . $testJsFile, [
	"depends" => [
		\app\assets\DDTPlatformAsset::className(),
		\app\assets\MKWidgetsAsset::className(),
	],
]);

?>

<div class="tests-page row">

	<div id="test-result" class="col-md-6 test-result">
	</div>

	<div class="col-md-6">
		<p id="test-status" class="test-status">
			waiting...
		</p>
		<p id="test-error" class="test-error">
		</p>
	</div>


</div>

<div class="tests-page row">

	<div id="entity-playground" class="col-md-6 entity-playground">
		<div id="element">
		</div>
	</div>

	<div id="entity-doc" class="col-md-6 entity-doc">
	</div>

</div>
