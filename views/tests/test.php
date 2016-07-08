<?php
use yii\helpers\Html;
$this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
<head>
	<?php $this->head() ?>
	<?= Html::csrfMetaTags() ?>
</head>
<body class="hold-transition skin-blue sidebar-mini">
<?php $this->beginBody() ?>


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

	<div id="entity-playground" class="col-md-6 entity-playground">
		<div id="element">
		</div>
	</div>

	<div id="entity-doc" class="col-md-6 entity-doc">
	</div>

</div>

<div class="tests-page row">

	<div id="test-result" class="col-md-6 test-result">
	</div>

</div>


<?php $this->endBody() ?>
</body>
</html>
<?php $this->endPage() ?>
