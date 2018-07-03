
KJT.component.selectAccount=(function($,window,undefined){

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
			this.$NameInput=option.$NameInput;

			this.$Button=option.$Button;
			this.$info=option.$info;
			this.getId();
			this.bindFocusEvent();
			this.bindButtonEvent();//绑定按钮的事件
			
		},
		getId:function(){
			var card=window.location.href.split('?a=')[1];
			console.log(card);
			if(card!=undefined){
				this.card=card;
				this.nm=card;
				this.requestData();
			}
			// console.log(KJT.component.KJT_index());

		},
		bindFocusEvent:function(){
			var _this=this;
			this.$NameInput.off("focus.zcc").on("focus.zcc",function(ev){
				ev.stopPropagation();
				$(".info").html('');
			});
			
		},
		bindButtonEvent:function(){
			var _this=this;

			this.$Button.off("click.zcc").on("click.zcc",function(ev){
				ev.stopPropagation();
				var nm=_this.$NameInput.val();
				_this.nm=nm;
				if(!nm){
					_this.$info.html("用户名输入不能为空");
					return
				}
				_this.loading();
				$.ajax({
				  "url": "https://d.apicloud.com/mcm/api/subAccount/count",
				  "data": {
				  	"filter": {
						"where": {
							"cardNumber": _this.$NameInput.val(),
						}
					}
				  },
				  "cache": false,
				  "headers": apiHeader,
				  "type": "GET"
				}).success(function (data, status, header) {
				  console.log(data);
					if (data.count > 0){ // 合法用户
						$(".info").html('');
						_this.requestData();
						_this.loaded();
					} else { // 非法用户
						//alert('用户名或密码有误');
						_this.$NameInput.val('').focus();
					    _this.$info.html("一卡通账号不存在");
						_this.loaded();
					}
				}).fail(function (header, status, errorThrown) {})
			})
		},
		requestData:function(){
			this.loading();
			var _this=this;
			$.ajax({
				"url": "https://d.apicloud.com/mcm/api/subAccount",
				"data":{
			  		"filter": {
			  		 	"order":"createdAt DESC",
					    "where": {"cardNumber": _this.nm},
				    	"fields":["id","accountNumber","moneyType","deposit_type","money"],
					},
				},
				"cache": false,
				"headers": apiHeader,
				"type": "GET"
			}).success(function (data, status, header) {
				console.log(data);
				_this.strDOM(data);
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
			if (window.role=="储蓄部") {
				strBox=['<tr>'
		                ,'<th>'+id+'</th>'
		                ,'<th>'+ret.accountNumber+'</th>'
		                ,'<th>'+ret.moneyType+'</th>'
		                ,'<th>'+ret.deposit_type+'</th>'
		                ,'<th>'+ret.money+'</th>'
		                ,'<th>'
		                	,'&nbsp;&nbsp;<a href="#saveMoneyAmount?id='+ret.id+'?id='+ret.deposit_type+'"><button type="button" class="btn btn-primary btn-sm">存 款</button></a> &nbsp;&nbsp;&nbsp;&nbsp;'
		                	,'<a href="#takeMoneyAmount?id='+ret.id+'"><button type="button" class="btn btn-success btn-sm">取 款</button></a> &nbsp;&nbsp;&nbsp;&nbsp;'
		                ,'</th>'
		            ,'</tr>'];
		        }else if(window.role=="贷款部"){
		        	strBox=['<tr>'
		                ,'<th>'+id+'</th>'
		                ,'<th>'+ret.accountNumber+'</th>'
		                ,'<th>'+ret.moneyType+'</th>'
		                ,'<th>'+ret.deposit_type+'</th>'
		                ,'<th>'+ret.money+'</th>'
		                ,'<th>'
		                	,'<a class="KJT_dnone" href="#loan_loanMoney?id='+ret.id+'"><button type="button" class="btn btn-danger btn-sm">贷 款</button></a> &nbsp;&nbsp;&nbsp;&nbsp;'
		                	,'<a href="#loan_paybackMoney?id='+ret.id+'"><button type="button" class="btn btn-info btn-sm">还 款</button></a> &nbsp;&nbsp;&nbsp;&nbsp;'
		                ,'</th>'
		            ,'</tr>'];
		        }else{
		        	strBox=['<tr>'
		                ,'<th>'+id+'</th>'
		                ,'<th>'+ret.accountNumber+'</th>'
		                ,'<th>'+ret.moneyType+'</th>'
		                ,'<th>'+ret.deposit_type+'</th>'
		                ,'<th>'+ret.money+'</th>'
		                ,'<th>'
		                	,'&nbsp;&nbsp;<a href="#saveMoneyAmount?id='+ret.id+'?id='+ret.deposit_type+'"><button type="button" class="btn btn-primary btn-sm">存 款</button></a> &nbsp;&nbsp;&nbsp;&nbsp;'
		                	,'<a href="#takeMoneyAmount?id='+ret.id+'"><button type="button" class="btn btn-success btn-sm">取 款</button></a> &nbsp;&nbsp;&nbsp;&nbsp;'
		                	,'<a class="KJT_dnone" href="#loan_loanMoney?id='+ret.id+'"><button type="button" class="btn btn-danger btn-sm">贷 款</button></a> &nbsp;&nbsp;&nbsp;&nbsp;'
		                	,'<a href="#loan_paybackMoney?id='+ret.id+'"><button type="button" class="btn btn-info btn-sm">还 款</button></a> &nbsp;&nbsp;&nbsp;&nbsp;'
		                ,'</th>'
		            ,'</tr>'];
		        }
			
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