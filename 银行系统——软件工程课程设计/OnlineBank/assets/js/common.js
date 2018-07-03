(function(window, undefined){
	//当前版本号
	window.version = "V 1.0.2";
	// API 接口地址的集合
	window.templateUrl = {
		/*选择账户*/
		selectAccount:"components/selectAccount/index.html",
		selectAccount_Band:"components/selectAccount/band.html",
		/*储蓄业务*/
		deposit_saveMoney:"components/deposit/saveMoney/index.html",
		saveMoneyAmount:"components/deposit/saveMoney/saveMoneyAmount.html",
		takeMoneyAmount:"components/deposit/takeMoney/index.html",
		
		/*贷款业务*/
		loan_loanMoney:"components/loan/loanMoney/index.html",
		loanMoneyAmount:"components/loan/loanMoney/loanMoneyAmount.html",
		loan_paybackMoney:"components/loan/payback/index.html",
		paybackAmount:"components/loan/payback/paybackAmount.html",
		/*核心数据*/
		depositRate:"components/rate/depositRate/index.html",
		loanRate:"components/rate/loanRate/index.html",
		plan:"components/plan/index.html",
		/*用户管理*/
		userManage:"components/userManage/accountManage/index.html",
		accountManage: 'components/userManage/accountManage/index.html',
		accountManage_Edit: 'components/userManage/accountManage/edit.html',
		accountManage_Create: 'components/userManage/accountManage/create.html',
		// 修改密码
		modifyPassword: 'components/userManage/accountManage/changePs.html',
		// 挂失
		reportLoss: 'components/reportLoss/index.html',
		// 交易管理
		tradeRecord: 'components/tradeManage/index.html',
		select_tradeRecord: 'components/tradeManage/selectTradeRecord.html',
		// 转账
		transfer: 'components/transfer/index.html',
		select_transfer: 'components/transfer/selectTransfer.html',
		transferAmount: 'components/transfer/transferAmount.html',
		/*无权限打开页面*/
		powerFail:"components/powerFail/index.html",
		/*焦老师*/
		infoTemplate: 'components/infomation/info.template.html',
	};

	var time = new Date().getTime();
	var header = {
		"X-APICloud-AppId": "A6073791468761",
		"X-APICloud-AppKey": sha1('A6073791468761'+'UZ'+'EF573EC8-7BF2-E54B-7FF9-FCF0EFED3A82'+'UZ'+time)+'.'+time
	};
	
	window.apiHeader=header;
	window.role="";
	window.cardNumber="";
	window._UserId=JZY.util.Cookie.getCookie('username');
})(window);
