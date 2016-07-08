window.app.pages.docs = Class(
	{
		extends: DDTPlatform.Page,
		constructor: function ()
			{
			DDTPlatform.Page.prototype.constructor.apply(this);
			},

		initPage: function()
			{
			var domDocs = $('#docs');
			var json = domDocs.text();
			domDocs.empty();
			domDocs.jsonViewer( JSON.parse(json) );
			}
	},
	{
		url: '/docs/*'
	}
);