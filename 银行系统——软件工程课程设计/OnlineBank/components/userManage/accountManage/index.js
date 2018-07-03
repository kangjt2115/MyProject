ZCC.component.accountManage=(function($,window,undefined){
	//1.构造函数
	var obj = function(option){	
		this.loading();	
		this.init(option);		
	}						
	//2.方法
	obj.prototype={
		constructor:obj,
		//基本属性
		init:function(option){
			this.$TableContentWrapper=option.$TableContentWrapper;//表格容器
			//绑定事件
			this.bindDelEvent();
			//请求数据
			this.requestData();//请求表格数据
			
		},
		
		//请求表格数据
		requestData:function(){
			this.loading();
			var _this=this;
			$.ajax({
				"url": "https://d.apicloud.com/mcm/api/bankUser",
				"data":{
			  		"filter": {
				    	"fields": ["workId","password","id","role","passwordChangeTime"],
					}
				},
				"cache": false,
				"headers": apiHeader,
				"type": "GET"
			}).success(function (data, status, header) {
				_this.strDOM(data);
			}).fail(function (header, status, errorThrown) {
				console.log(JSON.stringify(header));
			});
		},
		
		//DOM操作
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
		                ,'<th>'+ret.workId+'</th>'
		                ,'<th>'+ret.password+'</th>'
		                ,'<th>'+ret.role+'</th>'
		                ,'<th>'+ret.passwordChangeTime+'</th>'
		                ,'<th>'
		                	,'<a href="#accountManage_Edit?id='+ret.id+'"><button type="button" class="btn btn-primary btn-sm">编辑</button></a> '
		                	,'<button type="button" class="btn btn-danger btn-sm delbtn" data-id="'+ ret.id +'">删除</button> '
		                ,'</th>'
		            ,'</tr>'];
			return strBox.join('');
		},
		
		//删除反馈
		delOneData:function(id){
			var _this=this;
			_this.loading();
			$.ajax({
				"type": "POST",
				"url": "https://d.apicloud.com/mcm/api/bankUser/" + id,
				"data": {
					"_method": "DELETE"
				},
				"cache": false,
				"headers": apiHeader
			}).done(function(data, status, header){
				
				_this.loaded();
			    window.location.reload();//刷新页面

			}).fail(function(err){});
			
		},
		// 给按钮绑定删除事件 
		bindDelEvent:function(){
			var _this=this;//obj指针
			this.$TableContentWrapper.off('click.zcc').on('click.zcc', 'tr > th > .delbtn', function(ev){
				ev.stopPropagation();
				var $this = $(this);//被点击的元素
				var isDel = confirm('确认删除吗？');
				if (isDel){
					_this.delOneData($this.attr('data-id'));
				}
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
		}
	}

	return obj;	
})(jQuery,this)	