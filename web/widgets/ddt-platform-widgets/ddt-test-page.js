var DDTPlatform = DDTPlatform || {};

DDTPlatform.TestPage = Class(
	{
		extends: DDTPlatform.Page,
		resultTimeout: 5000,

		constructor: function TestPage()
			{
			},

		initPage: function ()
			{
			this.initEntity();
			this.initJsonViewer();

			this.delay(this.checkTestResult, this.resultTimeout, this);
			},

		initEntity: function ()
			{

			},

		initJsonViewer: function ()
			{
			this.entity.entityDoc.onDebounce('entity-doc-change',
				function ()
				{
				$('#entity-doc').empty();

				//var obj = JSON.parse( JSON.stringify(this.entity.entityDoc.toJSON()) );

				$('#entity-doc').jsonViewer(this.entity.entityDoc.toJSON());
				}, 100, true, this);

			this.entity.entityDoc.onDebounce('entity-doc-change', this.sendToServer, 1000, true, this);
			},

		sendToServer: function ()
			{
			var result = JSON.stringify(this.entity.entityDoc.toJSON());
			$.ajax({
				url: '/tests/save-result',
				data: {result: result, testJsFile: app.getUrlVars('testJsFile')},
				type: "POST",
				//success: this.saveSuccess,
				//error: this.saveError,
			});
			},

		checkTestResult: function ()
			{

			},

		printTestResult: function()
			{
			$('#test-result').text( JSON.stringify( this.testResult )  );
			$('#test-result').trigger('click');
			}
	});
