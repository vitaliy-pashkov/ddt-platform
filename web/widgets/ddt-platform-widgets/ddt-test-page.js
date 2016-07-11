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

		compareDom: function (sample, audit)
			{

			var compare = true;

			if (sample.children().length == 0)
				{
				if (sample.text() != audit.text())
					{
					return 'error: ' + sample.text() + ' != ' + audit.text();
					}
				else
					{
					return true;
					}
				}

			sample.children().each(
				$.proxy(function (index, sampleElement)
				{
				var selector = this.createSelector(sampleElement)
				var result = audit.children(selector);
				var elementCompare = false;

				result.each(
					$.proxy(function (index, auditElement)
					{
					var tryCompare = this.compareDom($(sampleElement), $(auditElement));
					if (tryCompare == true)
						{
						elementCompare = true;
						}
					}, this));
				if (elementCompare == false)
					{
					compare = "can't find element " + $(sampleElement).html();
					}
				}, this));

			return compare;
			},

		createSelector: function (element)
			{
			var tagName = element.tagName;
			var attrs = element.attributes;
			var classesStr = $(element).attr('class').split(' ').join('.');
			if (classesStr.length > 0)
				{
				classesStr = '.' + classesStr;
				}
			var attrsStr = '';

			for (var i = 0; i < attrs.length; i++)
				{
				if (attrs[i].name != 'class')
					{
					attrsStr += '[' + attrs[i].name + '=' + attrs[i].value + ']';
					}
				}
			var selector = tagName + classesStr + attrsStr;
			return selector;
			},
		
		compareJson: function (sample, audit, path)
			{
			path = path || 'root';
			var samplePath = path.replace('root', 'sample');
			var auditPath = path.replace('root', 'audit');
			
			if (typeof sample != 'object')
				{
				if (sample == audit)
					{
					return true;
					}
				else
					{
					return samplePath+'('+sample+')' + ' != ' + auditPath+'('+audit+')';
					}
				}
			else
				{
				if (sample instanceof Array)
					{
					if (!(audit instanceof Array))
						{
						return samplePath + ' is array and ' + auditPath + 'is not array';
						}

					if (sample.length != audit.length)
						{
						return samplePath + ' length !=  ' + auditPath + ' length';
						}

					var itemsCompare = true;
					for (var i = 0; i < sample.length; i++)
						{
						itemsCompare = this.compareJson(sample[i], audit[i], path+'['+i+']');
						if (itemsCompare != true)
							{
							break;
							}
						}
					return itemsCompare;
					}
				else if (sample instanceof Object)
					{
					if (!(audit instanceof Object))
						{
						return samplePath + ' is object and ' + auditPath + 'is not object';
						}
					var itemsCompare = true;
					for (var key in sample)
						{
						if (!(key in audit))
							{
							return 'key ' + key + ' is not in ' + auditPath;
							}

						itemsCompare = this.compareJson(sample[key], audit[key], path+'->'+key);
						if (itemsCompare != true)
							{
							break;
							}
						}
					return itemsCompare;
					}
				else
					{
					return 'undefind type of ' + JSON.stringify(sample);
					}
				}

			},

		printCompareResult: function (compareResult)
			{
			if (compareResult == true)
				{
				this.testResult = {'status': 'OK'};
				}
			else
				{
				this.testResult = {'status': 'FAILED', error: compareResult};
				}

			this.printTestResult();
			},

		printTestResult: function ()
			{
			$('#test-result').text(JSON.stringify(this.testResult));

			if(this.testResult.status == "OK")
				{
				$('#test-status').addClass('ok').text('OK');
				}
			if(this.testResult.status == "FAILED")
				{
				$('#test-status').addClass('failed').text('FAILED');
				$('#test-error').text("Error: "+this.testResult.error);
				}


			$('#test-result').on('click',
				function (event)
				{
				event.stopPropagation();
				});
			$('#test-result').trigger('click');
			}


	});
