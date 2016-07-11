{*{php}*}
{*$this->title = 'Tests';*}

{*$this->registerJsFile('/general/js/auto-test.js' , ["depends" => [\app\assets\DDTPlatformAsset::className() , \app\assets\MKWidgetsAsset::className()] ]);*}
{*{/php}*}

{set title="Tests"}
{registerJsFile url='/general/js/auto-test.js' depends=['\app\assets\DDTPlatformAsset', '\app\assets\MKWidgetsAsset']}


<div id="testsJson">
    {$testsJson}
</div>
<div id="path">
    {$path}
</div>
<div class="tests-page row">
    <div id="tests" class="col-md-6">
        {foreach $tests as $fileName}
            <div data-filename="{$fileName}" class="row test-row">
                <div class="col-md-8">
                    <a href="/tests/test?testJsFile={$fileName}">{$fileName}</a>
                    </div>
                <div class="col-md-2">
                <span class="test-status">waiting</span>
                    </div>
            </div>
        {/foreach}
    </div>

    <div id="frames" class="col-md-6">
        {*<iframe class="test-frame" id="test-frame" src=""></iframe>*}
    </div>

</div>

