var MSGCode = require("MSGCode")
MSGCode.proto[MSGCode.OP_TRAVEL_INFO_S]  = "Travel.OPTravelInfoRet"

MSGCode.proto[MSGCode.OP_TRAVEL_DAILY_REFRESH_C]  = "Travel.OPTravelDailyRefresh"
MSGCode.proto[MSGCode.OP_TRAVEL_DAILY_REFRESH_S]  = "Travel.OPTravelDailyRefreshRet"

MSGCode.proto[MSGCode.OP_TRAVEL_TASK_REFRESH_C]  = "Travel.OPTravelTaskRefresh"
MSGCode.proto[MSGCode.OP_TRAVEL_TASK_REFRESH_S]  = "Travel.OPTravelTaskRefreshRet"

MSGCode.proto[MSGCode.OP_TRAVEL_TASK_START_C]  = "Travel.OPTravelTaskStart"
MSGCode.proto[MSGCode.OP_TRAVEL_TASK_START_S]  = "Travel.OPTravelTaskStartRet"

MSGCode.proto[MSGCode.OP_TRAVEL_TASK_DONE_C]  = "Travel.OPTravelTaskDone"
MSGCode.proto[MSGCode.OP_TRAVEL_TASK_DONE_S]  = "Travel.OPTravelTaskDoneRet"

MSGCode.proto[MSGCode.OP_TRAVEL_OPEN_C]  = "Travel.OPTravelOpen"
MSGCode.proto[MSGCode.OP_TRAVEL_OPEN_S]  = "Travel.OPTravelOpenRet"

MSGCode.proto[MSGCode.OP_TRAVEL_RECEIVE_C]  = "Travel.OPTravelReceive"
MSGCode.proto[MSGCode.OP_TRAVEL_RECEIVE_S]  = "Travel.OPTravelReceiveRet"

MSGCode.proto[MSGCode.OP_TRAVEL_AID_LIST_C]  = "Travel.OPTravelAidList"
MSGCode.proto[MSGCode.OP_TRAVEL_AID_LIST_S]  = "Travel.OPTravelAidListRet"

cc.Class({
    properties: {
        
    },
    sendTravelDailyRefresh:function(){
        Gm.sendCmdHttp(MSGCode.OP_TRAVEL_DAILY_REFRESH_C)
    },
    sendTravelTaskRefresh:function(type,team){
        Gm.sendCmdHttp(MSGCode.OP_TRAVEL_TASK_REFRESH_C,{type:type,team:team})
    },
    sendTravelTaskStart:function(list){
        Gm.sendCmdHttp(MSGCode.OP_TRAVEL_TASK_START_C,{travelStart:list})
    },
    sendTravelTaskDone:function(index,oneKey){
        Gm.sendCmdHttp(MSGCode.OP_TRAVEL_TASK_DONE_C,{index:index,oneKey:oneKey})
    },
    sendTravelOpen:function(){
        Gm.sendCmdHttp(MSGCode.OP_TRAVEL_OPEN_C)
    },
    sendTravelAidList:function(localData){
        this.openData = localData
        Gm.sendCmdHttp(MSGCode.OP_TRAVEL_AID_LIST_C)
    },
    sendTravelReceive:function(list){
        Gm.sendCmdHttp(MSGCode.OP_TRAVEL_RECEIVE_C,{index:list})
    },
});
