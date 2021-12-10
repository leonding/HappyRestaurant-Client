var CoreLogic = require("CoreLogic")
cc.Class({
    extends: CoreLogic,
    properties: {
        
    },
    ctor:function(){

    },
    register:function(){
        this.events[Events.LOGIN_SUC]        = this.onLoginSuc.bind(this)
        this.events[MSGCode.OP_TRAVEL_INFO_S] = this.onTravelInfoRet.bind(this)
        this.events[MSGCode.OP_TRAVEL_DAILY_REFRESH_S] = this.onTravelDailyRefreshRet.bind(this)
        this.events[MSGCode.OP_TRAVEL_TASK_REFRESH_S] = this.onTravelTaskRefreshRet.bind(this)
        this.events[MSGCode.OP_TRAVEL_TASK_START_S] = this.onTravelTaskStartRet.bind(this)
        this.events[MSGCode.OP_TRAVEL_TASK_DONE_S] = this.onTravelTaskDoneRet.bind(this)
        this.events[MSGCode.OP_TRAVEL_OPEN_S] = this.onTravelOpenRet.bind(this)
        this.events[MSGCode.OP_TRAVEL_AID_LIST_S] = this.onTravelAidList.bind(this)
        this.events[MSGCode.OP_TRAVEL_RECEIVE_S] = this.onTravelReceive.bind(this)
    },
    onLoginSuc:function(){
        Gm.travelData.clearData()
    },
    onTravelInfoRet:function(args){
        Gm.travelData.setData(args)
        if (this.view && this.view.node.active){
            this.view.updateList()
        }
        Gm.red.refreshEventState("travel")
    },
    onTravelDailyRefreshRet:function(args){
        Gm.travelData.refreshDailyTime = args.refreshDailyTime
        Gm.travelData.refreshTaskCount1 = args.refreshTaskCount1
        Gm.travelData.travelTaskCount1 = args.travelTaskCount1
        Gm.travelData.refreshTaskCount2 = args.refreshTaskCount2
        Gm.travelData.travelTaskCount2 = args.travelTaskCount2
        if (this.view && this.view.node.active){
            this.view.updateList()
        }
    },
    onTravelTaskRefreshRet:function(args){
        if (args.type != 1){
            if (args.team){
                Gm.travelData.refreshTaskCount2 = Gm.travelData.refreshTaskCount2 + 1
            }else{
                Gm.travelData.refreshTaskCount1 = Gm.travelData.refreshTaskCount1 + 1
            }
        }
        Gm.travelData.refreshTaskTime = args.refreshTaskTime
        Gm.travelData.setTaskList(args.taskList)

        if (this.view && this.view.node.active){
            this.view.updateList()
        }
        if (Gm.ui.getLayerActive("TravelUsed")){
            Gm.floating(Ls.get(600019))
            Gm.ui.removeByName("TravelUsed")
        }
    },
    onTravelTaskStartRet:function(args){
        Gm.ui.removeByName("TravelOneKey")
        for(const i in args.info){
            var tmpConfig = Gm.config.getTravelById(args.info[i].taskId)
            if (tmpConfig.type == 1){
                Gm.travelData.travelTaskCount1 = args.travelTaskCount
            }else{
                Gm.travelData.travelTaskCount2 = args.travelTaskCount
            }
        }
        Gm.travelData.setTaskList(args.info)
        if (this.view && this.view.node.active){
            this.view.updateList(true)
        }
    },
    onTravelTaskDoneRet:function(args){
        Gm.travelData.setTaskFinish([args.index])
        if (this.view && this.view.node.active){
            this.view.updateList()
        }
        Gm.red.refreshEventState("travel")
    },
    onTravelOpenRet:function(args){
        if (this.view && this.view.node.active){
            this.view.updateList()
        }
        Gm.red.refreshEventState("travel")
    },
    onTravelAidList:function(args){
        Gm.travelData.setAidList(args.list)
        if (Gm.travelNet.openData.type){
            Gm.ui.create("TravelOneKey",Gm.travelNet.openData)
        }else{
            Gm.ui.create("TravelListView",Gm.travelNet.openData)
        }
    },
    onTravelReceive:function(args){
        Gm.travelData.setTaskList([],args.index)
        if (this.view && this.view.node.active){
            this.view.updateList()
        }
        Gm.red.refreshEventState("travel")
    },
});

