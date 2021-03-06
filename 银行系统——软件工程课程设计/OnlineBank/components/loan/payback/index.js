
KJT.component.packback=(function($,window,undefined){

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
			this.getId();
			this.requestData();
			console.log(0);
		},
		//获取url中的id
		getId:function(){
			var id=window.location.href.split('?id=')[1];
			console.log(id);
			this.id=id;
		},
		requestData:function(){
			this.loading();
			var _this=this;
			$.ajax({
				"url": "https://d.apicloud.com/mcm/api/tradeRecord",
				"data":{
			  		"filter": {
					    "where": {"subAccount": _this.id},
				    	"fields":["id","type","amount","rate","time","start_time","paybackType","mortgage"],
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
			// if(this.subAccount==undefined){
			// 	$(".KJT_btn").off("click.zcc").on("click.zcc",function(ev){
			// 		ev.stopPropagation();
			// 		$(".info").html("您还没有选择账户！");
			// 	});
			// }
			this.loaded();
			return true;
		},
		//字符串拼接
		strLink:function(ret,id){
			var strBox=new Array();
			console.log(this.subAccount);
				strBox=['<tr>'
	                ,'<th>'+id+'</th>'
	                ,'<th>'+ret.type+'</th>'
	                ,'<th>'+ret.amount+'</th>'
	                ,'<th>'+ret.rate+'</th>'
	                ,'<th>'+ret.paybackType+'</th>'
	                ,'<th>'+ret.mortgage+'</th>'
	                ,'<th>'+ret.start_time+'</th>'
	                ,'<th>'+ret.time+'</th>'
	                ,'<th>'
	                	,'<a href="#paybackAmount?id='+this.id+'?id='+ret.id+'?id='+ret.amount+'?id='+ret.type+'"><button type="button" class="btn KJT_btn btn-sm">选择</button></a>'
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