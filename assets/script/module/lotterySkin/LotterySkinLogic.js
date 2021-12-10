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
        if(args.type == AtyFunc.ANNIVER_SKIN_TYPE){
            Gm.lotterySkinData.setIsReceived(true)
            this.view.onBack()
        }
    },
    checkOpenView(args){
        if(args.type == ConstPb.EventOpenType.EVENTOP_RANDOM_SKIN){
            if( EventFunc.isOpen(ConstPb.EventOpenType.EVENTOP_RANDOM_SKIN) ){
                var key = "lottery_skin_open_time"
                var openTime = parseInt(cc.sys.localStorage.getItem(key) ) || 0
                var actTime = EventFunc.getTime(ConstPb.EventOpenType.EVENTOP_RANDOM_SKIN)
                if(openTime < actTime.openTime){
                    Gm.ui.queuePush("LotterySkinView")
                    cc.sys.localStorage.setItem(key,Gm.userData.getTime_m()) 
                }
            }
        }
    
    }
})