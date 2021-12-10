var CoreLogic = require("CoreLogic")
cc.Class({
    extends: CoreLogic,
    properties: {
        
    },
    ctor:function(){

    },
    register:function(){
        this.events[Events.LOGIN_SUC]       = this.onLogicSuss.bind(this)
        this.events[MSGCode.OP_TASK_LIST_S] = this.onTaskList.bind(this)
        this.events[MSGCode.OP_TASK_RECEIVE_S] = this.onTaskReceive.bind(this)
        this.events[MSGCode.OP_TASK_ACTIVE_RECEIVE_S] = this.onTaskActiveReceive.bind(this)
        this.events[MSGCode.OP_ACTIVE_ACTIVITY_RECEIVE_S] = this.onActiveActivityReceive.bind(this)
    },
    onLogicSuss:function(){
        Gm.missionData.clearData()
        // Gm.taskNet.sendTaskList()
    },
    // 任务列表(请求返回)
    onTaskList:function(args){
        Gm.missionData.updateData(args)
        Gm.send(Events.MISSION_UPDATE)
        Gm.red.refreshEventState("mission")
    },
    onTaskReceive:function(args){
        Gm.missionData.receiveData(args)
        Gm.send(Events.MISSION_UPDATE)
        Gm.red.refreshEventState("mission")
        Gm.red.refreshEventState("dungeonActivity")
        for (var i = 0; i < args.taskList.length; i++) {
            if (args.taskList[i].rate == -1){
                Gm.activityData.showLimitGift()
                break
            }
        }
    },
    // 领取活跃度奖励返回
    onTaskActiveReceive:function(args){
        Gm.missionData.activeReceivedList.push(args.activeId)
        Gm.send(Events.MISSION_UPDATE)
        if (args.activeId){
            var tmpData = Gm.config.getDailyMis(args.activeId)
            Gm.receive(tmpData.reward)
        }
        Gm.red.refreshEventState("mission")
    },
    // 领取活跃度活动奖励返回
    onActiveActivityReceive:function(args){
        Gm.missionData.activeAtyDay = Gm.missionData.activeAtyDay + 1
        Gm.missionData.activeAtyTime2 = Gm.userData.getTime_m()
        Gm.send(Events.MISSION_UPDATE,true)
        Gm.red.refreshEventState("mission")
    },
});

