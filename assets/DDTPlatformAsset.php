<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace app\assets;

use yii\web\AssetBundle;


class DDTPlatformAsset extends AssetBundle
{
    public $basePath = '@webroot/widgets/ddt-platform-widgets';
    public $baseUrl = '@web/widgets/ddt-platform-widgets';
    public $css = [
    ];
    public $js = [
		'ddt-entity.js',
		'ddt-app.js',
		'ddt-page.js',
		'ddt-test-page.js',

    ];
    public $depends = [
        'app\assets\AppAsset',
    ];
}
