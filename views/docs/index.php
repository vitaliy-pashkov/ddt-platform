<?php

/* @var $this yii\web\View */

$this->title = 'Docs';

$this->registerJsFile('/general/js/docs.js', ["depends" => [\app\assets\DDTPlatformAsset::className() , \app\assets\MKWidgetsAsset::className()] ]);
?>
<div class="site-index">
	<div id="docs"><?php echo $jsonDoc; ?></div>
</div>
