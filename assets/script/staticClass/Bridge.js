
//--------------------jsb java、oc------------------------
exports.isAndroid = function(){
    return cc.sys.isNative && cc.sys.platform == cc.sys.ANDROID
}
exports.isIos = function(){
    return cc.sys.isNative && (cc.sys.platform == cc.sys.IPHONE || cc.sys.platform == cc.sys.IPAD)
}
//java、oc主动调用js代码
exports.toJs = function(str){
    console.log("ToJs",str)
    var data = {}
    var ss = str.split("_")
    data.type = ss[0]
    data.oldStr = str
    for (let index = 1; index < ss.length; index++) {
        data["args" + index] = ss[index]
    }
    if (data.type == "firebaseToken"){
        Gm.loginData.setPushToken(str.substring(14,str.length))
    }else if (data.type == "googlePay"){

    }else if( data.type == "googlePlayLogin" ){
       var t = str.substring(16,str.length)
       if(this.appleTokenCallBack){
         this.appleTokenCallBack(t)
       }else{
        Gm.payNet.sendToken( Gm.userInfo.id,t)
       }
    }else if( data.type == "googleChangeAccount" ){
        var ct = str.substring(data.type.length+1,str.length)
        // Gm.changeAccountNet.sendChangeAccountToken(ct,"google") //暂弃
        if(this.googleTokenCallBack){
            this.googleTokenCallBack(ct)
        }
    }else if( data.type == "freeMemory" ){
        var memory = str.substring(data.type.length+1,str.length)
        Gm.storyData.setDeviceMemory(memory)
    }else if(data.type == "gameCenter"){
        var ct = str.substring(data.type.length+1,str.length)
        if(this.gameCenterTokenCallBack){
            this.gameCenterTokenCallBack(ct)
        }
    }
}

exports.setPushToken = function(){
    cc.log("setPushToken",str)
    var methodName = "getPushToken"
    var className = this.iClassName()
    var str = jsb.reflection.callStaticMethod(className,methodName);
    Gm.loginData.setPushToken(str)
}


exports.aClassName = function(){
    return "org/cocos2dx/javascript/AppActivity"
}
exports.aHelperName = function(){
    return "org/cocos2dx/lib/Cocos2dxHelper"
},
exports.iClassName = function(){
    return "AppController"
}
exports.REVIEW_CONST = 888

exports.isReview = function() {
    return this.getAppType() == this.REVIEW_CONST
}

exports.getAppVersion = function(isString){
    var version = "1.0.0"
    var methodName = "getVersion"
    if (this.isAndroid()){
        var className = this.aHelperName()
        var methodSig = "()Ljava/lang/String;"
        version = jsb.reflection.callStaticMethod(className, methodName, methodSig);
    }else if(this.isIos()){
        var className = this.iClassName()
        version = jsb.reflection.callStaticMethod(className,methodName);
        console.log("ios==getAppVersion==:",version)
    }
    if (isString){
        return version
    }
    var ss = version.split(".")
    var ver = ""
    for (let index = 0; index < ss.length; index++) {
        const v = ss[index];
        ver = ver + v
    }
    return ver
}

exports.getAppType = function(){
    if (exports.nowAppType != null){
        return exports.nowAppType
    }
    var appType = 0
    if (!cc.sys.isNative){
        appType = Gm.appType
    }
    var methodName = "getAppType"
    if (this.isAndroid()){
        var className = this.aClassName()
        var methodSig = "()Ljava/lang/String;"
        appType = jsb.reflection.callStaticMethod(className, methodName, methodSig);
    }else if(this.isIos()){
        var className = this.iClassName()
        appType = jsb.reflection.callStaticMethod(className,methodName);
        console.log("ios==getAppType==:",appType)
    }
    exports.nowAppType = checkint(appType)
    return exports.nowAppType
}
exports.getOpenUDID = function(){
    var methodName = "getMac"
    if (this.isAndroid()){
        var className = this.aClassName()
        var methodSig = "()Ljava/lang/String;"
        var result = jsb.reflection.callStaticMethod(className, methodName, methodSig);
        if (result == "02:00:00:00:00:00" || result == ""){
            return JSON.parse(Bridge.getDeviceInfo()).android_id
        }
        return result
    }else if(this.isIos()){
        var className = this.iClassName()
        var result = jsb.reflection.callStaticMethod(className,methodName);
        console.log("ios==getOpenUDID==:",result)
        return result
    }
    return ""
}

exports.getDeviceInfo = function() {
    var methodName = "getDeviceInfo"
    if (this.isAndroid()){
        var className = this.aClassName()
        var methodSig = "()Ljava/lang/String;"
        var result = jsb.reflection.callStaticMethod(className, methodName, methodSig);
        return result
    }else if(this.isIos()){
        var dd = {model:jsb.device.getDeviceModel()}
        return JSON.stringify(dd)
    }
    return JSON.stringify({model:"1111"})
}
exports.checkGoogleLogin = function() {
    var methodName = "checkGoogleLogin"
    if (this.isGoogle()){
        var className = this.aClassName()
        var methodSig = "()V"
        var result = jsb.reflection.callStaticMethod(className, methodName, methodSig);
    }
}

exports.checkAppleLogin = function(calback) {
    var methodName = "authenticateLocalPlayer"
    exports.appleTokenCallBack = calback
    if (this.isIos()){
        var className = "ApplePayHelper"
        var result = jsb.reflection.callStaticMethod(className, methodName);
    }
}

exports.checkGameCenter = function(calback) {
    var methodName = "authenticateLocalPlayer"
    exports.gameCenterTokenCallBack = calback
    if (this.isIos()){
        var className = "AppController"
        var result = jsb.reflection.callStaticMethod(className, methodName);
    }
}

exports.changeGoogleAccount = function(fb) {
    var methodName = "changeGoogleAccount"
    exports.googleTokenCallBack = fb
    if (this.isGoogle()){
        var className = this.aClassName()
        var methodSig = "()V"
        var result = jsb.reflection.callStaticMethod(className, methodName, methodSig);
    }
}



exports.openPhoto = function() {
    var methodName = "openPhoto"
    if (this.isAndroid()){
        console.log("js === openPhoto")
        var className = this.aClassName()
        var methodSig = "()V"
        var result = jsb.reflection.callStaticMethod(className, methodName, methodSig);
    }
}

exports.openCamera = function(){
    var methodName = "openCamera"
    if (this.isAndroid()){
        console.log("js === openCamera")
        var className = this.aClassName()
        var methodSig = "()V"
        var result = jsb.reflection.callStaticMethod(className, methodName, methodSig);
    }
}


exports.setInstallApkName = function(apkName){
    if (this.isAndroid()){
        var className = this.aClassName()
        var methodName = "setInstallApkName"
        var methodSig = "(Ljava/lang/String;)V"
        var result = jsb.reflection.callStaticMethod(className, methodName, methodSig,apkName);
        return result
    }
    return "123456789"
}
exports.installApk = function(){
    if (this.isAndroid()){
        var className = this.aClassName()
        var methodName = "installApk"
        var methodSig = "()V"
        var result = jsb.reflection.callStaticMethod(className, methodName, methodSig);
        return result
    }
}

exports.getPushToken = function() {
    if (this.isAndroid()){
        if (Gm.loginData.getPlatformType() == ConstPb.platformType.GOOGLE){
            var className = "org/cocos2dx/javascript/MyFirebaseMessagingService"
            var methodName = "getPushToKen"
            var methodSig = "()V"
            jsb.reflection.callStaticMethod(className, methodName, methodSig);
        }
    }
}

exports.copyStr = function(str){
    Gm.floating(Ls.get(102))
    var input = str || ""
    if (cc.sys.isNative){
        jsb.copyTextToClipboard(input)
    }else{
        const el = document.createElement('textarea');
        el.value = input
        el.setAttribute('readonly', '');
        el.style.contain = 'strict';
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        el.style.fontSize = '12pt';

        const selection = getSelection();
        var originalRange = false;
        if (selection.rangeCount > 0) {
            originalRange = selection.getRangeAt(0);
        }
        document.body.appendChild(el);
        el.select();
        el.selectionStart = 0;
        el.selectionEnd = input.length;

        var success = false;
        try {
            success = document.execCommand('copy');
        } catch (err) {
            cc.log(err)
        }

        document.body.removeChild(el);

        if (originalRange) {
            selection.removeAllRanges();
            selection.addRange(originalRange);
        }

        return success;
    }
}

//数据统计
exports.analyticsEvent = function(apkName){
    if (this.isGoogle()){
        var className = this.aClassName()
        var methodName = "analyticsEvent"
        var methodSig = "(Ljava/lang/String;)V"
        var result = jsb.reflection.callStaticMethod(className, methodName, methodSig,apkName);
    }
}

//-----------------支付-----------------
exports.payBuy = function(productId) {
    console.log(productId,"支付")
    if (this.isAndroid()){
        if (Gm.loginData.getPlatformType() == ConstPb.platformType.GOOGLE){
            var className = this.aClassName()
            var methodName = "payBuy"
            var methodSig = "(Ljava/lang/String;)V"
            var result = jsb.reflection.callStaticMethod(className,methodName,methodSig,productId);
        }
    }else if(this.isIos()){
        // this.m_PayList.push({productId:productId})
        // this.savePayList()
        console.log("ios==购买===",productId)
        var result = jsb.reflection.callStaticMethod("ApplePayHelper","payForProduct:",productId);
    }
}
//同步已支付为消耗的订单
exports.queryAndConsumePurchase = function() {
    if (this.isGoogle()){
        var className = this.aClassName()
        var methodName = "queryAndConsumePurchase"
        var methodSig = "()V"
        var result = jsb.reflection.callStaticMethod(className, methodName, methodSig);
    }else if (this.isIos()){
        this.requestAppStoreProducts()
        var receipt = 0
        var orderId = 0
        for(const i in this.m_PayList){
            if (this.m_PayList[i].receipt){
                receipt = this.m_PayList[i].receipt
            }
            if (this.m_PayList[i].orderId){
                orderId = this.m_PayList[i].orderId
            }
        }
        console.log("orderId===:",orderId,receipt)
        this.m_PayList = []
        this.savePayList()
        if (receipt){
            Gm.send(Events.NATIVE_PAY_RESULT,{type:"apple",receipt:receipt})
        }else{
            this.__verifyUnfinishApplePay()
        }
    }
}

exports.googlePaySignature = function(signature,payIndex){
    var originalJson = exports.getGooglePayOriginalJson(payIndex)
    Gm.send(Events.NATIVE_PAY_RESULT,{googlePayIndex:checkint(payIndex),type:"google",data:originalJson,sign:signature})
}

exports.getGooglePayOriginalJson = function(payIndex){
    if (this.isGoogle()){
        var methodName = "getGooglePayOriginalJson"
        var className = this.aClassName()
        var methodSig = "(Ljava/lang/String;)Ljava/lang/String;"
        return jsb.reflection.callStaticMethod(className, methodName, methodSig,payIndex.toString());
    }
}
//消耗订单
exports.googlePayConsumePurchase = function(payIndex){
    if (this.isGoogle()){
        var methodName = "googlePayConsumePurchase"
        var className = this.aClassName()
        var methodSig = "(Ljava/lang/String;)V"
        jsb.reflection.callStaticMethod(className, methodName, methodSig,payIndex.toString());
    }else if (this.isIos()){
        if (payIndex){
            for(const i in this.m_PayList){
                if (this.m_PayList[i].orderId == payIndex){
                    this.m_PayList.splice(i,1)
                    this.savePayList()
                    console.log("ios==购买完成===:",payIndex)
                    // jsb.reflection.callStaticMethod("ApplePayHelper","finishPay:",payIndex)
                    break
                }
            }
            jsb.reflection.callStaticMethod("ApplePayHelper","finishPay:",payIndex)
        }
    }
}
exports.isGoogle = function () {
    return this.isAndroid() && Gm.loginData.getPlatformType() == ConstPb.platformType.GOOGLE && Gm.loginData.isOpenShop()
}

// 回调苹果支付结果
exports.doPayAppStoreResult = function(resultCode, productId, orderId, date){
    console.log("doPayAppStoreResult==:",resultCode)
    if (resultCode == 0){
        var can = true
        for(const i in this.m_PayList){
            if (this.m_PayList[i].productId == productId){
                this.m_PayList[i].orderId = orderId
                this.savePayList()
                can = false
                break
            }
        }
        if (can){
            this.m_PayList.push({productId:productId,orderId:orderId})
            this.savePayList()
        }
        this.verifyAppleStorePay(orderId)
        // for(const i in this.m_PayList){
        //     const v = this.m_PayList[i]
        //     if (v.productId == productId && v.orderId == null){
        //         this.m_PayList[i].orderId = orderId
        //         break
        //     }
        // }
    }
}
exports.verifyAppleStorePay = function(orderId){
    // 发送二次支付验证请求
    var receipt = jsb.reflection.callStaticMethod("ApplePayHelper","getReceiptNow:",orderId)
    // console.log("orderId===;",orderId,receipt)
    if (receipt.length > 0){
        for(const i in this.m_PayList){
            const v = this.m_PayList[i]
            if (v.orderId == orderId && v.receipt == null){
                this.m_PayList[i].receipt = receipt
                this.savePayList()
                break
            }
        }
        Gm.send(Events.NATIVE_PAY_RESULT,{type:"apple",receipt:receipt})
    }
}
// 开启验证未完成的苹果支付订单
// 程序启动时候调用一次
exports.__verifyUnfinishApplePay = function(){
    if (this.isIos()){
        console.log("ios==未完成订单进入===")
        jsb.reflection.callStaticMethod("ApplePayHelper","verifyUnfinishPayment")
    }
}

// 初始化苹果商店商品列表
exports.requestAppStoreProducts = function(){
    if(this.isIos()){
        this.m_PayList = []
        var str = cc.sys.localStorage.getItem("AppStoreList") || ""
        var list = str.split(";")
        list.splice(list.length - 1,1)
        for(const i in list){
            var data = list[i].split("_")
            this.m_PayList.push({productId:data[0],orderId:data[1],receipt:data[2]})
        }
        console.log("this.m_PayList===:",this.m_PayList.length)

        var payAll = Gm.config.getConfig("PayProductConfig")
        payAll.sort(function(a,b){
            return a.id - b.id
        })
        var products = ""
        var lens = payAll.length
        for(var i = 0;i < lens;i++){
            products = products + payAll[i].itemId
            if (i < lens - 1){
                products = products + ";"
            }
        }
        // console.log("ios==初始化订单===",products)
        jsb.reflection.callStaticMethod("ApplePayHelper","requestProducts:",products);
    }
}

exports.savePayList = function(){
    var str = ""
    for(const i in this.m_PayList){
        var data = "" + this.m_PayList[i].productId
        if (this.m_PayList[i].orderId){
            data = data + "_" + this.m_PayList[i].orderId
        }
        if (this.m_PayList[i].receipt){
            data = data + "_" + this.m_PayList[i].receipt
        }
        str = str + data + ";"
    }
    cc.sys.localStorage.setItem("AppStoreList",str)
}

exports.getFreeMemory = function(){
    var methodName = "getFreeMemory"
    if (this.isAndroid()){
        var className = this.aClassName()
        var methodSig = "()V"
        var result = jsb.reflection.callStaticMethod(className, methodName, methodSig);
    }else if(this.isIos()){
        var className = "AppController"
        var result = jsb.reflection.callStaticMethod(className, methodName);
    }
}

exports.isHk = function(){
    return Bridge.getAppType() == 5
}

exports.isJp = function(){
    return Bridge.getAppType() == 3
}