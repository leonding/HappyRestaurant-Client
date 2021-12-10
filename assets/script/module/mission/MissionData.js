const GET_LIST = [0,2,4,3,0,0,0,7]
cc.Class({
    properties: {
        taskList:null,// 任务列表
        activeReceivedList:null,// 活跃度已领取列表
        dailyClearTime:0,// 日常任务下次刷新时间
        weekClearTime:0,// 周常

        activeAtyOpen:false,// 活跃度活动 是否开启
        activeAtyTime1:0,// 活跃度活动 关闭或下次开启时间
        activeAtyDay:0,// 活跃度活动 已领取天数
        activeAtyTime2:0,// 上次领取时间(一天只能领取一次)
    },
    ctor:function(){
        this.clearData()
    },
    isActiveRece:function(destId){
        if (destId){
            for(const i in this.activeReceivedList){
                if (this.activeReceivedList[i] == destId){
                    return false
                }
            }
        }else{//日常活动
            if (this.activeAtyTime2 && Func.getDay(this.activeAtyTime2) == Func.getDay()){
                return false
            }
        }
        return true
    },
    getMisByType:function(destType){
        var tmpRet = []
        for(const i in this.taskList[GET_LIST[destType]]){
            tmpRet.push(this.taskList[GET_LIST[destType]][i])
        }
        return tmpRet
    },
    getMisByConfType:function(destType){
        var tmpRet = []
        for(const i in this.taskList[destType]){
            tmpRet.push(this.taskList[destType][i])
        }
        return tmpRet
    },
    clearData:function(){
        this.taskList = {}
        this.dailyClearTime = 0
        this.weekClearTime = 0
    },
    getMisByBalance:function(destType){
        var tmpRet = []
        for(const i in this.taskList){
            for(const j in this.taskList[i]){
                if (this.taskList[i][j].data.battleEndTips == destType && this.taskList[i][j].rate > -1){
                    tmpRet.push(this.taskList[i][j])
                }
            }
        }
        return tmpRet
    },
    updateData:function(args){
        // console.log("====:",Func.dateFtt("hh:mm:ss",new Date(args.activeAtyTime1)))
        for(const i in args.taskList){
            this.pushData(args.taskList[i])
        }
        this.activeReceivedList = args.activeReceivedList
        this.dailyClearTime = args.dailyClearTime
        this.weekClearTime = args.weekClearTime

        this.activeAtyOpen = args.activeAtyOpen
        this.activeAtyTime1 = args.activeAtyTime1
        this.activeAtyDay = args.activeAtyDay
        this.activeAtyTime2 = args.activeAtyTime2
    },
    pushData:function(item){
        var tmpIndex = -1
        var tmpConfig = Gm.config.getTaskById(item.id)
        if (tmpConfig){
            if (!this.taskList[tmpConfig.type]){
                this.taskList[tmpConfig.type] = []
            }
            for (let index = 0; index < this.taskList[tmpConfig.type].length; index++) {
                if (this.taskList[tmpConfig.type][index].data.id == item.id){
                    tmpIndex = index
                    break
                }
            }
            if (tmpIndex != -1){
                this.taskList[tmpConfig.type][tmpIndex].rate = item.rate
            }else{
                this.taskList[tmpConfig.type].push({rate:item.rate,data:tmpConfig})
            }
        }
    },
    receiveData:function(args){
        for(const i in args.taskList){
            var tmpIndex = -1
            var taskInfo = args.taskList[i]
            var tmpConfig = Gm.config.getTaskById(taskInfo.id)
            if (tmpConfig){
                if (!this.taskList[tmpConfig.type]){
                    this.taskList[tmpConfig.type] = []
                }
                for (let index = 0; index < this.taskList[tmpConfig.type].length; index++) {
                    if (this.taskList[tmpConfig.type][index].data.id == taskInfo.id){
                        this.taskList[tmpConfig.type][index].rate = taskInfo.rate
                        if (taskInfo.rate == -1){
                            if (tmpConfig.nextTask != 0){
                                this.taskList[tmpConfig.type].splice(index,1)
                            }
                        }
                        tmpIndex = index
                        break
                    }
                }
                if (tmpIndex == -1){
                    this.taskList[tmpConfig.type].push({rate:taskInfo.rate,data:tmpConfig})
                }
            }
        }
    },
    getDailyTime:function(type){
        var tmpTime = -1
        if (type == 0){
            if (this.dailyClearTime){
                tmpTime = Math.floor((this.dailyClearTime - Gm.userData.getTime_m())/1000)
            }
        }else{
            if (this.weekClearTime){
                tmpTime = Math.floor((this.weekClearTime - Gm.userData.getTime_m())/1000)
            }
        }
        return tmpTime
    },
});
