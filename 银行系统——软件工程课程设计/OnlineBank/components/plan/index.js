
KJT.component.plan=(function($,window,undefined){

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
			this.planDetails=[];
			this.requestData();
		},
		requestData:function(){
			this.loading();
			var _this=this;
			$.ajax({
				"url": "https://d.apicloud.com/mcm/api/plan",
				"data":{
			  		"filter": {
				    	"fields":["administrator","statement","start_time","planDetails","id"],
				    	"include":"planDetails",
        				"includefilter":{"planDetails":{"fields":["deposit_loan","modifyRate","id"]}}
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
			console.log(this.planDetails);
			// this.bindkkk();
			this.loaded();
			return true;
		},
		//字符串拼接
		strLink:function(ret,id){
			var strBox=new Array();
			var strBox0="";
			this.planDetails[id-1]=ret.planDetails;
			console.log(this.planDetails[id]);
			for(var i=0;i<ret.planDetails.length;i++){
				strBox0+=' '+ret.planDetails[i].deposit_loan+'利率修改为' +ret.planDetails[i].modifyRate+' ；&nbsp;&nbsp;&nbsp;&nbsp; '
			}
				strBox=['<tr>'
	                ,'<th>'+id+'</th>'
	                ,'<th>'+ret.administrator+'</th>'
	                ,'<th>'+ret.statement+'</th>'
	                ,'<th>'+ret.start_time+'</th>'
	                ,'<th>'+strBox0+'</th>'
	                ,'<th>'
		                ,' &nbsp;<a><button type="button" class="btn btn-primary btn-sm kkk'+(id-1)+'">执行</button></a><a class="info"></a>'
		                ,'<a><button type="button" class="btn btn-danger btn-sm jjj">删除</button></a><a class="info"></a>'
		            ,'</th>'
	            ,'</tr>'];
	            
			return strBox.join('');
		},
		delCmtAry:function(bComment){
			var _this=this;
				console.log(bComment);
			if(bComment.length==0){
				console.log("执行成功！");
				var index=layer.open({
				  title: '计划',
				  content: '执行计划成功！',
				  btn: ['确定'],
				  btnAlign: 'c',
				  yes:function(index, layero){
				  	layer.close(index);	
				  	_this.loaded();
				  	window.location.href="#selectAccount";
				  },
				  cancel: function(){
				  	layer.close(index);	
				  }
				}); 
				this.loaded(); 
				return false;
			}
			var bComShift=bComment.shift();
			$.ajax({
				  "url": "https://d.apicloud.com/mcm/api/depositRate/"+bComShift.id,
				  "cache": false,
				  "headers": apiHeader,
				  "type": "POST",
				  "data": {
			      	"rate":bComShift.modifyRate,
			      	"_method":"PUT"
			      }
				}).success(function (data, status, header) {
					console.log(bComment);
				  _this.delCmtAry(bComment);
				}).fail(function (header, status, errorThrown) {
				  //fail body
				  alert(JSON.stringify(header));
				});
		},
		bindkkk:function(){
			var _this=this;
			for(var i=0;i<_this.planDetails.length;i++){
			$("body").delegate('.kkk'+i+'',"click", function(){
					console.log(_this.planDetails);
				_this.delCmtAry(_this.planDetails[0]);
		      });}
			// $(".kkk").off("click.kjt").on("click.kjt",'tr > th > .kkk',function(ev){
			// 	ev.stopPropagation();
			// 	console.log(_this.planDetails);
			// 	_this.delCmtAry(_this.planDetails);

			// });
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