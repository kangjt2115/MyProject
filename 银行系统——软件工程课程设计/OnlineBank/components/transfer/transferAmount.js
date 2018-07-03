
KJT.component.transferAmount=(function($,window,undefined){

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
			var payAccount=window.location.href.split('?id=')[1];
			var Account=window.location.href.split('?id=')[2];
			var kmoney=window.location.href.split('?id=')[3];
			var kid=window.location.href.split('?id=')[4];
			this.payAccount=payAccount;
			this.Account=Account;
			this.kmoney=kmoney;
			this.kid=kid;
			console.log(payAccount);
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
					_this.$info.html("转账金额不能为空");
					return
				}
				_this.loading();
				var KJT_date=_this.getNowFormatDate(0);
				_this.KJT_date=KJT_date;
				$.ajax({
				  "url": "https://d.apicloud.com/mcm/api/subAccount",
				  "cache": false,
				  "headers": apiHeader,
				  "type": "GET",
				  "data":{
				  	"filter":{
				  		"where":{"accountNumber":_this.payAccount},
				  		"fields":["money","deposit_type","cardNumber","id"],
				  		}
				  	}
				}).success(function (data, status, header) {
				  console.log(data);
				  _this.cardNumber=data.cardNumber;
				  _this.kk=data[0].money;
				  _this.id=data[0].id;
				  $.ajax({
				  "url": "https://d.apicloud.com/mcm/api/subAccount",
				  "cache": false,
				  "headers": apiHeader,
				  "type": "GET",
				  "data":{
				  	"filter":{
				  		"where":{"accountNumber":_this.Account},
				  		"fields":["money","deposit_type","cardNumber","id"],
				  		}
				  	}
				}).success(function (data, status, header) {
				  console.log(data);
				  _this.kmoney=data[0].money;
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
					      "data": {"type":"转账","amount":_this.$NameInput.val(),"recordType":"转账","start_time":_this.KJT_date,"subAccount":_this.id}
					}).success(function (data, status, header) {
						console.log(_this.kmoney);
						$.ajax({
						      "url": "https://d.apicloud.com/mcm/api/subAccount/"+_this.kid,
						      "type": "POST",
						      "cache": false,
							  "headers": apiHeader,
						      "data": {"money":parseInt(_this.kmoney)-parseInt(_this.$NameInput.val()),"_method":"PUT"}
						}).done(function (data, status, header) {
						      //success body
						      console.log(data);
						      console.log(_this.kk);

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
									_this.$info.html('转账成功！<a id="aaa" href="#transfer">返回</a>');

								}).fail(function (header, status, errorThrown) {
								      //fail body
								});

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