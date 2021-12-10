var CoreLogic = require("CoreLogic")
cc.Class({
    extends: CoreLogic,
    properties:{

    },
    
    ctor(){

    },

    register:function(){
        this.events[MSGCode.OP_ACTIVITY_REWARD_S] = this.onNetReward.bind(this)
        this.events[MSGCode.OP_ACT_STORE_PAY_S] = this.onNetActStorePay.bind(this)
        this.events[MSGCode.OP_PAY_PAYMENT_RESULT_S] = this.onPayResult.bind(this)

    },
    onPayResult(args){
        if(EventFunc.isOpen(ConstPb.EventOpenType.EVENTOP_STORE_PAY)){
            let price = AtyFunc.getPrice(args.activityId[0])
            Gm.accumulativePayData.addStoreAmount(price)
        }
        
        if(this.view){
            this.view.updateView()
        }
        Gm.red.refreshEventState("accuPay")
    },
    onNetActStorePay(args){
        Gm.accumulativePayData.setStoreAmount(args.storeAmount)
        Gm.accumulativePayData.setReceiveStore(args.receiveStore)
    },
    onNetReward(args){
        if( args.firstPayId > 0 ){
            let type = Gm.config.getPayRewardTypeById(args.firstPayId)
            if(type == AtyFunc.ACCU_PAY_TYPE){
                Gm.accumulativePayData.pushNewFirstId(args.firstPayId)
                Gm.send(Events.UPDATE_ACCU_PAY)
                this.view.updateView()
            }
        
        }
        Gm.red.refreshEventState("accuPay")
    },

})