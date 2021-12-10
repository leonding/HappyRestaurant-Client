var MSGCode = require("MSGCode")
MSGCode.proto[MSGCode.OP_SIGN_INFO_C]        = "Sign.OPSignInfo"
MSGCode.proto[MSGCode.OP_SIGN_INFO_S]        = "Sign.OPSignInfoRet"
MSGCode.proto[MSGCode.OP_SIGN_DAY_C]        = "Sign.OPSignDay"
MSGCode.proto[MSGCode.OP_SIGN_DAY_S]        = "Sign.OPSignDayRet"
MSGCode.proto[MSGCode.OP_SIGN_COUNT_C]        = "Sign.OPSignCount"
MSGCode.proto[MSGCode.OP_SIGN_COUNT_S]        = "Sign.OPSignCountRet"

MSGCode.proto[MSGCode.OP_SYNC_WEEK_SIGN_INFO_S]        = "Sign.OPSyncWeekSignInfo"
MSGCode.proto[MSGCode.OP_RECEIVE_WSREWARD_C]        = "Sign.OPReceiveWSReward"
MSGCode.proto[MSGCode.OP_RECEIVE_WSREWARD_S]        = "Sign.OPReceiveWSRewardRet"

MSGCode.proto[MSGCode.OP_ONLINE_REWARD_C]        = "Sign.OPOnlineReward"
MSGCode.proto[MSGCode.OP_ONLINE_REWARD_S]        = "Sign.OPOnlineRewardRet"

cc.Class({
    properties: {
        
    },
    onlineReward(){
        Gm.sendCmdHttp(MSGCode.OP_ONLINE_REWARD_C)
    },
    get:function(){
        Gm.sendCmdHttp(MSGCode.OP_SIGN_INFO_C)
    },
    signDay:function(day){
        Gm.sendCmdHttp(MSGCode.OP_SIGN_DAY_C,{day:day})
    },
    signCount:function(countId){
        Gm.sendCmdHttp(MSGCode.OP_SIGN_COUNT_C,{countId:countId})
    },
    wsReward:function(eventId,id){
        Gm.sendCmdHttp(MSGCode.OP_RECEIVE_WSREWARD_C,{eventId:eventId,taskId:id})
    },
    

});
