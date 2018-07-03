
KJT.component.saveMoneyAmount=(function($,window,undefined){

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
			console.log(type);
			this.id=id;
			  if (type=='活期储蓄') {this.$info.html("活期储蓄 1元起存");}
				else if (type=='定期储蓄一年') {
					var KJT_date1=this.getNowFormatDate(1);
					this.KJT_datek=KJT_date1;
					this.$info.html("定期储蓄 100元起存");}
				else if (type=='定期储蓄五年') {
					var KJT_date5=this.getNowFormatDate(5);
					this.KJT_datek=KJT_date5;
					this.$info.html("定期储蓄 100元起存");}
				else if (type=='定活两便') {this.$info.html("定活两便 50元起存");}
			this.$kjt_breadcrumb.html(type);

		},
		getNowFormatDate:function(a){

	        var date = new Date();
	        var seperator1 = "-";
	        var year = date.getFullYear()+a;
	        console.log(year);
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
					_this.$info.html("存款金额不能为空");
					return
				}
				_this.loading();
				var KJT_date=_this.getNowFormatDate(0);
				_this.KJT_date=KJT_date;
				$.ajax({
				  "url": "https://d.apicloud.com/mcm/api/subAccount/"+_this.id,
				  "cache": false,
				  "headers": apiHeader,
				  "type": "GET",
				  "data":{
				  	"filter":{
				  		"fields":["money","deposit_type","cardNumber"],
				  		}
				  	}
				}).success(function (data, status, header) {
				  console.log(data);
				  _this.cardNumber=data.cardNumber;
				  _this.kk=data.money;
				  
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
					  _this.seekMoney();
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
		
		seekMoney:function(){
			var _this=this;
			$.ajax({
					      "url": "https://d.apicloud.com/mcm/api/tradeRecord",
					      "type": "POST",
					      "cache": false,
						  "headers": apiHeader,
					      "data": {"type":_this.deposit_type,"amount":_this.$NameInput.val(),"recordType":"存款","rate":_this.rate,"start_time":_this.KJT_date,"time":_this.KJT_datek,"subAccount":_this.id}
					}).success(function (data, status, header) {
						console.log(data);
						$.ajax({
						      "url": "https://d.apicloud.com/mcm/api/subAccount/"+_this.id,
						      "type": "POST",
						      "cache": false,
							  "headers": apiHeader,
						      "data": {"money":parseInt(_this.kk)+parseInt(_this.$NameInput.val()),"_method":"PUT"}
						}).done(function (data, status, header) {
						      //success body
						      console.log(data);
						      _this.loaded();
							_this.$info.html('存款成功！<a id="aaa" href="#selectAccount?a='+_this.cardNumber+'">返回</a>');

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