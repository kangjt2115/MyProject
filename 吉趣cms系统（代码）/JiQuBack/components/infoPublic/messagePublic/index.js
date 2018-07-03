ZCC.component.messagePublic=(function($,window,undefined){
	var obj=function(option){
		this.init(option);
	};

	obj.prototype={
		constructor:obj,
		//id
		imgId:"",
		imgUrl:"",
		imgName:"",
		//需要上传的数据
		upDate:"",
		upSchPub:"",
		upTitle:"",
		upContent:"",
		init:function(option){
			//按钮
			this.$ImgButton=option.$ImgButton;
			this.$ImgBox=option.$ImgBox;
			this.$buttonBox=option.$buttonBox;
			//输入框
			this.$Editor=option.$Editor;
			this.$dateBox=option.$dateBox;
			this.$Title=option.$Title;
			this.$SchPub=option.$SchPub;
			//输出组件
			this.$AlertBox=option.$AlertBox;
			this.bindEvent();
			this.getData();
		},
		//上传数据
		uploadData:function(){
			var _this=this;
			_this.loading();
			//2017-11-15 00:00:00
			var data=_this.upDate.slice(0, 16); 
			$.ajax({
			      "url": "https://d.apicloud.com/mcm/api/OrganSchool",
			      "type": "POST",
			      "cache": false,
			      "headers":apiHeader,
			      "data": 
			    	{
			    		"schTime":data,
			    		"schPub":_this.upSchPub,
			    		"schTitle":_this.upTitle,
			    		"schContent":_this.upContent,
			    		"Title":_this.UpTitle,
			    		"schPic":{
			    			"id":_this.imgId,
			    			"name":_this.imgName,
			    			"url":_this.imgUrl,
			    		}
			    	}
			}).done(function (data, status, header) {
		    	_this.loaded();
		    	_this.reflash(true);
		    	_this.layuiAlert("发布成功！");
		    	_this.$ImgBox.attr("src","");
		    	console.log(data);
			}).fail(function (header, status, errorThrown) {
				_this.showUpdataF();
			});
		},
		//获取DOM内数据
		getData:function(){
			var date=this.$dateBox.val();
			var schPub=this.$SchPub.val();
			var title=this.$Title.val();
			var content=this.$Editor.html();
			this.upDate=date;
			this.upSchPub=schPub;
			this.upTitle=title;
			this.upContent=content;
			console.log(date+":"+schPub+":"+title+":"+content);
			if(date&&schPub&&title&&content){return true;}
			else{return false;}
		},
		//绑定事件
		bindEvent:function(){
			//绑定日历
			this.bindDateSelect();
			//绑定上传图片
			this.uploadPic();
			//绑定底部按钮
			this.bindButtomButton();
		},
		//reflash
		reflash:function(ifSuccess){
			this.loading();
			this.upDate="";
			this.upSchPub="";
			this.upTitle="";
			this.upContent="";
			this.$dateBox.val("");
			this.$SchPub.val("");
			this.$Title.val("");
			this.$Editor.html("");
			if(!ifSuccess){
				this.deletPic();
			}
			this.loaded();
		},
		//绑定底部按钮
		bindButtomButton:function(){
			var _this=this;
			//放弃
			this.$buttonBox.children(".btn-danger").off("click.ZCC").on("click.ZCC",function(ev){
				ev.stopPropagation();
				var index=layer.open({
					  title: '吉趣',
					  btn: ['确定', '取消'],
					  content: "确认是否放弃发布？",
					  btnAlign: 'c',
					  yes:function(){//第一个按钮的回调函数
					  	console.log("yes");
					  	//删除图片
					  	_this.$ImgBox.attr("src",null);
					  	_this.reflash(false);
					  	layer.close(index);			//关闭指定弹窗
					  },
					  btn2:function(){//第二个按钮的回调函数
					  	console.log("btn2")
					  },
					  cancel: function(){//顶部关闭按钮的回调函数
					  	console.log('右上角关闭回调');
					  }
				});  

			});
			this.$buttonBox.children(".btn-primary").off("click.ZCC").on("click.ZCC",function(ev){
				ev.stopPropagation();
				if(_this.getData()){
					_this.uploadData();
				}else{
					_this.layuiAlert("填写信息不完整");
				};
			});
		},
		//绑定日历
		bindDateSelect:function(){
			var _this=this;
			layui.use('laydate', function(){
			  var laydate = layui.laydate;
			  //执行一个laydate实例
			  laydate.render({
			    elem: _this.$dateBox.selector, //指定元素
			    type: 'datetime'
			  });
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
		},
		//上传成功
		showUpdataS:function(){
			// var str='<div class="alert alert-success alert-dismissible fade in" role="alert">'
			// 	  +'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
			// 	  +'<strong>Success!</strong> 上传成功'
			// 	+'</div>';
			// this.$AlertBox.html(str);
		},
		//上传失败
		showUpdataF:function(){
			// var str='<div class="alert alert-danger alert-dismissible fade in" role="alert">'
			// 	  +'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
			// 	  +'<strong>Warning!</strong> 上传失败'
			// 	+'</div>';
			// this.$AlertBox.html(str);
		},
	}
	return obj;
})(jQuery,this)