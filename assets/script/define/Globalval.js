exports.baseUrl = null
exports.serverCheck = null
exports.serverBind = null
exports.staticUrl = "" //检测热更时带过来
exports.biUrl = null
exports.videoUrl = null
exports.playerFeedUrl = null //继承码、BUG提交URL
exports.resVersion = "1.0.0" //资源版本号
exports.hotUrl = "" //热更新地址

function init(typeName){
    var appType = Bridge.getAppType()
    if (appType == 0 ){ //测试包
        if (typeName == "mx"){
            exports.baseUrl = "http://127.0.0.1:12345"
        }
    }
}

exports.init = init
exports.setBaseURL = function(baseUrl){
    exports.baseUrl = baseUrl
}
exports.getBaseURL = function(){
    return exports.baseUrl
}
exports.getCheck = function(){
    return exports.baseUrl + "/LoginServer/login/Server_check.do"
}
exports.getBind = function(){
    return exports.baseUrl + "/LoginServer/login/Server_bind.do"
}
exports.getAccountServer = function(){
    return exports.baseUrl + "/LoginServer/login/Server_accountLogin.do"
}


