KJT.component.signCheck_checkpeople=(function($,window,undefined){

	var obj=function(option){
		this.init(option);
	};

	obj.prototype={
		constructor:obj,
		numbLimit:20,
		numbSkip:0,
		init:function(option){
			this.$TableContentWrapper=option.$TableContentWrapper;
			this.$Pager=option.$Pager;
			this.$toClass=option.$toClass;
			this.$toPeople=option.$toPeople;
			this.$kjt_table=option.$kjt_table;
			this.getId();
			this.requestData();
		},
		getId:function(){
			var dataId=window.location.href.split('?id=')[1];
			this.dataId=dataId;
			this.$toClass.attr("href","#signCheck_Checkclass?id="+this.dataId);
			this.$toPeople.attr("href","#signCheck_Checkpeople?id="+this.dataId);
			console.log(this.dataId);
		},
		initPager:function(numb){
			var _this=this;
			//pager已经在index.html引过直接直接复制就行，参数自己改一下by朱陈超
			ZCC.component.Page({
					num:numb,				//页码数
					startnum:1,				//指定页码
					elem:this.$Pager,
					callback:function(n){	//回调函数
						console.log(n);
						_this.numbSkip=_this.numbLimit*(n-1);
						_this.strDOM();
					}
			});
		},
		requestData:function(){
			this.loading();
			var _this=this;
			$.ajax({
			  "url": "https://d.apicloud.com/mcm/api/Activity",
			  "data":{
			  	"filter":{
			  		"where":{"id":this.dataId},
			  		"fields":["SignPeople"],
			  		// "include":"actSign",
			  		// "includefilter":{
			  		// 	"MyUser":{"fields":["id","Name","Nickname","Phone","AccountNumber"]}
			  		// }
			  	}
			  },
			  "cache": false,
			  "headers": apiHeader,
			  "type": "GET",
			}).success(function (data, status, header) {
			  console.log(data[0]);
			  _this.SignPerson=data[0].SignPeople;
			  console.log(_this.SignPerson);
			  var page=Math.ceil(data[0].SignPeople.length/(_this.numbLimit));
			  console.log("page:"+page);
			  _this.initPager(page);
			  _this.strDOM();//请求表格数据
			}).fail(function (header, status, errorThrown) {
			  //fail body
			});
			
		},
		strDOM:function(){
			this.loading();
			if(this.SignPerson.length==0){this.$kjt_table.html('<div style="padding-left:12px;margin-top:12px;font-size: 20px;">还没有人签到！</div>')}
			var str="";
			for(var i=this.SignPerson.length-this.numbSkip-1;i>this.SignPerson.length-this.numbSkip-1-this.numbLimit/2;i=i-1){
				console.log(this.SignPerson[i]);
				str+=this.strLink(this.SignPerson[i],this.SignPerson[i-10],this.SignPerson.length-i);
			}
			console.log(str);
			this.$TableContentWrapper.html(str);
			this.loaded();
		},
		//DOM
		strLink:function(ret0,ret1,k){
			var k0=k+10;
			var strBox=new Array();
			if(ret0==undefined){
				strBox=[];
			}
			else if(ret0!=undefined&&ret1==undefined){
				strBox=[
				'<tr>',
				    '<th>'+k+'</th>',
	                '<th>'+ret0.accountnumber+'</th>',
	                '<th>'+ret0.name+'</th>',
	                '<th>'+ret0.time.split('T')[0]+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ret0.time.split('T')[1].split('.')[0]+'</th>',
	                '<th></th>',
	                '<th></th>',
	                '<th></th>',
	                '<th></th>',
            	'</tr>',];
			}
			else{
				strBox=[
							'<tr>',
							    '<th>'+k+'</th>',
				                '<th>'+ret0.accountnumber+'</th>',
				                '<th>'+ret0.name+'</th>',
				                '<th>'+ret0.time.split('T')[0]+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ret0.time.split('T')[1].split('.')[0]+'</th>',
				                '<th>'+k0+'</th>',
				                '<th>'+ret1.accountnumber+'</th>',
				                '<th>'+ret1.name+'</th>',
				                '<th>'+ret1.time.split('T')[0]+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ret1.time.split('T')[1].split('.')[0]+'</th>',
			            	'</tr>',
						];}
			return strBox.join("");
		},
		// 加载中
		loading:function(){
			this.layerIndex = layer.load(1, {
			  shade: [0.3,'#000'] //0.1透明度的白色背景
			});
		},
		// 加载完毕
		loaded:function(){
			layer.close(this.layerIndex);
		},
	};

	return obj;

})(jQuery,this);
