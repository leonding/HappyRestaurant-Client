var CoreLogic = require("CoreLogic")
cc.Class({
    extends: CoreLogic,
    properties: {
        
    },
    ctor:function(){
        this.googlePayList = []
    },
    register:function(){
        this.events[Events.SOCKET_CLOSE]        = this.onSocketClose.bind(this)
        this.events[MSGCode.OP_PAY_CREATE_PAYMENT_S] = this.onPayCreate.bind(this)
        this.events[MSGCode.OP_PAY_PAYMENT_RESULT_S] = this.onPayResult.bind(this)

        this.events[Events.NATIVE_PAY_RESULT] = this.onNativePayResult.bind(this)
        this.events[MSGCode.OP_PLAYER_LOGIN_S] = this.onNetPlayerLogin.bind(this)

        this.events[MSGCode.OP_BIND_PAY_ACCOUNT_S] = this.onPayAccountRet.bind(this)

        this.events[MSGCode.OP_ERROR_CODE_INFO_S] = this.onNetErrorCode.bind(this)

        this.events[MSGCode.OP_BIND_PAY_INFO_S]   = this.onMonthPayInfo.bind(this)
    },
    onNetPlayerLogin(){
        Bridge.queryAndConsumePurchase()
    },
    onSocketClose:function(args){

    },
    onPayCreate:function(args){
        if (args.result == 0){
            Bridge.payBuy(Gm.payNet.productId)
        }
    },
    onPayResult:function(args){
        if (args.googlePayIndex != null){
            Bridge.googlePayConsumePurchase(args.googlePayIndex)
        }
        if (args.orderId){
            for(const i in args.orderId){
                Bridge.googlePayConsumePurchase(args.orderId[i])
            }
        }
        
        if(args.activityId && args.activityId.length > 0){
            Gm.floating(Ls.get(60003))
            Gm.userInfo.payInfo = args.payInfo
            Gm.send(Events.USER_INFO_UPDATE)
            if (this.isView()){
                this.view.updatePayView()
            }

            if (Bridge.isGoogle() && args.googlePayIndex != null){
                setTimeout(()=> {
                    var payData = this.googlePayList[args.googlePayIndex]
                    console.log("googlePayList===:",payData)
                }, 1000*5);
            }
            
        }else{
            Gm.floating(Gm.config.getErr(args.result))
        }
    },
    onNativePayResult(args){
        if (args.type == "google"){
            Gm.payNet.payResult(args)
            this.googlePayList.push(args)
        }else if(args.type == "apple"){
            Gm.payNet.payResult(args)
        }
    },

    onPayAccountRet(args){
        if(args.result == 0 ){ //成功
            console.log("绑定成功")
            cc.sys.localStorage.setItem("isBindAccount","1") 
            Gm.floating( 5419)
        }
    },
    onNetErrorCode(args){
        if(args.errCode == -140008 ){
            console.log("绑定失败")
            Gm.floating(Gm.config.getErr(args.errCode))
            cc.sys.localStorage.setItem("isBindAccount","0") 
        }
    },

    isBindAccount(){
        var isBind = cc.sys.localStorage.getItem("isBindAccount") || "0" 
        if(Bridge.isAndroid() || Bridge.isIos()){
            return isBind == "0"
        }else{
            return false
        }
        
    },
    //月支付情况
    onMonthPayInfo(data){
        Gm.userInfo.setMonthConsume(data.consume || 0)
        Gm.userInfo.setBirthDayByTime(data.jpBornDate || null)
    }

});
