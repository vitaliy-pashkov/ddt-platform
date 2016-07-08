window.app.pages.autoTest = Class(
	{
		extends: DDTPlatform.Page,

		countStreams : 10,

		constructor: function ()
			{
			DDTPlatform.Page.prototype.constructor.apply(this);
			},

		initPage: function()
			{

			var domTestsJson = $('#testsJson');
			this.tests = JSON.parse( domTestsJson.text() );
			domTestsJson.empty();

			

			this.domFrame = $('#test-frame');

			//var domTestRows = $('.test-row');

			//domTestRows.each(
			//	function()
			//	{
			//	var link = $(this).find('a').attr('href');
			//	$('#test-frame').attr('src', link);
			//	});

			for(var i in this.tests)
				{
				this.currentTestIndex = i;
				this.currentTestName =  this.tests[i];
				this.runTest(this.currentTestName);
				}
			},

		runTest: function(testName)
			{
			var link = '/tests/test-partial?testJsFile='+testName;
			this.domFrame.on('load', $.proxy(this.frameIsReady, this));
			this.domFrame.attr('src', link);
			},

		frameIsReady: function()
			{
			this.domFrame.contents().find('#test-result').on('click', $.proxy(this.resultReadySlot, this));
			},

		resultReadySlot: function(event)
			{
			var result = JSON.parse($(event.target).text());

			$('.test-row[data-filename="'+this.currentTestName+'"]').find('span').text( result.status );
			},

	},
	{
		url: '/tests/auto-test'
	}
);