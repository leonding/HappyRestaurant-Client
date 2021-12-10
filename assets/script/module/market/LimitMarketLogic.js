var CoreLogic = require("CoreLogic")
const SUCCESS = 1
cc.Class({
    extends: CoreLogic,
    properties: {
        
    },
    ctor:function(){
 
    },
    register:function(){
        this.events[MSGCode.OP_ACT_MARKET_INFO_S]  = this.onNetBuyRet.bind(this)
        this.events[Events.LOGIN_SUC]        = this.onLoginSuc.bind(this)
    },
    onLoginSuc(){
        Gm.limitMarketData.clearData()
    },

    onNetBuyRet(args){
        if(args.buyCount >= 1 ){
            Gm.limitMarketData.setBuySuccess(true)
            if(this.view){
                this.view.setUI()
            }
            if(this.view){
                this.view.updateDiamond()
            }
        }
        Gm.red.refreshEventState("limitmark")

    }
});
