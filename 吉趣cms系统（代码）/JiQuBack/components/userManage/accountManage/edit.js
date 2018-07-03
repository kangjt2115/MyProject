ZCC.component.accountManage_Edit=(function($,window,undefined){
	//1.构造函数
	var obj = function(option){
		this.loading();	
		this.init(option);		
	}						
	//2.方法
	obj.prototype={
		constructor:obj,
		//基础属性
		dataId:"",//页面传来的参数
		//id
		imgId:"",
		imgUrl:"",
		imgName:"",
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
			this.uploadPic();
		},
		//获取id
		getId:function(){
			var dataId=window.location.href.split('?id=')[1];
			this.dataId=dataId;
		},
		//根据id查询信息
		requestData:function(){
			var _this=this;
			$.ajax({
			  "url": "https://d.apicloud.com/mcm/api/MyUser",
			  "cache": false,
			  "headers": apiHeader,
			  "type": "GET",
			  "data":{
				  "filter": {
				    "fields": ["Name","Nickname","Password","HeadImgUrl","AccountNumber","QQ","Phone","id","Role","HeadImgId"],
				    "where": { "_id": _this.dataId}
				  }
			   }
			}).success(function (data, status, header) {
			  console.log(JSON.stringify(data));
			  _this.imgId=data[0].HeadImgId;
			  _this.imgUrl=data[0].HeadImgUrl;
			  _this.strDOM(data[0]);
			}).fail(function (header, status, errorThrown) {
			});
		},
		//数据加载DOM操作
		strDOM:function(ret){
			var Name=ret.Name;
			var AccountNumber=ret.AccountNumber;
			var Password=ret.Password;
			var Nickname=ret.Nickname;
			var Role=ret.Role;
			var Phone=ret.Phone;
			var QQ=ret.QQ;
			var id=ret.id;
			var $inputgroup=this.$inputBox.children(".input-group ")
			$inputgroup.children("#ZCC-name").val(Name);
			$inputgroup.children("#ZCC-account").val(AccountNumber);
			$inputgroup.children("#ZCC-password").val(Password);
			$inputgroup.children("#ZCC-nickname").val(Nickname);
			$inputgroup.children("#ZCC-phone").val(Phone);
			$inputgroup.children("#ZCC-qq").val(QQ);
			var HeadImgUrl=ret.HeadImgUrl;
			this.$headImgBox.attr('src',HeadImgUrl); 
			// selected="selected"
			if(Role!=undefined){
				console.log("Role"+Role);
				var $option=$inputgroup.children("#ZCC-power").children();
				for(var j=0;j<$option.length;j++){
					if($option[j].label==Role){
						$($option[j]).attr("selected",Role);
						break;
					}
				}
			}else{
				console.log("Role"+"普通用户");
				var $option=$inputgroup.children("#ZCC-power").children();
				$($option[0]).attr("selected","普通用户");
			}
			this.loaded();
		},
		//获取页面内的数据
		gerDOMData:function(){
			var _this=this;
			var $inputgroup=this.$inputBox.children(".input-group ")

			var Name=$inputgroup.children("#ZCC-name").val();
			var AccountNumber=$inputgroup.children("#ZCC-account").val()
			var Password=$inputgroup.children("#ZCC-password").val()
			var Nickname=$inputgroup.children("#ZCC-nickname").val()
			var Phone=$inputgroup.children("#ZCC-phone").val();
			var QQ=$inputgroup.children("#ZCC-qq").val();
			var Role=$inputgroup.children("#ZCC-power").find("option:selected").text();
			$.ajax({
			      "url": "https://d.apicloud.com/mcm/api/MyUser/"+_this.dataId,
			      "type": "POST",
			      "cache": false,
			      "headers":apiHeader,
			      "data": 
			      	{
			      		"Name":Name,
				      	"AccountNumber":AccountNumber,
				      	"Password":Password,
				      	"Nickname":Nickname,
				      	"Phone":Phone,
				      	"QQ":QQ,
				      	"Role":Role,
				      	"HeadImgUrl":_this.imgUrl,
				      	"HeadImgId":_this.imgId,
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
		//绑定上传图片
		uploadPic:function(){
			var _this=this;
			var uploader = WebUploader.create({
			    // swf文件路径
			    swf:'components/webuploader/Uploader.swf',
			    // 文件接收服务端。
			    server: 'http://d.apicloud.com/mcm/api/file',
			    // 选择文件的按钮。可选。
			    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
			    pick: _this.$ImgButton,
			    // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
			    resize: false,
			    auto: true,
			    accept: {
			        title: 'Images',
			        extensions: 'gif,jpg,jpeg,bmp,png',
			        mimeTypes: 'image/*'
			    }
			});

			uploader.on("fileQueued", function (file) {
				_this.loading();
			    uploader.option('formData', {
			        filename: file.name,
			        type: file.type
			    });
			    console.log(file);
		        uploader.makeThumb( file, function( error, src ) {
			        if ( error ) {
			        	//上传图片出错
			            _this.uploadImgFail();
			            return;
			        }
			        _this.$ImgBox.attr('src', src);
			    },1000,1000);
			});
			//文件上传成功
			uploader.on('uploadSuccess', function (file, res) {
			    if (res && res.id) {
			        _this.uploadImgSuccess(res.id,res.url,res.name);
			    } else if (res &&res.status == 0) {
			        _this.uploadImgFail();
			    } else {
			        _this.uploadImgFail();
			    }
			});
			//文件上传失败
			uploader.on('uploadError', function (file, reason) {
			    alert("失败")

			});
			//上传完成，不管成功失败
			uploader.on('uploadComplete', function (file) {
			    uploader.removeFile(file);
			    _this.loaded();
			});
			uploader.on('uploadBeforeSend', function (block, data, headers) {
			    headers["X-APICloud-AppKey"] = window.apiHeader['X-APICloud-AppKey'];
			    headers["X-APICloud-AppId"] = window.apiHeader['X-APICloud-AppId'];
			    _this.deletPic();//删除前一张照片
			});
			//上传中
			uploader.on('uploadProgress',function(file,percentage){
			});
		},
		//删除原有的图片防止数据库冗余
		deletPic:function(){
			var _this=this;
			//如果之前上传过图片
			if(this.imgId){
				$.ajax({
				  "url": "https://d.apicloud.com/mcm/api/file/"+this.imgId,
				  "cache": false,
				  "headers":apiHeader,
				  "data": {
				    "_method": "DELETE"
				  },
				  "type": "POST"
				}).success(function (data, status, header) {
					console.log("DeleteSuccess:"+JSON.stringify(data));
					_this.imgId="";
					_this.imgUrl="";
				}).fail(function (header, status, errorThrown) {
					console.log("DeleteFailure:"+JSON.stringify(header));
				})
			}
		},
		//图片上传失败
		uploadImgFail:function(){
			//清楚img标签里面的图片
			var _this=this;
			_this.$ImgBox.attr('src', "");
			//弹出提示框
			var index=layer.open({
			  title: '吉趣',
			  content: '图片上传失败,请重新上传',
			  btnAlign: 'c',
			  yes:function(index, layero){
			  	layer.close(index);	
			  },
			  cancel: function(){
			  	layer.close(index);	
			  }
			}); 
			_this.imgId=""; 
		},
		//图片上传成功
		uploadImgSuccess:function(id,url,name){
			this.imgId=id;
			this.imgUrl=url;			
			this.imgName=name;
			var _this=this;
			$.ajax({
			      "url": "https://d.apicloud.com/mcm/api/MyUser/"+_this.dataId,
			      "type": "POST",
			      "cache": false,
			      "headers":apiHeader,
			      "data": 
			      	{
				      	"HeadImgUrl":_this.imgUrl,
				      	"HeadImgId":_this.imgId,
				      	"_method":"PUT"
			      	}
			}).done(function (data, status, header) {
			}).fail(function (header, status, errorThrown) {
			});
		},
		//layui警告框
		alertBox:function(i){
			var _this=this;
			if(i==0){
				_this.LayerIndex=layer.open({
				  title: '吉趣',
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
				  title: '吉趣',
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