
JZY.util.Cookie = (function($, undefined){
	/**
	 * 设置 cookie
	 * @param  name cokkie名称
	 * @param  value cookie值
	 * @param  expDays 过期时间
	 */
    var addCookie = function(name, value, expDays){
    	var cookie = '';
    	if (typeof expDays != 'undefined'){
    		var date = new Date();
            date.setTime(date.getTime() + parseInt(expDays) * 1000 * 60 * 60 * 24);
            cookie = name + '=' + encodeURIComponent(value) + ';expires=' + date.toUTCString();
    	} else {
    		cookie = name + '=' + encodeURIComponent(value);
    	}
        document.cookie = cookie;
    };
    /**
     * 获取 cookie
     * @param  name
     */
    var getCookie = function(name){
        var m = document.cookie.match('(?:^|;)\\s*' + name + '=([^;]*)');
        return (m && m[1]) ? decodeURIComponent(m[1]) : '';
    };
    /**
     * 删除 cookie
     * @param  name
     */
    var removeCookie = function(name){
        var date = new Date();
        date.setTime(date.getTime() - 1000);
        var cookie = name + '=0;expires=' + date.toUTCString();
        document.cookie = cookie;
    };
    
    return {
        addCookie: addCookie,
        getCookie: getCookie,
        removeCookie: removeCookie
    };
})(jQuery);