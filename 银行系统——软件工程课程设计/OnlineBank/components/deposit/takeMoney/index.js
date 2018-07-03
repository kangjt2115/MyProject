
KJT.component.takeMoneyAmount=(function($,window,undefined){

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
			var id=window.location.href.split('?id=')[1];
			console.log(id);
			this.id=id;
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
				_this.loading();
				var nm=_this.$NameInput.val();
				if(!nm){
					_this.$info.html("存款金额不能为空");
					return
				}
				$.ajax({
				  "url": "https://d.apicloud.com/mcm/api/subAccount/"+_this.id,
				  "cache": false,
				  "headers": apiHeader,
				  "type": "GET",
				  "data":{
				  	"filter":{
				  		"fields":["money","id","deposit_type","role","cardNumber"],
				  		}
				  	}
				}).success(function (data, status, header) {
				  console.log(data);
				  _this.kk=data.money;
				  _this.role=data.role;
				  _this.cardNumber=data.cardNumber;
				  _this.deposit_type=data.deposit_type;
				  $.ajax({
					  "url": "https://d.apicloud.com/mcm/api/depositRate",
					  "cache": false,
					  "headers": apiHeader,
					  "type": "GET",
					  "data":{
					  	"filter":{
					  		"where":{"type":_this.deposit_type},
					  		"fields":["rate"],
					  		}
					  	}
					}).success(function (data, status, header) {
					  console.log(data);
					  _this.rate=data[0].rate;
					  _this.takeMoney();
					}).fail(function (header, status, errorThrown) {
					  //fail body
					  alert(JSON.stringify(header));
					});
				}).fail(function (header, status, errorThrown) {
				  //fail body
				  alert(JSON.stringify(header));
				});
				
			});
		},
		
		takeMoney:function(){
			var _this=this;
			var KJT_date=_this.getNowFormatDate();

			$.ajax({
					      "url": "https://d.apicloud.com/mcm/api/tradeRecord",
					      "type": "POST",
					      "cache": false,
						  "headers": apiHeader,
					      "data": {"type":_this.deposit_type,"amount":_this.$NameInput.val(),"recordType":"取款","rate":_this.rate,"start_time":KJT_date,"subAccount":_this.id}
					}).success(function (data, status, header) {
						console.log(data);
						$.ajax({
						      "url": "https://d.apicloud.com/mcm/api/subAccount/"+_this.id,
						      "type": "POST",
						      "cache": false,
							  "headers": apiHeader,
						      "data": {"money":parseInt(_this.kk)-parseInt(_this.$NameInput.val()),"_method":"PUT"}
						}).done(function (data, status, header) {
						      //success body
								console.log(data);
						      _this.loaded();
							_this.$info.html('取款成功！<a id="aaa" href="#selectAccount?a='+_this.cardNumber+'">返回</a>');
						}).fail(function (header, status, errorThrown) {
						      //fail body
						});
					}).fail(function (header, status, errorThrown) {
					  //fail body
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