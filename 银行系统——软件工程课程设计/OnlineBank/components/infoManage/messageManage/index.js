LGQ.component.messageManage=(function($,window,undefined){
	//构造函数
	var obj=function(option){
		this.loading();
		this.init(option);
	};
	//属性
	obj.prototype={
		constructor:obj,
		//基本属性
		numbSkip:0,
		numbLimit:10,
		//方法
		init:function(option){
			this.loading();			
			this.$TableContentWrapper=option.$TableContentWrapper;
			this.$PagerWrapper=option.$PagerWrapper;
			this.requestNumb();
			this.requestData();
            this.bindDelete();
		},
		//页面初始化
		initPager:function(numb){
			var _this=this;
			ZCC.component.Page({
				num:numb,				//页码数
				startnum:1,				//指定页码
				elem:_this.$PagerWrapper,
				callback:function(n){	//回调函数
					_this.numbSkip=(n-1)*_this.numbLimit;
					_this.requestData();
				}
			});
		},
		//请求数据条数
		requestNumb:function(){
			var _this=this;
			$.ajax({
			  "url": "https://d.apicloud.com/mcm/api/OrganSchool/count",
			  "cache": false,
			  "headers": apiHeader,
			  "type": "GET"
			}).success(function (data, status, header) {
				var numb=Math.ceil((data.count)/_this.numbLimit);
				_this.initPager(numb);
			}).fail(function (header, status, errorThrown) {
			  //fail body
			})
		},
		//请求数据
		requestData:function(){
			this.loading();
			var _this=this;
			$.ajax({
			  "url": "https://d.apicloud.com/mcm/api/OrganSchool",     
			  "cache":false,
			  "headers": apiHeader,
			  "data":{
			  		"filter": {
					    "skip": _this.numbSkip,
				    	"limit": _this.numbLimit,
				    	"fields":["schPub","schTitle", "createdAt","id","schTime","schPic"],
				    	"order": ["updatedAt DESC"]
				    	
					},
				},
			  "type":"GET"
			}).success(function (data, status, header) {
			  console.log(data);
			  _this.strDOM(data);
			}).fail(function (header, status, errorThrown) {
			});
		},
		//字符串拼接
		strLine:function(ret,id){
			var strArray=[];
			var imgid=""
			if(ret.schPic){
				imgid=ret.schPic.id;
			}

			strArray=['<tr>'
		                ,'<th>'+id+'</th>'
		                ,'<th>'+ret.schTitle+'</th>'
		                ,'<th>'+ret.schPub+'</th>'
		                ,'<th>'+ret.schTime+'</th>'
		                ,'<th>'			                	
		                	,'<a href="#messageManage_Check?id='+ret.id+'"><button type="button" class="btn btn-default btn-sm">查看</button></a> '
		                	,'<button type="button" class="btn btn-danger btn-sm" data-id="'+ ret.id +'" img-id="'+imgid+'">删除</button> '
		                ,'</th>'
		            ,'</tr>'];
		    return strArray.join("");
		},
		//DOM操作
		strDOM:function(retArray){
			var str="";
			for(var i=0;i<retArray.length;i++){
				str+=this.strLine(retArray[i],i+1);
			}
			this.$TableContentWrapper.html(str);
			this.loaded();
			return true;
		},
		//删除文章数据(连带图片)
		delMessage:function(artid,imgid){
			var _this=this;
			$.ajax({
				  "url": "https://d.apicloud.com/mcm/api/OrganSchool/"+artid,
				  "cache": false,
				  "headers":apiHeader,
				  "data": {
				    "_method": "DELETE"
				  },
				  "type": "POST"
				}).success(function (data, status, header) {
					_this.loaded();
					console.log("DeleteSuccess:"+JSON.stringify(data));
					_this.requestData();
				}).fail(function (header, status, errorThrown) {
					console.log("DeleteFailure:"+JSON.stringify(header));
			});

			$.ajax({
			  "url": "https://d.apicloud.com/mcm/api/file/"+imgid,
			  "cache": false,
			  "headers":apiHeader,
			  "data": {
			    "_method": "DELETE"
			  },
			  "type": "POST"
			}).success(function (data, status, header) {
				console.log("DeleteSuccessPic:"+JSON.stringify(data));
			}).fail(function (header, status, errorThrown) {
				console.log("DeleteFailurePic:"+JSON.stringify(header));
			});
		},
		//绑定删除按钮
		bindDelete:function(){
			var _this=this;//obj指针
			this.$TableContentWrapper.off('click.lgq').on('click.lgq', 'tr > th > .btn-danger', function(ev){
				ev.stopPropagation();
				var $this = $(this);//被点击的元素
				var index=layer.open({
				  title: '吉趣',
				  btn: ['确定', '取消'],
				  content: "确认是否删除通知（一旦删除将无法回复）",
				  btnAlign: 'c',
				  yes:function(){//第一个按钮的回调函数
				  	console.log("yes");
				  	//删除通知
				  	_this.loading();	
				  	_this.delMessage($this.attr('data-id'),$this.attr('img-id'));
				  	layer.close(index);			//关闭指定弹窗
				  },
				  btn2:function(){},
				  cancel: function(){}
				});  

			});
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
			datePrototype:function(){

			Date.prototype.Format = function (fmt) { //author: meizz 
			    var o = {
			        "M+": this.getMonth() + 1, //月份 
			        "d+": this.getDate(), //日 
			        "h+": this.getHours(), //小时 
			        "m+": this.getMinutes(), //分 
			        "s+": this.getSeconds(), //秒 
			        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
			        "S": this.getMilliseconds() //毫秒 
			    };
			    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
			    for (var k in o)
			    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			    return fmt;
			}
		}
	}

	return obj;
})(jQuery,this)