
KJT.component.loanMoneyAmount=(function($,window,undefined){

	//1.构造函数
	var obj = function(option){
		this.init(option);
	}
	//2.方法
	obj.prototype={
		constructor:obj,
		//基本属性
		//构造函数
		init:function(option){
			this.$NameInput=option.$NameInput;

			this.$Button=option.$Button;
			this.$kjt_breadcrumb=option.$kjt_breadcrumb;
			this.$info=option.$info;
			this.getId();
			this.bindButtonEvent();//绑定按钮的事件
			
		},
		//获取url中的id
		getId:function(){
			var id=window.location.href.split('?id=')[1];
			var type0=window.location.href.split('?id=')[2];
			var type=decodeURI(type0);
			var rate=window.location.href.split('?id=')[3];
			console.log(type);
			this.id=id;
			this.type=type;
			this.rate=rate;
			this.$info.html(type);


		},
		getNowFormatDate:function(){
	        var date = new Date();
	        var seperator1 = "-";
	        var year = date.getFullYear();
	        var month = date.getMonth() + 1;
	        var strDate = date.getDate();
	        if (month >= 1 && month <= 9) {
	            month = "0" + month;
	        }
	        if (strDate >= 0 && strDate <= 9) {
	            strDate = "0" + strDate;
	        }
	        var currentdate = year + seperator1 + month + seperator1 + strDate;
	        console.log(currentdate);
	        return currentdate;
	    },
		bindButtonEvent:function(){
			var _this=this;

			this.$Button.off("click.zcc").on("click.zcc",function(ev){
				ev.stopPropagation();
				var nm=_this.$NameInput.val();
				if(!nm){
					_this.$info.html("贷款金额不能为空！");
					return
				}
				_this.loading();
				var KJT_select=$("#KJT_select").val();
				console.log(KJT_select);
				var KJT_date=_this.getNowFormatDate();
				
				$.ajax({
					      "url": "https://d.apicloud.com/mcm/api/tradeRecord",
					      "type": "POST",
					      "cache": false,
						  "headers": apiHeader,
					      "data": {"type":_this.type,"amount":_this.$NameInput.val(),"recordType":"贷款","rate":_this.rate,"start_time":KJT_date,"subAccount":_this.id,"paybackType":KJT_select}
					}).success(function (data, status, header) {
						console.log(data);
						_this.loaded();
						_this.$info.html('贷款成功！<a id="aaa" href="#selectAccount?a='+_this.cardNumber+'">返回</a>');
					}).fail(function (header, status, errorThrown) {
					  //fail body
					});
			});
		},
		
		loading:function(){
			this.layerIndex = layer.load(1, {
			  shade: [0.3,'#000'] //0.1透明度的白色背景
			});
		},
		// 加载完毕
		loaded:function(){
			layer.close(this.layerIndex);
		},
		
	}
	return obj;
})(jQuery,this)