
KJT.component.depositRate=(function($,window,undefined){

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
			this.requestData();
		},
		
		requestData:function(){
			this.loading();
			var _this=this;
			$.ajax({
				"url": "https://d.apicloud.com/mcm/api/depositRate",
				"data":{
			  		"filter": {
					    "where": {"deposit_loan": "储蓄"},
				    	"fields":["id","type","rate","role"],
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
			console.log(this.subAccount);

				strBox=['<tr>'
	                ,'<th>'+id+'</th>'
	                ,'<th>'+ret.type+'</th>'
	                ,'<th>'+ret.rate+'</th>'
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