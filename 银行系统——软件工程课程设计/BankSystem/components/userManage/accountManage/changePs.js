ZCC.component.changePs=(function($,window,undefined){
	//1.构造函数
	var obj = function(option){
		this.loading();	
		this.init(option);		
	}						
	//2.方法
	obj.prototype={
		constructor:obj,
		//基础属性
		//id
		//初始化
		init:function(option){
			console.log(option);
			this.$inputBox=option.$inputBox;
			this.$headImgBox=option.$headImgBox;
			this.$buttonBox=option.$buttonBox;
			this.$ImgBox=option.$ImgBox;
			this.$ImgButton=option.$ImgButton;
			this.getId();
			this.requestData();
			this.bindEvent();//绑定底部按钮事件
		},
		//获取id
		getId:function(){
			var dataId=window._UserId;
			this.dataId=dataId;
			console.log(dataId);
		},
		//根据id查询信息
		requestData:function(){
			var _this=this;
			$.ajax({
			  "url": "https://d.apicloud.com/mcm/api/bankUser",
			  "cache": false,
			  "headers": apiHeader,
			  "type": "GET",
			  "data":{
				  "filter": {
				    "fields": ["workId","role","password","id"],
				    "where": { "_id": _this.dataId}
				  }
			   }
			}).success(function (data, status, header) {
			  console.log(data[0]);
			  _this.strDOM(data[0]);
			}).fail(function (header, status, errorThrown) {
			});
		},
		//数据加载DOM操作
		strDOM:function(ret){
			var workId=ret.workId;
			var role=ret.role;
			var password=ret.password;
			var id=ret.id;
			var $inputgroup=this.$inputBox.children(".input-group ")
			$inputgroup.children("#ZCC-account").val(workId);
			$inputgroup.children("#ZCC-password").val(password);
			// selected="selected"
				var $option=$inputgroup.children("#ZCC-power").children();
				for(var j=0;j<$option.length;j++){
					if($option[j].label==role){
						$($option[j]).attr("selected",role);
						break;
					}
				}
			this.loaded();
		},
		//获取页面内的数据
		gerDOMData:function(){
			var _this=this;
			var $inputgroup=this.$inputBox.children(".input-group ");

			var password=$inputgroup.children("#ZCC-password").val();
			$.ajax({
			      "url": "https://d.apicloud.com/mcm/api/bankUser/"+_this.dataId,
			      "type": "POST",
			      "cache": false,
			      "headers":apiHeader,
			      "data": 
			      	{
				      	"password":password,
				      	"_method":"PUT"
			      	}
			}).done(function (data, status, header) {
			      //success body
			      _this.loaded();
			      window.location.reload;//刷新页面
			      console.log(data);
			}).fail(function (header, status, errorThrown) {
			      //fail body
			      console.log(header);
			});

			//头像
		},
		//底部按钮事件绑定
		bindEvent:function(){
			var _this=this;
			this.$buttonBox.children(".btn-danger").off("click.zcc").on("click.zcc",function(){
				_this.alertBox(0);//放弃编辑按钮
			});
			this.$buttonBox.children(".btn-primary").off("click.zcc").on("click.zcc",function(){
				_this.alertBox(1);//保存编辑按钮
			});
		},
		
		
		
		//layui警告框
		alertBox:function(i){
			var _this=this;
			if(i==0){
				_this.LayerIndex=layer.open({
				  title: '银行管理系统',
				  btn: ['放弃编辑', '继续编辑'],
				  content: '您确定要放弃此次编辑嘛',
				  btnAlign: 'c',//配置按钮居中
				  yes:function(){//第一个按钮的回调函数
				  	console.log("yes");
				  	window.history.back(-1);	//返回上级页面
				  	layer.close(_this.LayerIndex);			//关闭指定弹窗
				  },
				  btn2:function(){//第二个按钮的回调函数
				  	console.log("btn2")
				  },
				  cancel: function(){//顶部关闭按钮的回调函数
				  	console.log('右上角关闭回调');
				  }
				});  
			}else if(i==1){
				_this.LayerIndex=layer.open({
				  title: '银行管理系统',
				  btn: ['确定保存', '取消保存'],
				  content: '您确定要保存此次编辑嘛，保存将覆盖用户信息',
				  btnAlign: 'c',//配置按钮居中
				  yes:function(){//第一个按钮的回调函数
				  	console.log("yes");
				  	_this.loading();
	  				_this.gerDOMData(); 
				  	layer.close(_this.LayerIndex);			//关闭指定弹窗
				  },
				  btn2:function(){//第二个按钮的回调函数
				  	console.log("btn2")
				  },
				  cancel: function(){//顶部关闭按钮的回调函数
				  	console.log('右上角关闭回调');
				  }
				});  
			}
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