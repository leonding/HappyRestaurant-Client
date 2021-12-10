cc.Class({
    properties: {
       
    },
    ctor:function(){
        this.clearData()
    },
    clearData:function(){
        this.monthData = null
        this.eventInfo = null
        this.onlineData = {receiveTime:0}
    },
    setOnline(data){
        this.onlineData = data
    },
    setData(data){
        this.monthData = data
    },
    getNowDay(){
        var num = 0
        if (this.monthData == null){
            return num
        }
        return Math.min(this.monthData.days,30)
    },
    checkSign(day){
        return day <= this.getHasDay()
    },
    getHasDay(){
        var num = 0
        if (this.monthData == null){
            return num
        }
        return this.monthData.rewards
    },
    getHasCountId(id){
        if(this.monthData){
            for (let index = 0; index < this.monthData.countList.length; index++) {
                const v = this.monthData.countList[index];
                if(v== id){
                    return true
                }
            }
        }
        return false
    },
    setEventInfo(list){
        this.eventInfo = list

        for (let index = 0; index < this.eventInfo.length; index++) {
            const v = this.eventInfo[index];
            v.endTime = Gm.userData.getTime_m() + v.remainTime
            v.starTime = v.endTime - Gm.config.getEventGroup(v.eventId).eventTime*1000
            v.signDay = Math.ceil(Func.translateTime1(v.starTime)/24/60/60)
        }
    },
    getEventInfoById(id){
        return Func.forBy(this.eventInfo,"eventId",id)
    },
    getEventEndTime(){
        if(this.eventInfo && this.eventInfo.length > 0){
            for (let index = 0; index < this.eventInfo.length; index++) {
                const v = this.eventInfo[index];
                var time = Func.translateTime(v.endTime,true)
                if (time > 0){
                    return time
                }
            }
        }
        if (this.weekSign){
            return Func.translateTime(this.weekSign.endTime,true)
        }
        return 0
    },
    getReceiveTaskId(eventId,taskId){
        var evnetData = this.getEventInfoById(eventId)
        if (evnetData){
            for (let index = 0; index < evnetData.receiveTaskId.length; index++) {
                const v = evnetData.receiveTaskId[index];
                if (v == taskId){
                    return true
                }
            }
        }
        
        return false
    },
    getRateByTaskType(eventId,taskType){
        var evnetData = this.getEventInfoById(eventId)
        if (evnetData){
            for (let index = 0; index < evnetData.wsInfo.length; index++) {
                const v = evnetData.wsInfo[index];
                if (v.taskType == taskType){
                    return v.rate
                }
            }
        }
        return 0
    },
    pushSignItem(eventId,ws){
        var evnetData = this.getEventInfoById(eventId)
        for (let index = 0; index < evnetData.wsInfo.length; index++) {
            const v = evnetData.wsInfo[index];
            if (v.taskType == ws.taskType){
                v.rate = ws.rate
                return
            }
        }
        evnetData.wsInfo.push(ws)
    },
    pushReceiveTaskId(eventId,taskId){
        var evnetData = this.getEventInfoById(eventId)
        evnetData.receiveTaskId.push(taskId)
    },
    wsReceiveBoxId(id){
        for (let index = 0; index < this.weekSign.receiveBoxId.length; index++) {
            const v = this.weekSign.receiveBoxId[index];
            if(v== id){
                return true
            }
        }
        return false
    },
    
});
