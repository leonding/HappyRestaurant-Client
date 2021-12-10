const type_list = {
    1000:["tuneIntimacy",1],
    2000:["tuneLevel",1],
    3000:["awakenStage",1],
    4000:["trainLevel",1],
    5000:["baseId",0],
}
cc.Class({
    properties: {
        taskList:null,// 任务列表
        refreshDailyTime:0,// 日常刷新时间
        refreshTaskTime:0,// 自动刷新任务时间

        travelTaskCount1:0,// 游历任务次数
        refreshTaskCount1:0,// 手动刷新任务次数
        travelTaskCount2:0,// 游历任务次数
        refreshTaskCount2:0,// 手动刷新任务次数
        m_tAidList:[],
    },
    ctor:function(){
        this.clearData()
    },
    clearData:function(){
        this.taskList = {}
        this.m_tAidList = []
    },
    getListHero:function(destType,destTime,condition){
        var tmpReturn = []
        var tmpLine = Gm.heroData.getAll()
        var cheackOne = function(heroData){
            var tmpCan = true
            for(const i in condition){
                var tmpNed = condition[i].type
                var tmpVal = condition[i].condition
                var tmpIdx = type_list[tmpNed][0]
                if(type_list[tmpNed][1]){
                    if (heroData[tmpIdx] < tmpVal){
                        tmpCan = false
                        break
                    }
                }else{
                    var tmpConfig = Gm.config.getHero(heroData[tmpIdx])
                    if (tmpConfig && tmpConfig.idGroup == tmpVal){
                    }else{
                        tmpCan = false
                        break
                    }
                }
            }
            if (tmpCan){
                tmpReturn.push(heroData)
            }
        }
        for(const i in tmpLine){
            cheackOne(tmpLine[i])
        }
        // console.log("tmpLine==:",destType,tmpReturn)
        return tmpReturn.sort(function(a,b){
                var ta = this.cheackHero(a.heroId)
                if (ta < 0){
                    return 1
                }
                var tb = this.cheackHero(b.heroId)
                if (tb < 0){
                    return -1
                }
                if (a.ownerName){
                    return -1
                }
                if (b.ownerName){
                    return 1
                }
                return a.heroId - b.heroId
            }.bind(this))
    },
    getHero:function(destId){
        var selfHero = Gm.heroData.getHeroById(destId)
        if (!selfHero){
            // for(const i in this.captureList){
            //     if (this.captureList[i].heroId == destId){
            //         selfHero = this.captureList[i]
            //         break
            //     }
            // }
        }
        return selfHero
    },
    cheackHero:function(destId,destType){
        var tmpType = destType || 0
        var tmpCheck = function(list){
            for(const o in list){
                const hero = list[o]
                if (hero == destId){
                    return true
                }
            }
            return false
        }
        var list = this.taskList[tmpType]
        var lostTime = checkint(Gm.config.getConst("travel_finish_save_time"))
        for(const i in list){
            if (list[i].startTime){
                var pass = Math.floor((Gm.userData.getTime_m() - list[i].startTime)/1000 )
                var time = list[i].config.time - pass
                if (time <= 0 || list[i].finishTime){
                    var tmpTime = Gm.userData.getTime_m()
                    if (list[i].finishTime){
                        tmpTime = lostTime - Math.floor((tmpTime - list[i].finishTime)/1000)
                    }else{
                        tmpTime = Math.floor((tmpTime - list[i].startTime)/1000)
                        tmpTime = lostTime - (tmpTime - list[i].config.time)
                    }
                    if (tmpTime < 0 && tmpCheck(list[i].heroList)){
                        return -1
                    }
                }else if(tmpCheck(list[i].heroList)){
                    return -1
                }
            }
        }
        return 1
    },
    setTaskFinish:function(indexs){
        for(const i in indexs){
            for(const o in this.taskList){
                for(const j in this.taskList[o]){
                    if (this.taskList[o][j].index == indexs[i]){
                        this.taskList[o][j].finishTime = Gm.userData.getTime_m()
                        break
                    }
                }
            }
        }
    },
    setTaskList:function(list,remove){
        for(const i in list){
            var tmpConfig = Gm.config.getTravelById(list[i].taskId)
            if (tmpConfig){
                var tmpType = tmpConfig.type
                if (!this.taskList[tmpType]){
                    this.taskList[tmpType] = []
                }
                list[i].config = tmpConfig
                var tmpHas = -1
                for(const j in this.taskList[tmpType]){
                    if (this.taskList[tmpType][j].index == list[i].index){
                        tmpHas = j
                        break
                    }
                }
                if (tmpHas == -1){
                    this.taskList[tmpType].push(list[i])
                }else{
                    this.taskList[tmpType][tmpHas] = list[i]
                }
            }
        }
        if (remove){
            for(const i in remove){
                var tmpHas1 = -1
                var tmpHas2 = -1
                for(const o in this.taskList){
                    for(const j in this.taskList[o]){
                        if (this.taskList[o][j].index == remove[i]){
                            tmpHas2 = j
                            tmpHas1 = o
                            break
                        }
                    }
                }
                if (tmpHas1 != -1 && tmpHas2 != -1){
                    this.taskList[tmpHas1].splice(tmpHas2,1)
                }
            }
        }
        for(const i in this.taskList){
            this.taskList[i] = this.sortData(i)
        }
    },
    setData:function(args){
        if (args.taskList){
            this.setTaskList(args.taskList)
        }

        this.refreshDailyTime = args.refreshDailyTime
        this.refreshTaskTime = args.refreshTaskTime
        this.refreshTaskCount1 = args.refreshTaskCount1
        this.travelTaskCount1 = args.travelTaskCount1
        this.refreshTaskCount2 = args.refreshTaskCount2
        this.travelTaskCount2 = args.travelTaskCount2
    },
    getDailyTime:function(){
        if (this.refreshDailyTime){
            var time = this.refreshDailyTime - Gm.userData.getTime_m()
            return Math.floor(time/1000 )
        }else{
            return -1
        }
    },
    getTaskTime:function(){
        if (this.refreshTaskTime){
            var time = this.refreshTaskTime - Gm.userData.getTime_m()
            return Math.floor(time/1000 )
        }else{
            return -1
        }
    },
    getData:function(type){
        return this.taskList[type] || []
    },
    sortData:function(type){
        if (this.taskList[type]){
            return this.taskList[type].sort(function(a,b){
                if (a.startTime == b.startTime){
                    return a.config.star - b.config.star
                }else{
                    return a.startTime - b.startTime
                }
            })
        }else{
            return []
        }
    },
    getArrestedList:function(){
        return []
    },

    getLineLimit:function(heros){
        if (heros){
        }
        return heros
    },
    setAidList:function(args){
        this.m_tAidList = args
    },
});
