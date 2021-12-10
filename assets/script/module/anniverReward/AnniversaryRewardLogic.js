var CoreLogic = require("CoreLogic")
cc.Class({
    extends: CoreLogic,
    properties:{

    },
    
    ctor(){

    },

    register:function(){
        this.events[Events.CEHCK_OPENP_ANNIVER_VIEW] = this.checkOpenView.bind(this)
        this.events[MSGCode.OP_ACT_REWARD_S] = this.onAnniversRet.bind(this)
    },
    onAnniversRet(args){
        if(args.type == AtyFunc.ANNIVER_SIGN_TYPE){
            Gm.anniversaryRewardData.setSignData(args.signDays)
            if(this.view){
                this.view.updateItem()
                this.view.showBottom()
            }
        }
    },

    checkOpenView(args){
        if(args.type == ConstPb.EventOpenType.EVENTOP_LOGIN_SIGN){
            if(EventFunc.isOpen(ConstPb.EventOpenType.EVENTOP_LOGIN_SIGN)){
                if(!Gm.anniversaryRewardData.isThatDayReceived()){
                    Gm.ui.queuePush("AnniversaryRewardView")
                }
            }
        }
     
    }

})