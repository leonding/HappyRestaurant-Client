const USED_ITEM = 200117
cc.Class({
    properties: {
    	arenaList:null,
        recordList:null,
        rankList:null,
        battleList:null,
        mainRanks:null
    },
    ctor:function(){
        this.clearData()
    },
    clearData:function(){
        this.arenaList = []
        this.recordList = []
        this.rankList = []
        this.battleList = []
        this.mainRanks = {}
    },
    pushBattle:function(recordId,args){
        if (recordId){
            if (!this.battleList[recordId]){
                // var tmpWinLose = 0
                // for(const i in this.recordList){
                //     let data = this.recordList[i]
                //     if (data.recordId == recordId){
                //         if (data.attackId == Gm.userInfo.id){
                //             tmpWinLose = data.fightResult
                //         }else{
                //             tmpWinLose = 1 - data.fightResult
                //         }
                //     }
                // }
                // args.battleInfo[0].fightResult = tmpWinLose
                this.battleList[recordId] = args
                this.battleList[recordId].isRecord = true
            }
        }
    },
    getBattle:function(recordId){
        this.setLocalBalance()
        this.setLocalPerson()
        return this.battleList[recordId]
    },
    setData:function(args){
    	this.myRank = args.myRank
        this.arenaPoint = args.arenaPoint
    	this.nextRefreshTime = args.nextRefreshTime
    	this.hasBuyFightCount = args.hasBuyFightCount
        this.freeCount = args.freeCount
        this.seasonRemain = args.seasonRemain
        this.getTime = Gm.userData.getTime_m()
        this.interval = args.interval
    	this.setFightData(args.arenaFightInfo)
    },
    setFightData:function(args){
        this.arenaList = []
    	for(const i in args){
			this.arenaList.push(args[i])
    	}
    },
    setRecordData:function(args){
        this.recordList = []
        for(const i in args){
            this.recordList.push(args[i])
        }
    },
    setRankData:function(args){
        this.rankList = []
        for(const i in args){
            this.rankList.push(args[i])
        }
    },
    getFightNums:function(){
    	return this.freeCount || 0
    },
    getListData:function(destType){
        if (destType == 0){
            return this.arenaList
        }else{
            return this.rankList
        }
    },
    getSurplusTime:function(){
        if (this.nextRefreshTime){
            var time = this.nextRefreshTime - Gm.userData.getTime_m()
            return Math.floor(time/1000 )
        }else{
            return -1
        }
    },
    getMainRankByType:function(type){
        return this.mainRanks[checkint(type)]
    },
    setMainRank:function(args){
        this.mainRanks[checkint(args.type)] = args
    },
    getUsedItem:function(){
        return USED_ITEM
    },
    setLocalBalance:function(destScore){
        this.m_iOwnScore = destScore
    },
    setLocalPerson:function(isRobot,targetId){
        // console.log("setLocalPerson===:",isRobot,targetId)
        this.m_bIsRobot = isRobot
        if (targetId){
            for(const i in this.arenaList){
                // console.log("this.arenaList[i].playerId==:",this.arenaList[i].playerId)
                if (this.arenaList[i].playerId == targetId){
                    this.m_oOwnPerson = Func.copyArr(this.arenaList[i])
                    break
                }
            }
            if (!this.m_oOwnPerson){
                for(const i in this.recordList){
                    if (this.recordList[i].attackId == targetId){
                        this.m_oOwnPerson = {
                            level:this.recordList[i].attackRank,
                            name:this.recordList[i].attackName,
                            head:this.recordList[i].attackHead,
                            type:this.recordList[i].isRobot?3:1,
                        }
                        break
                    }
                    if (this.recordList[i].defendId == targetId){
                        this.m_oOwnPerson = {
                            level:this.recordList[i].defendRank,
                            name:this.recordList[i].defendName,
                            head:this.recordList[i].defendHead,
                            type:this.recordList[i].isRobot?3:1,
                        }
                        break
                    }
                }
            }
        }else{
            this.m_oOwnPerson = null
        }
    },
});
