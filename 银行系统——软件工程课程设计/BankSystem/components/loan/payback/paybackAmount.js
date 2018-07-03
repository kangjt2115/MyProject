
KJT.component.paybackAmount=(function($,window,undefined){

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
			this.$info=option.$info;
			this.getId();
			this.bindButtonEvent();//绑定按钮的事件
			
		},
		//获取url中的id
		getId:function(){
			var sub_id=window.location.href.split('?id=')[1];
			var ret_id=window.location.href.split('?id=')[2];
			var ret_amount=window.location.href.split('?id=')[3];
			var ret_type=window.location.href.split('?id=')[4];
			this.sub_id=sub_id;
			this.ret_id=ret_id;
	        console.log(ret_id);
			this.ret_amount=ret_amount;
			this.ret_type=ret_type;
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
					_this.$info.html("还款金额不能为空！");
					return
				}
				_this.loading();
				var KJT_date=_this.getNowFormatDate();
				$.ajax({
					      "url": "https://d.apicloud.com/mcm/api/tradeRecord",
					      "type": "POST",
					      "cache": false,
						  "headers": apiHeader,
					      "data": {"type":"还款","amount":_this.$NameInput.val(),"recordType":"还款","start_time":KJT_date,"subAccount":_this.sub_id}
					}).success(function (data, status, header) {
						console.log(data);
						$.ajax({
						      "url": "https://d.apicloud.com/mcm/api/tradeRecord/"+_this.ret_id,
						      "type": "POST",
						      "cache": false,
							  "headers": apiHeader,
						      "data": {"amount":parseInt(_this.ret_amount)-parseInt(_this.$NameInput.val()),"_method":"PUT"}
						}).done(function (data, status, header) {
						      //success body
								console.log(data);
						      _this.loaded();
							_this.$info.html('还款成功！<a id="aaa" href="#loan_paybackMoney?id='+_this.sub_id+'">返回</a>');
						}).fail(function (header, status, errorThrown) {
						      //fail body
						});
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