var DDTPlatform = DDTPlatform || {};

DDTPlatform.DDTApp = Class(
	{
		extends: MK,//MKWidgets.Application,
		page: null,
		pages: {},
		widgetsConfig: {},
		widgets: {},
		pageIsInit: false,

		constructor: function ()
			{
			$(document).ready($.proxy(this.openPageByUrl, this));

			$(document).ready($.proxy(this.documentReadySlot, this));
			$(window).resize($.proxy(this.windowResizeSlot, this));
			},

		openPageByUrl: function ()
			{
			var url = window.location.pathname;
			if (url.indexOf('/', url.length - 1) !== -1)
				{
				url = url.substr(0, url.length - 1);
				}
			for (var pageClassName in this.pages)
				{
				var pageUrls = this.pages[pageClassName].url;
				if (!Array.isArray(pageUrls))
					{
					pageUrls = [pageUrls];
					}
				for (var i in pageUrls)
					{
					var urlReExp = new RegExp(pageUrls[i]);
					if (urlReExp.test(url))  //(pageUrls[i] == url)
						{
						this.page = new this.pages[pageClassName]();
						this.page.initPage();
						this.initWidgets();
						this.page.pageIsInit = true;
						break;
						}
					}
				if (this.page != undefined)
					{
					break;
					}
				}

			},

		documentReadySlot: function ()
			{
			},
		windowResizeSlot: function ()
			{
			},

		getUrlVars: function (name)
			{
			var vars = {};
			var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
				function (m, key, value)
				{
				vars[key] = value;
				});
			return vars[name];
			},

		//widgets functionality

		initWidgets: function ()
			{
			for (var name in this.widgetsConfig)
				{
				this.initWidget(name, this.widgetsConfig[name]);
				}
			},

		initWidget: function (name, widget, options)
			{
			if (options != undefined)
				{
				widget.config = Entity.assignObject(widget.config, options);
				}

			if (widget.type == "mk" || widget.type == null)
				{
				var widgetName = widget.widget;

				var ns = window;
				while (widgetName.indexOf('.') > 0)
					{
					var nsName = widgetName.substr(0, widgetName.indexOf('.'));
					ns = ns[nsName];
					widgetName = widgetName.substr(widgetName.indexOf('.') + 1);
					}

				if (widget.element == undefined)
					{
					this.widgets[name] = new ns[widgetName]($('<div/>'), widget.config);
					}

				if (typeof widget.element == 'string')
					{
					this.widgets[name] = new ns[widgetName]('#' + widget.element, widget.config);
					}
				if (widget.element instanceof jQuery)
					{
					this.widgets[name] = new ns[widgetName](widget.element, widget.config);
					}
				}

			if (widget.type == "jui")
				{
				var widgetName = widget.widget;
				$("#" + widget.element)[widgetName](widget.config);
				}
			return this.widgets[name];
			},

		registrateWidget: function (name, widget, options, afterInit)
			{

			this.widgetsConfig[name] = widget;

			if (this.page instanceof Page)
				{
				if (this.page.pageIsInit)
					{
					var widget = this.initWidget(name, widget, options);
					if (typeof afterInit == 'function')
						{
						afterInit(widget);
						}
					}
				}
			},

		registrateWidgetByRepresent: function (represent, name, getData, options, afterInit)
			{
			$.ajax(
				{
					url: "/represent/get-widget-config?represent=" + represent,
					type: "GET",
					data: getData,
					cache: false,
					widgetName: name,
					widgetOptions: options,
					afterInit: afterInit,
					app: this,
					success: this.loadWidgetConfigSuccess,
					error: this.getDictError
				});
			},

		loadWidgetConfigSuccess: function (data)
			{
			//warning: another context! this = jqxhr, this.app = app, this.widgetName = widgetName
			this.app.registrateWidget(this.widgetName, data, this.widgetOptions, this.afterInit);
			},
	}
);

var app = new DDTPlatform.DDTApp();


