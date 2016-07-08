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
class MKWidgetsAsset extends AssetBundle
{
    public $basePath = '@webroot/widgets/mk-widgets';
    public $baseUrl = '@web/widgets/mk-widgets';
    public $css = [

    ];
    public $js = [
		'core/exception.js',
		'core/options.js',
		'core/event.js',
		'core/entity.js',

		'core/application.js',
		'core/page.js',
		'core/widget.js',

		'dictionary/dictionary.js',

    ];
    public $depends = [
        'app\assets\AppAsset',
		'app\assets\DDTPlatformAsset',

    ];
}
