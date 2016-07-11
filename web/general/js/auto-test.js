window.app.pages.autoTest = Class(
	{
		extends: DDTPlatform.Page,

		countStreams: 20,

		constructor: function ()
			{
			DDTPlatform.Page.prototype.constructor.apply(this);
			},

		initPage: function ()
			{
			var domTestsJson = $('#testsJson');
			this.testsNames = JSON.parse(domTestsJson.text());
			domTestsJson.empty();

			this.tests = new TestArray(this, this.testsNames);

			this.streams = new MK.Array;
			for (var i = 0; i < this.countStreams; i++)
				{
				var stream = new TestStream(this, this.tests, $('#frames'));

				this.streams.push(stream);
				}
			},
	},
	{
		url: '/tests/auto-test'
	}
);


var Test = Class(
	{
		extends: MK.Object,

		constructor: function (testName)
			{
			this.jset('testName', testName);
			this.jset('status', 'waiting');
			this.jset('error', '');

			var src = '/tests/test-partial?testJsFile=' + testName;
			this.jset('src', src);

			this.process = false;
			this.domRow = $('.test-row[data-filename="' + this.testName + '"]');
			this.bindNode('status', this.domRow.find('span'),
				{
					setValue: function(value)
						{
						$(this).text(value);
						if(value=='OK')
							{
							$(this).addClass('ok');
							}
						if(value=='FAILED')
							{
							$(this).addClass('failed');
							}
						}
				});
			},
	}
);

var TestArray = Class(
	{
		extends: MK.Array,
		Model: Test,

		constructor: function (page, testsNames)
			{
			this.page = page;
			this.recreate(testsNames);
			},

		getUnprocessTest: function ()
			{
			for (var i = 0; i < this.length; i++)
				{
				if (this[i].process == false)
					{
					return this[i];
					}
				}
			return null;
			}
	}
);

var TestStream = Class(
	{
		extends: MK,

		constructor: function (page, tests, domFrames)
			{
			this.tests = tests;
			this.domFrames = domFrames;

			this.runTesting();
			},

		runTesting: function ()
			{
			this.currentTest = this.tests.getUnprocessTest();

			if (this.currentTest == undefined)
				{
				return;
				}

			this.currentTest.process = true;
			this.currentTest.jset('status', 'processing');

			this.domFrame = $('<iframe/>');
			this.domFrames.append(this.domFrame);
			this.domFrame.on('load', $.proxy(this.frameIsReady, this));
			this.domFrame.attr('src', this.currentTest.src);
			},

		frameIsReady: function ()
			{
			this.domFrame.contents().find('#test-result').on('click', $.proxy(this.resultReadySlot, this));
			},

		resultReadySlot: function (event)
			{
			var result = JSON.parse($(event.target).text());
			this.currentTest.jset('status', result.status);
			this.currentTest.jset('result', result);

			this.domFrame.remove();
			this.runTesting();
			},
	});