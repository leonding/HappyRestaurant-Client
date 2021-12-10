const i18n = require('LanguageData');
exports.get = function(id){
    return i18n.t(id)
}

exports.lv = function() {
	if (exports.nowLv){
		return exports.nowLv
	}
	if (Bridge.isReview()){
		exports.nowLv = exports.get(5470)
	}else{
		exports.nowLv = "Lv."	
	}
	return exports.nowLv
	
}