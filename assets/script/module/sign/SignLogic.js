var CoreLogic = require("CoreLogic")
cc.Class({
    extends: CoreLogic,
    properties: {
        
    },
    ctor:function(){

    },
    timeStart:function(){
        this.clearTime()
        this.interval = setInterval(function(){
            this.updateTime()
        }.bind(this),1000)
    },
    updateTime(){
        var isSend = false
        for (let index = 0; index < Gm.signData.eventInfo.length; index++) {
            const v = Gm.signData.eventInfo[index];
            var nowDay = Math.ceil(Func.translateTime1(v.starTime)/24/60/60)
            if (nowDay != v.signDay){
                v.signDay = nowDay
                isSend = true
            }
        }
        if (isSend){
            Gm.send(Events.WEEK_SIGN_DAY_UPDATE)
            this.refreshWeekSignRed()
        }
        
    },
    clearTime(){
        if (this.interval != null){
            clearInterval(this.interval)
            this.interval = null
        }
    },
    register:function(){
        this.events[Events.SOCKET_CLOSE]        = this.onSocketClose.bind(this)
        this.events[MSGCode.OP_SIGN_INFO_S] = this.onNetSignInfo.bind(this)
        this.events[MSGCode.OP_SIGN_DAY_S] = this.onNetSignDay.bind(this)
        this.events[MSGCode.OP_SIGN_COUNT_S] = this.onNetSignCount.bind(this)

        this.events[MSGCode.OP_SYNC_WEEK_SIGN_INFO_S] = this.onNetWeekSignInfo.bind(this)
        this.events[MSGCode.OP_RECEIVE_WSREWARD_S] = this.onNetWeekSignReward.bind(this)
        this.events[MSGCode.OP_ONLINE_REWARD_S] = this.onNetOnlineReward.bind(this)
    },

    onSocketClose:function(args){
        Gm.signData.clearData()
        this.clearTime()
    },
    onNetSignInfo:function(args){
        Gm.signData.setData(args)
        Gm.red.refreshEventState("sign")
        if (this.isView()){
            this.view.updateData()
            this.view.onSignItemClick()
        }
    },
    onNetSignDay:function(args){
        Gm.signData.monthData.rewards = Gm.signData.monthData.rewards + 1
        if (this.isView()){
            this.view.updateData()
            this.view.onSignItemClick()
        }
        Gm.red.refreshEventState("sign")
    },
    onNetSignCount:function(args){
        Gm.signData.monthData.countList.push(args.countId)
        if(this.isView()){
            this.view.updateData()
        }
        Gm.red.refreshEventState("sign")
    },
    onNetWeekSignInfo:function(args){
        Gm.signData.setEventInfo(args.eventInfo)
        this.refreshWeekSignRed()
        this.timeStart()
    },
    onNetWeekSignReward:function(args){
        if (args.eventId == null){
            return
        }
        if (args.wsInfo){
            for (let index = 0; index < args.wsInfo.length; index++) {
                Gm.signData.pushSignItem(args.eventId,args.wsInfo[index])
            }
        }
        if (args.taskId){
            Gm.signData.pushReceiveTaskId(args.eventId,args.taskId)
        }
        this.refreshWeekSignRed()
    },
    refreshWeekSignRed(){
        Gm.red.refreshEventState("eventGroup")
    },
    onNetOnlineReward(args){
        Gm.signData.setOnline(args)
    },
});
