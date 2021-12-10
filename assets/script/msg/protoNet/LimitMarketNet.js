var MSGCode = require("MSGCode")

MSGCode.proto[MSGCode.OP_ACT_MARKET_INFO_S]        = "Activity.OPActMarketInfoRet"
MSGCode.proto[MSGCode.OP_ACT_MARKET_INFO_C]         = "Activity.OPActMarketInfo"

cc.Class({

    buyItem(action){
        if(EventFunc.isOpen(ConstPb.EventOpenType.EVENTOP_MARKET)){
            Gm.sendCmdHttp(MSGCode.OP_ACT_MARKET_INFO_C,{action:action})
        }
    }

})





