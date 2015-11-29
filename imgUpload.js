 $.fn.uploadImg = function(options){
		var options = $.extend({},$.fn.uploadImg.defaults,options);
		var self = this;
		self.css("position","relative");
		console.log(this[0]);
		this[0].appendChild(init(options));
		
	}
	function init(options){
		/* 首先创建一个容器控制一行多少个 */
		var contrainer = document.createElement("div");
		contrainer.style.width =  options.colCount * options.width + (options.colCount * 10)+"px";
		contrainer.style.margin = "0px auto";
		
		/* 创建+号 */
		var add = document.createElement("div");
		var newtext=document.createTextNode("+");
		add.style.width = options.width + "px";
		add.style.height = options.height + "px";
		add.style.border = "1px dashed #aaa";
		add.style.lineHeight = "150px";
		add.style.textAlign = "center";
		add.style.fontWeight = "bold";
		add.style.fontSize = options.width +"px";
		add.style.cursor = "pointer";
		add.appendChild(newtext);
		contrainer.appendChild(add);
		
		return contrainer
	}
	$.fn.uploadImg.defaults = {
		colCount: 4,
		width: 150,
		height: 150,
		callback: function(){}
	}	 