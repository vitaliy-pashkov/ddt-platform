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
				element: $('#element'),
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
			var sample = {
				test: 'qwe',
				test1: 1,
				arrayTest: [
					{
						test2: 2,
						test3: 3,
					},
					{
						test2: 4,
						test3: 5,
					},
				]
			};
			var audit = this.entity.jsonTest;

			var compareResult = this.compareJson(sample, audit);
			this.printCompareResult(compareResult);
			},

	},
	{
		url: ['/tests/test']
	}
);