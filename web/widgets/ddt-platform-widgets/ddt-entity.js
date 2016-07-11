var DDTPlatform = DDTPlatform || {};
DDTPlatform.DDTEntityNS = DDTPlatform.DDTEntityNS || {};

DDTPlatform.DDTEntity = Class({
	extends: MK,

	constructor: function DDTEntity(options)
		{
		this.entityDoc = new DDTPlatform.DDTEntityNS.EntityDoc(this, this.options, arguments);

		this.initDocsFunctions();
		},

	constructorEnd: function (constructorName)
		{
		if (this.constructor.name == constructorName)
			{
			this.entityDoc.currentEntry = null;
			}
		else
			{
			this.entityDoc.pushExtend(constructorName);
			}
		},

	initDocsFunctions: function ()
		{

		var target = this.__proto__;
		while (target.constructor.name != 'Entity')
			{
			var funcs = Object.getOwnPropertyNames(target);

			for (var i = 0; i < funcs.length; i++)
				{
				var funcName = funcs[i];
				var className = target.constructor.name

				if (typeof this[funcName] === 'function')
					{
					if (funcName != 'instanceOf' && funcName != 'constructor' && funcName != 'extends' && funcName != 'optionsClass')
						{
						this[funcName] = this.callEvent(this[funcName], this.callStartSlot, this.callFinishSlot, funcName, className);
						}
					}
				}
			target = target.__proto__;
			}

		},

	callEvent: function (func, startCallback, finishCallback, funcName, className)
		{
		var context = this;
		return function ()
			{
			var args = context.collectArgsDescription(arguments, func);  //[].slice.call(arguments);
			var result;

			startCallback.apply(context, [args, this, funcName, className]);
			result = func.apply(this, arguments);
			finishCallback.apply(context, [result, funcName, className]);

			return result;
			}
		},

	collectArgsDescription: function (args, func)
		{
		var argsNames = this.getParamNames(func);
		var argsDescription = [];
		for (var i = 0; i < Math.max(args.length, argsNames.length); i++)
			{
			var arg = {
				type: null,
				name: null,
				value: null,
			};

			if (argsNames.length > i)
				{
				arg.name = argsNames[i];
				}

			if (args.length > i)
				{
				try
					{
					arg.type = args[i].constructor.name;
					}
				catch (exeption)
					{
					arg.type = typeof args[i];
					}

				arg.value = args[i];
				}
			argsDescription.push(arg);
			}
		return argsDescription;
		},

	getParamNames: function (func)
		{
		var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
		var ARGUMENT_NAMES = /([^\s,]+)/g;
		var fnStr = func.toString().replace(STRIP_COMMENTS, '');
		var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
		if (result === null)
			{
			result = [];
			}
		return result;
		},

	callStartSlot: function (args, context, funcName, className)
		{
		this.entityDoc.pushStack(funcName, args, context, className);
		},
	callFinishSlot: function (result, funcName, className)
		{
		this.entityDoc.pullStack(funcName, result, className);
		},

	trigger: function (event)
		{
		this.entityDoc.addTriggerEvent(event.name, event.type);

		var backupEntryPoint = this.entityDoc.currentEntry;
		this.entityDoc.currentEntry = null;

		MK.prototype.trigger.apply(this, [event.name, event]);

		this.entityDoc.currentEntry = backupEntryPoint;
		},
});


DDTPlatform.DDTEntityNS.EntityDoc = Class({
	extends: MK.Object,

	constructor: function EntityDoc(entity, constructorArgs)
		{
		this.entity = entity;

		this.jset({
			entityName: this.entity.constructor.name,
			extends: new MK.Array(),
			entries: new MK.Array(),
		});

		this.jset('options', entity.options.toJSON());
		this.jset('optionsDescription', entity.options.descriptions);
		this.jset('eventsDescription', entity.events.descriptions);

		this.currentEntry = this.createEntry('constructor', 'constructor', constructorArgs, this.entity, '', this.entity.constructor.name);
		this.trigger('entity-doc-change');
		},

	createEntry: function (type, funcName, args, context, cause, className)
		{
		var newEntryPoint = new DDTPlatform.DDTEntityNS.DocEntryPoint(type, funcName, args, context, cause, className);
		this.entries.push(newEntryPoint);
		this.trigger('entity-doc-change');

		return newEntryPoint;
		},

	pushExtend: function(extend)
		{
		this.extends.push(extend);
		},

	pushStack: function (funcName, args, context, className)
		{
		if (this.currentEntry == undefined)
			{
			var type = 'public function';
			var cause = null;
			if (args.length > 0)
				{
				var firstValue = args[0].value;
				if (firstValue instanceof jQuery.Event)
					{
					type = 'jQuery.Event';
					cause = $(firstValue.currentTarget).get(0).tagName + '.' + $(firstValue.currentTarget)
							.attr('class') + ' : ' + firstValue.type;
					}
				else if (firstValue instanceof MKWidgets.Event)
					{
					type = 'MKWidgets.Event-' + firstValue.type;
					cause = firstValue.objectName + " : " + firstValue.name;
					}
				else if (firstValue instanceof Event)
					{
					type = 'Event';
					}
				}

			if (context != this.entity)
				{
				type = 'callback';
				}
			this.currentEntry = this.createEntry(type, funcName, args, context, cause, className);
			}
		else
			{
			this.currentEntry.currentStackPoint.pushStack(funcName, args, context, className);
			}

		this.trigger('entity-doc-change');
		},

	pullStack: function (funcName, result, className)
		{
		this.currentEntry.currentStackPoint.pullStack(funcName, result, className);
		if (this.currentEntry.currentStackPoint == undefined)
			{
			this.currentEntry = null;
			}
		this.trigger('entity-doc-change');
		},

	addTriggerEvent: function (name, type)
		{
		this.currentEntry.currentStackPoint.addTriggerEvent(name, type);
		this.trigger('entity-doc-change');
		},

	toJSON: function()
		{
		var properties = this.collectProperties();
		this.jset('properties', properties);

		var json = MK.Object.prototype.toJSON.apply(this, []);
		return json;
		},

	collectProperties: function()
		{
		var properties = {};

		var target = this.entity;
		while (target.constructor.name != 'Entity')
			{
			var propertiesNames = Object.getOwnPropertyNames(target);

			for (var i = 0; i < propertiesNames.length; i++)
				{
				var funcName = propertiesNames[i];
				var className = target.constructor.name;

				if (typeof target[funcName] !== 'function')
					{
					var type = 'unknown';
					try
						{
						type = target[funcName].constructor.name;
						}
					catch (exeption)
						{
						type = typeof target[funcName];
						}

					properties[funcName] = {
						name: funcName,
						className: className,
						type: type
					}

					}
				}
			target = target.__proto__;
			}
		return properties;
		}

});


DDTPlatform.DDTEntityNS.DocStackPoint = Class({
	extends: MK.Object,

	constructor: function DocStackPoint(entryPoint, parent, funcName, args, context, className)
		{
		this.parent = parent;

		for (var i = 0; i < args.length; i++)
			{
			var arg = args[i];
			try
				{
				var json = JSON.stringify(arg.value);
				}
			catch (exception)
				{
				arg.value = 'complex object';
				}
			}
		if(funcName == 'constructor')
			{
			args = [
				{
					name : 'options',
					type : 'Options'
				}
			];
			}

		this.jset({
			name: funcName,
			className: className,
			args: args,
			//argsDescription: this.collectArgsDescription(funcName, args),

			stackTrace: new MK.Array(),
			triggerEvents: new MK.Array(),
		});

		try
			{
			this.jset('context', context.constructor.name);
			}
		catch (exeption)
			{
			this.jset('context', '');
			}

		this.entryPoint = entryPoint;
		},

	pushStack: function (funcName, args, context, className)
		{
		this.entryPoint.currentStackPoint = new DDTPlatform.DDTEntityNS.DocStackPoint(this.entryPoint, this, funcName, args, context, className);
		this.stackTrace.push(this.entryPoint.currentStackPoint);
		},

	pullStack: function (funcName, result, className)
		{
		this.jset('result', result);
		this.entryPoint.currentStackPoint = this.parent;
		},

	addTriggerEvent: function (name, type)
		{
		this.triggerEvents.push({
			name: name,
			type: type,
		});
		},

});

DDTPlatform.DDTEntityNS.DocEntryPoint = Class({
	extends: DDTPlatform.DDTEntityNS.DocStackPoint,

	constructor: function DocEntryPoint(type, funcName, args, context, cause, className)
		{
		DDTPlatform.DDTEntityNS.DocStackPoint.prototype.constructor.apply(this, [
			this,
			null,
			funcName,
			args,
			context,
			className
		]);

		this.jset({
			type: type,
			cause: cause
		});

		this.currentStackPoint = this;
		},

});
