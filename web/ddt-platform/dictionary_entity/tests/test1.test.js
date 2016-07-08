window.app.pages.tests = Class(
	{
		extends: DDTPlatform.TestPage,
		constructor: function tests()
			{
			//DDTPlatform.Page.prototype.constructor.apply(this);
			},

		initEntity: function ()
			{

			this.entity = new MKWidgets.Dictionary1({
				dataSource: 'local',
				data: [
					{
						id: 1,
						text: 'qwe'
					},
					{
						id: 2,
						text: 'asd'
					},
					{
						id: 3,
						text: 'zxc'
					},
				]
			});
			},

		checkTestResult: function ()
			{
			this.testResult = {'status': 'OK'};
			this.printTestResult();
			},

	},
	{
		url: ['/tests/test']
	}
);