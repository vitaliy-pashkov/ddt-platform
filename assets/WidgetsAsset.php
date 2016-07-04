<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace app\assets;

use yii\web\AssetBundle;

/**
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */
class WidgetsAsset extends AssetBundle
{
    public $basePath = '@webroot/widgets';
    public $baseUrl = '@web/widgets';
    public $css = [
        'jjsonviewer/jjsonviewer.css',
    ];
    public $js = [
		'jjsonviewer/jjsonviewer.js',
    ];
    public $depends = [
        'app\assets\AppAsset',
    ];
}
