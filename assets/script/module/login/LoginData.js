cc.Class({
    properties: {
       ip:0,
       port:0, 
       intpuName:"",
       canExtendBind:0,
       pushToken:"",
       accountCode:0,
       serverNowId:0,
    },
    
    ctor:function(){
        var sId = cc.sys.localStorage.getItem("serverId") || ""
        if(sId == ""){
            this.lastServers = []
        }else{
            this.lastServers = JSON.parse(sId)
        }
    },
    setIgnore(ignore){
        this.ignore = ignore
    },
    getIgnore(){
        return this.ignore
    },
    getLoginName:function(){
        return this.intpuName
    },
    setLoginName:function(value){
        this.intpuName = value
    },
    setAccountCode(code){
        this.accountCode = code
    },
    getLoginData:function(){
        var data = {}
        data.puid = this.getDeviceId()
        cc.log("getLoginData", data.puid)
        
        return data
    },
    getArea(){
        return Gm.config.getServerGate(Bridge.getAppType()).area
    },
    isOpenShop(){
        var dd = Gm.config.getServerGate(Bridge.getAppType())
        return dd.shopOpen == 1
    },
    getPlatformType(){
        var dd = Gm.config.getServerGate(Bridge.getAppType())
        if (Bridge.isAndroid()){
            return dd.androidPlatformType
        }else if (Bridge.isIos()){
            return dd.iosPlatformType
        }else {
            return 1
        }
    },
    getDeviceId(){
        var dId = this.getLoginName()
        if (Bridge.isReview()){
            return dId
        }
        var deviceId
        if(cc.sys.isNative){
            var deviceIdtest = cc.sys.localStorage.getItem("deviceIdtest") || ""
            if (deviceIdtest== null || deviceIdtest == ""){
                var deviceInfo = JSON.parse( Bridge.getDeviceInfo())

                if (deviceInfo.android_id){
                    deviceId = deviceInfo.android_id
                }else{
                    deviceId = deviceInfo.model
                }
                deviceId = deviceId + Func.random(56874,100000000) + Func.random(3214,68741687)    

                cc.sys.localStorage.setItem("deviceIdtest",deviceId)
            }else{
                deviceId = deviceIdtest
            }
        }else{
            deviceId = dId
        }
        return deviceId
    },
    getChannel:function(){
        if (Bridge.isAndroid()){
            return 2
        }else if (Bridge.isIos()){
            return 1
        }else {
            return 0
        }
    },
    setData:function(data){
        this.platform = Number(data.platform)
        this.ip = data.server
        this.port = data.port
    },
    setCanExtendBind(value){
        this.canExtendBind = value
    },
    isCanExtend(){
        return this.canExtendBind ==1
    },
    setPushToken(token){
        this.pushToken = token
    }
});
