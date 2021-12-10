var CoreLogic = require("CoreLogic")
const SUCCESS = 1
cc.Class({
    extends: CoreLogic,
    properties: {
        
    },
    ctor:function(){
 
    },
    register:function(){
        this.events[MSGCode.OP_BIND_PAY_ACCOUNT_S]  = this.onAccountRet.bind(this)
        this.events[MSGCode.OP_FIND_OLD_USER_S]  = this.onAccountFindOldRet.bind(this)
    },

    onAccountRet(args){
        var layer = Gm.ui.getLayer("AccountLoginView")
        if(args.result == 0 ){ //成功
            layer.getComponent("AccountLoginView").setBindStatus(SUCCESS)
        }

        if(args.serverId && args.deviceId ){ //玩家已经绑定过该帐号
            this.switchServer(args.serverId,args.deviceId )
        }
    },

    onAccountFindOldRet(args){
        if(args.result == 0 && args.serverId && args.deviceId ){
            this.switchServer(args.serverId ,args.deviceId )
        }else{
            var data = {}
            data.ok  = Ls.get(60016)
            data.msg = Ls.get(5486)
            data.btnNum = 1
            Gm.box(data,)
        }
    },

    switchServer(serverId,deviceId){
        var self = this
        var callback  = function(type){ 
            if(type == 1){
                self.loginOut()
                var serverData = {}
                serverData.id = serverId
                serverData.value = Gm.config.serverById(serverId).value
                var dd = {deviceId:deviceId}
                if(cc.sys.isNative){
                    cc.sys.localStorage.setItem("deviceIdtest",deviceId)
                }else{
                    cc.sys.localStorage.setItem("loginName",deviceId) 
                    Gm.loginData.setLoginName(deviceId)
                }
                console.log("切换服务器=====>",serverData.value)
                console.log("deviceID=====>",dd.deviceId)
                console.log("serverID=====>",serverData.id)
                Gm.send(Events.MSG_CLOSE,{quit:true})
                Gm.getLogic("LoginLogic").onAutoLogin(serverData,dd)
            }
            
        }
        var data = {}
        data.callback = callback
        data.ok  = Ls.get(5436)
        data.cancel =  Ls.get(600058)
        data.msg = Ls.get(5485)
        data.btnNum = 2
        Gm.ui.create("MessageBox",data)
    },

    loginOut(){
        Gm.netLogic.clearData()
        Gm.ui.removeAllView()
        Gm.ui.create("LoginView",1)
    },

});
