
// KJT.component.selectAccount=(function($,window,undefined){

// 	//1.构造函数
// 	var obj = function(option){
// 		this.init(option);
// 	}
// 	//2.方法
// 	obj.prototype={
// 		constructor:obj,
// 		//基本属性
// 		//构造函数
// 		init:function(option){
// 			this.$TableContentWrapper=option.$TableContentWrapper;
// 			this.$Button=option.$Button;
// 			this.getId();
// 			this.requestData();
			
// 		},
// 		getId:function(){
// 			var id=window._UserId;
// 			this.id=id;
// 			console.log(window._UserId);

// 		},
// 		requestData:function(){
// 			this.loading();
// 			var _this=this;
// 			$.ajax({
// 				"url": "https://d.apicloud.com/mcm/api/userOnline",
// 				"data":{
// 			  		"filter": {
// 				    	"fields":["id","cardholder"],
// 				    	"where":{"id":_this.id},
// 				    	"include":["cardholderPointer"],
// 					},
// 				},
// 				"cache": false,
// 				"headers": apiHeader,
// 				"type": "GET"
// 			}).success(function (data, status, header) {
// 				console.log(data[0]);
// 				_this.cardNumber=data[0].cardholder.number;

// 				_this.seekCard();
// 			}).fail(function (header, status, errorThrown) {
// 				console.log(JSON.stringify(header));
// 			  //fail body
// 			});
// 		},
// 		seekCard:function(){
// 			var _this=this;
// 			$.ajax({
// 					"url": "https://d.apicloud.com/mcm/api/subAccount",
// 					"data":{
// 				  		"filter": {
// 					    	"where": {"cardNumber": _this.cardNumber},
// 					    	// "fields":["id","cardNumber","accountNumber","moneyType","deposit_type","money"],
// 						},
// 					},
// 					"cache": false,
// 					"headers": apiHeader,
// 					"type": "GET"
// 				}).success(function (data, status, header) {
// 					console.log(data);
// 					_this.strDOM(data);
// 				}).fail(function (header, status, errorThrown) {
// 					console.log(JSON.stringify(header));
// 				  //fail body
// 				}); 
// 		},
// 		strDOM:function(retArray){
// 			var str="";
// 			for(var i=0;i<retArray.length;i++){
// 				str+=this.strLink(retArray[i],i+1);
// 			}

// 			this.$TableContentWrapper.html(str);
// 			this.loaded();
// 			return true;
// 		},
// 		//字符串拼接
// 		strLink:function(ret,id){
// 			var strBox=new Array();
			
// 		        	strBox=['<tr>'
// 		                ,'<th>'+id+'</th>'
// 		                ,'<th>'+ret.accountNumber+'</th>'
// 		                ,'<th>'+ret.moneyType+'</th>'
// 		                ,'<th>'+ret.deposit_type+'</th>'
// 		                ,'<th>'+ret.money+'</th>'
// 		            ,'</tr>'];
			
// 			return strBox.join('');
// 		},
// 		loading:function(){
// 			this.layerIndex = layer.load(1, {
// 			  shade: [0.3,'#000'] //0.1透明度的白色背景
// 			});
// 		},
// 		// 加载完毕
// 		loaded:function(){
// 			layer.close(this.layerIndex);
// 		},
		
// 	}
// 	return obj;
// })(jQuery,this)

KJT.component.selectTransfer=(function($,window,undefined){

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
			this.$TableContentWrapper=option.$TableContentWrapper;
			this.loading();
			this.getId();
			this.seekCard();
		},
		getId:function(){
			var id=window._UserId;
			console.log(id);
			this.id=id;
			var kmoney=window.location.href.split("?id=")[1];
			var account=window.location.href.split("?id=")[2];
			var KID=window.location.href.split("?id=")[3];
			this.account=account;
			this.account=account;
			this.kmoney=kmoney;
			this.KID=KID;
		},
		seekCard:function(){
			var _this=this;
			$.ajax({
				"url": "https://d.apicloud.com/mcm/api/userOnline",
				"data":{
			  		"filter": {
				    	"where":{"id":_this.id},
				    	"fields":["id","payee"],
				    	"include":["payee"],
					},
				},
				"cache": false,
				"headers": apiHeader,
				"type": "GET"
			}).success(function (data, status, header) {
				console.log(data[0]);
				_this.strDOM(data[0].payee);
			}).fail(function (header, status, errorThrown) {
				console.log(JSON.stringify(header));
			  //fail body
			});
		},
		
		
		
		strDOM:function(retArray){
			var str="";
			for(var i=0;i<retArray.length;i++){
				str+=this.strLink(retArray[i],i+1);
			}

			this.$TableContentWrapper.html(str);
			this.loaded();
			return true;
		},
		//字符串拼接
		strLink:function(ret,id){
			var strBox=new Array();
			
		        	strBox=['<tr>'
		                ,'<th>'+id+'</th>'
		                ,'<th>'+ret.name+'</th>'
		                ,'<th>'+ret.payAccount+'</th>'
		                ,'<th>'
		                	,'<a href="#transferAmount?id='+ret.payAccount+'?id='+this.account+'?id='+this.kmoney+'?id='+this.KID+'"><button type="button" class="btn btn-info btn-sm">转账</button></a><a class="info"></a>'
		                ,'</th>'
		            ,'</tr>'];
			
			return strBox.join('');
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