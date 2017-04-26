(function(window,factory){
	var df = factory(window,window.document);
	window.df = df;
	if(typeof module == 'object' && module.exports){
		module.exports = df;
	}
}(window, function l(window,document){
	'use strict';
	
	function hooks(ops){
		/*
			调用的时候ops可放入以下参数
			new Date(...)
			'Tue Apr 25 2017 14:28:07 GMT+0800 (中国标准时间)'
			{
				//config配置....
				locale: 'en',
				dateformat: 'yyyy-MM-dd',
				date: '2015-5-5'
			}
		 */
		DmomentConfig(ops);
		return new Dmoment();
	}
	function Dmoment(){

	}
	var dateConf = {
		locale: 'cn', //地区语言
		dateformat: 'yyyy-MM-dd', //默认格式
		date: new Date() //日期时间
	}
	var _toString = Object.prototype.toString;
	var formatTokens = /[Hh]mm(ss)?|MM?M?M?|DD?D?D?|ddd?d?|yyyy|YYYY|YY?|hh?|HH?|mm?|ss?|S{1,9}|./g;
	var formatFunctions = {};

	function isFunction(fn){
		return typeof fn === 'function' && _toString.call(fn) === '[object Function]';
	}
	function isObject(obj){
		return typeof obj === 'object' && _toString.call(obj) === '[object Object]';
	}
	function isDate(obj){
		return _toString.call(obj) === '[object Date]';
	}
	function isNumber(obj){
		return toString.call(obj) ==='[object Number]';
	}
	function dateFormat(format){
		format = format || dateConf.dateformat;
		var arr = format.match(formatTokens);
		console.log(arr);
	}
	function DmomentConfig(ops){
		ops = ops || dateConf.date;
		if(!isDate(ops) && isObject(ops)){
			CopyConfig(ops);
		}else{
			!isDate(ops) && ops.replace(/-/g,'/');
			dateConf.date = new Date(ops);
		}
	}
	function zeroFill(number, targetLength, forceSign){
		console.log(number, targetLength, forceSign);

	}
	function addFormatToken(token, padded, ordinal, callback){
		var func = callback;
		if(typeof func === 'string'){
			func = function(){
				return this[callback]();
			}
		}
		if(token){
			formatFunctions[token] = func;
		}
		if(padded){
			formatTokenFunctions[padded[0]] = function(){
				return zeroFill(func.apply(this,arguments), padded[1],padded[2]);
			}
		}
	}
	function get(dmom, unit){
		return dmom.date['get' + unit]() || NaN;
	}
	function CopyConfig(ops){
		for(var key in ops){
			dateConf[key] = ops[key];
		}
	}
	addFormatToken(0, ['YYYY', 4], 0, 'year');
	var proto = Dmoment.prototype;
	proto.format = dateFormat;

	hooks.prototype = proto;
	return hooks;
	
}))
