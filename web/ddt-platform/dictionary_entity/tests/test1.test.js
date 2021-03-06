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
			var sample = this.declareDom();
			var audit = this.entity.element;

			var compareResult = this.compareDom(sample, audit);

			this.printCompareResult(compareResult);
			},

		declareDom: function ()
			{


			var html =
				"<div class='qwe wer' qwe='asd'>" +
				"<p class='zxc'>asd</p>" +
				"</div>" +
				"<div class='qwe'>" +
				"<p class='zxc'>dfg</p>" +
				"</div>";
			return $('<div/>').html(html);

			}

	},
	{
		url: ['/tests/test']
	}
);