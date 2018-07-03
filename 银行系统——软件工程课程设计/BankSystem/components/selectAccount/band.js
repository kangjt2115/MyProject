KJT.component.selectAccount_band=(function($,window,undefined){

	var obj=function(option){
		this.init(option);
	}

	obj.prototype={
		constructor:obj,
		init:function(option){
			//面包屑导航
			this.$kjt_breadcrumb=option.$kjt_breadcrumb;
			this.$content=option.$content;
			this.$kjtbtn=option.$kjtbtn;
			// 评论
			this.getId();
			
		},
		//获取url中的id
		getId:function(){
			var kjt=window.location.href.split('?id=')[1];
			var subAccount=kjt.split('?cardNumber=')[0];
			var cardNumber=kjt.split('?cardNumber=')[1];
			console.log(this.$kjt_breadcrumb);
			console.log(this.$content.html);
			this.$kjt_breadcrumb.html("一卡通账号"+subAccount);
			this.$content.html("已选择账户"+cardNumber);
			$(".KJT_deposit1").attr("href","#deposit_saveMoney?accountNumber="+subAccount);
			$(".KJT_deposit").attr("href","#deposit_takeMoney?accountNumber="+subAccount);
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
