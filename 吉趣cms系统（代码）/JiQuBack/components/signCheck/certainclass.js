/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2017-11-29 13:14:49
 * @version $Id$
 */
KJT.component.signCheck_certainclass=(function($,window,undefined){

	var obj=function(option){
		this.init(option);
	};

	obj.prototype={
		constructor:obj,
		class_signPerson:[],
		init:function(option){
			this.$TableContentWrapper=option.$TableContentWrapper;
			this.$toClass=option.$toClass;
			this.$toCertainClass=option.$toCertainClass;
			this.getId();
			this.requestData();
		},
		getId:function(){
			this.dataId=window.location.href.split('?id=')[1].split('id=')[0];
			this.grade=window.location.href.split('?id=')[1].split('id=')[1];
			this.class=window.location.href.split('?id=')[1].split('id=')[2];

			this.$toClass.attr("href","#signCheck_Checkclass?id="+this.dataId);
			this.$toCertainClass.attr("href","#signCheck_Check_certainclass?id="+this.dataId+"id="+this.grade+"id="+this.class+"");
			this.$toCertainClass.html("20"+this.grade+"级&nbsp;&nbsp;"+this.class+"&nbsp;班")
			console.log(this.dataId);
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
			  _this.strDOM();//请求表格数据
			}).fail(function (header, status, errorThrown) {
			  //fail body
			});
			
		},
		strDOM:function(){
			this.loading();
      		var str_regex=/^\d{8}$/;
			var str="";
			for(var i=0;i<this.SignPerson.length;i=i+1){
				if((str_regex.test(this.SignPerson[i].accountnumber))&&(this.SignPerson[i].accountnumber.slice(0,2)=="21")){
		            var kgrade=parseInt(this.SignPerson[i].accountnumber.slice(2,4));
		            var kclass=parseInt(this.SignPerson[i].accountnumber.slice(4,6));
		          	if(kgrade==this.grade&&kclass==this.class)
		          	{
						this.class_signPerson.push(this.SignPerson[i]);
		          	}
        		}
			}
			var kkk=Math.round(this.class_signPerson.length/2);
			for(var i=this.class_signPerson.length-1;i>this.class_signPerson.length-1-kkk;i=i-1)
			{
				str+=this.strLink(this.class_signPerson[i],this.class_signPerson[i-kkk],this.class_signPerson.length-i,this.class_signPerson.length-i+kkk);
			}
			console.log(str);
			this.$TableContentWrapper.html(str);
			this.loaded();
		},
		//DOM
		strLink:function(ret0,ret1,k,k0){
			var strBox=new Array();
			if(ret0!=undefined&&ret1==undefined){
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
            	'</tr>',]
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
						]}
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

