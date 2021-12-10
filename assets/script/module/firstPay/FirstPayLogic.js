var CoreLogic = require("CoreLogic")
cc.Class({
    extends: CoreLogic,
    properties:{

    },
    
    ctor(){

    },

    register:function(){
        this.events[MSGCode.OP_ACTIVITY_REWARD_S] = this.onNetReward.bind(this)
        this.events[MSGCode.OP_PAY_PAYMENT_RESULT_S] = this.onPayResult.bind(this)
        this.events[Events.LOGIN_NEW_DAY]  = this.onLoginNewDay.bind(this)
    },

    onNetReward(args){
        if( args.firstPayId > 0 ){
            let type = Gm.config.getPayRewardTypeById(args.firstPayId)
            if(type == AtyFunc.FIRS_PAY_TYPE){
                Gm.firstPayData.pushNewFirstId(args.firstPayId)
                Gm.send(Events.UPDATE_FIRST_PAY)
                this.view.updateView()
            }
          
        }
        Gm.red.refreshEventState("firstPay")
    },
    onPayResult(args){
        if(this.view){
            this.view.updateView()
        }
        Gm.red.refreshEventState("firstPay")
    },

    onLoginNewDay(args){
        var firstPayNewDay     = parseInt(cc.sys.localStorage.getItem("firstPayNewDay")) || 0
        if(args.isEnterNewDay && firstPayNewDay < 3 ){
            if(this.isCanPopView()){
                this.popView(firstPayNewDay)
            }
        }
    },

    popView(firstPayNewDay){
        cc.sys.localStorage.setItem("isPopFirstPayView",true) 
        firstPayNewDay = firstPayNewDay == 0 ? 1: ++firstPayNewDay
        cc.sys.localStorage.setItem("firstPayNewDay",firstPayNewDay) 
        Gm.ui.queuePush("FirstPayView")

    },

    isCanPopView(){
        var isreceiveAll = Gm.firstPayData.isCanReceive(2) 
        var constFirPayMap = Gm.config.getConst("firstPay_openMapId")
        return !isreceiveAll && Gm.userInfo.maxMapId >= constFirPayMap
    },
    checkPopView(){
        var  isPopFirstPayView = cc.sys.localStorage.getItem("isPopFirstPayView") || false 
        if(this.isCanPopView() && !isPopFirstPayView){
            this.popView()
        }
    }
})