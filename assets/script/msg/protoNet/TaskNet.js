var MSGCode = require("MSGCode")
MSGCode.proto[MSGCode.OP_TASK_LIST_C]  = "Task.OPTaskList"
MSGCode.proto[MSGCode.OP_TASK_LIST_S]  = "Task.OPTaskListRet"

MSGCode.proto[MSGCode.OP_TASK_RECEIVE_C]  = "Task.OPTaskReceive"
MSGCode.proto[MSGCode.OP_TASK_RECEIVE_S]  = "Task.OPTaskReceiveRet"

MSGCode.proto[MSGCode.OP_TASK_ACTIVE_RECEIVE_C]  = "Task.OPTaskActiveReceive"
MSGCode.proto[MSGCode.OP_TASK_ACTIVE_RECEIVE_S]  = "Task.OPTaskActiveReceiveRet"

MSGCode.proto[MSGCode.OP_ACTIVE_ACTIVITY_RECEIVE_C]  = "Task.OPActiveActivityReceive"
MSGCode.proto[MSGCode.OP_ACTIVE_ACTIVITY_RECEIVE_S]  = "Task.OPActiveActivityReceiveRet"

cc.Class({
    properties: {
        
    },
    sendTaskList:function(){
        Gm.sendCmdHttp(MSGCode.OP_TASK_LIST_C,{playerId:Gm.userInfo.id})
    },
    sendTaskReceive:function(taskId){
        this.m_iGetId = taskId
        Gm.sendCmdHttp(MSGCode.OP_TASK_RECEIVE_C,{playerId:Gm.userInfo.id,taskId:taskId})
    },
    sendTaskActiveReceive:function(activeId){
        Gm.sendCmdHttp(MSGCode.OP_TASK_ACTIVE_RECEIVE_C,{playerId:Gm.userInfo.id,activeId:activeId})
    },
    sendActiveActivityReceive:function(){
        Gm.sendCmdHttp(MSGCode.OP_ACTIVE_ACTIVITY_RECEIVE_C,{playerId:Gm.userInfo.id})
    },
});
