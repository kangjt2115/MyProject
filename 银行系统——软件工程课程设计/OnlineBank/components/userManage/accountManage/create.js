ZCC.component.accountManage_Create=(function($,window,undefined){
	//1.构造函数
	var obj = function(option){
		this.init(option);		
	}						
	//2.方法
	obj.prototype={
		constructor:obj,
		//id
		init:function(option){
			console.log(option);
			this.$inputBox=option.$inputBox;
			this.$headImgBox=option.$headImgBox;
			this.$buttonBox=option.$buttonBox;
			this.$ImgBox=option.$ImgBox;
			this.$ImgButton=option.$ImgButton;
			this.bindEvent();
		},
		bindEvent:function(){
			var _this=this;
			//绑定放弃创建按钮
			_this.$buttonBox.children(".btn-danger").on("click",function(){
				window.history.back(-1);	//返回上级页面
			})
			//绑定确认创建按钮
			_this.$buttonBox.children(".btn-primary").on("click",function(){
				_this.gerDOMData();
			})

		},
		//获取页面内的数据
		gerDOMData:function(){
			var _this=this;
			var $inputgroup=this.$inputBox.children(".input-group ");

			var workId=$inputgroup.children("#ZCC-account").val();
			var password=$inputgroup.children("#ZCC-password").val();
			var role=$inputgroup.children("#ZCC-power").find("option:selected").text();
			var date=this.getNowFormatDate();

			if( !workId || !password ||!role ){
				_this.layuiAlert("请输入完整的信息");
				return false;
			}

			//存储
			_this.loading();
			$.ajax({
			      "url": "https://d.apicloud.com/mcm/api/bankUser",
			      "type": "POST",
			      "cache": false,
			      "headers":apiHeader,
			      "data": 
			      	{
				      	"workId":workId,
				      	"password":password,
				      	"role":role,
				      	"passwordChangeTime":date,

			      	}
			}).done(function (data, status, header) {
		    	_this.loaded();
		    	//弹出层
				var index=layer.open({
				  title: '银行管理系统',
				  content: '用户创建成功',
				  btnAlign: 'c',
				  yes:function(index, layero){
				  	layer.close(index);	
				  	window.history.back(-1);
				  },
				  cancel: function(){
				  	layer.close(index);	
				  	window.history.back(-1);
				  }
				});  
			}).fail(function (header, status, errorThrown) {
			      //fail body
			      console.log(header);
			});

			//头像
		},
		getNowFormatDate:function(){
	        var date = new Date();
	        var seperator1 = "-";
	        var year = date.getFullYear();
	        var month = date.getMonth() + 1;
	        var strDate = date.getDate();
	        if (month >= 1 && month <= 9) {
	            month = "0" + month;
	        }
	        if (strDate >= 0 && strDate <= 9) {
	            strDate = "0" + strDate;
	        }
	        var currentdate = year + seperator1 + month + seperator1 + strDate;
	        console.log(currentdate);
	        return currentdate;
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
		layuiAlert:function(Content){
			var index=layer.open({
			  title: '吉趣',
			  content: Content,
			  btnAlign: 'c',
			  yes:function(index, layero){
			  	layer.close(index);	
			  },
			  cancel: function(){
			  	layer.close(index);	
			  }
			});  
		}
	}
	return obj;	
})(jQuery,this)	