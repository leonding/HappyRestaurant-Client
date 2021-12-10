// OreData
cc.Class({
    properties: {
        
    },
    ctor:function(){
        this.clearData()
    },
    clearData(){
        this.oreRoomInfo = [] //所有的房间 房间中添加矿的数组ID
        this.oreInfo = []//矿信息  使用Id = data的形式
        this.myOreId = null //自己占领的水晶ID
    },
    setRoomListInfo(roomList){
        this.clearData()
        for(var i=0;i<roomList.length;i++){
            var data = {}
            data.index = roomList[i].index
            data.type = roomList[i].type
            data.oreList = []
            for(var j=0;j<roomList[i].oreList.length;j++){
                data.oreList.push(roomList[i].oreList[j].id)
                roomList[i].oreList[j].index = data.index
                this.oreInfo[roomList[i].oreList[j].id] = roomList[i].oreList[j]

                if(roomList[i].oreList[j].info && roomList[i].oreList[j].info.playerId == Gm.userInfo.id){
                    this.myOreId =  roomList[i].oreList[j].id
                }
            }
            this.oreRoomInfo[roomList[i].index] = data
        }
    },

    setLastBattleTime(time){
        this.lastBattleTime = time
    },
    setBattleCount(count){
        this.battleCount = count
    },
    reduceBattleCount(){
        if(this.battleCount>=1){
            this.battleCount = this.battleCount - 1
        }
    },
    getRoomListInfo(){
        return this.oreRoomInfo
    },
    getRoomListInfoByType(type){
        var data = this.getRoomListInfo()
        var temp = []
        for(var i in data){
            if(data[i].type == type){
                temp.push(data[i])
            }
        }
        return temp
    },
    addRoomTypeIndex(){//根据类型的
        var config = Gm.config.getConfig("OreRoomConfig")
        for(var i=0;i<config.length;i++){
            var data = this.getRoomListInfoByType(config[i].type)
            for(var j=0;j<data.length;j++){
                data[j].roomIndex = j+1
            }
        }
    },
    getOreById(id){
        return this.oreInfo[id]
    },
    setOreData(data){
        data.index = this.oreInfo[data.id].index
        data.roomIndex = this.oreInfo[data.id].roomIndex
        this.oreInfo[data.id] = data
    },
    getBattleCount(){
        var count = this.battleCount
        var battleCardNum = Gm.bagData.getNum(OreFunc.getOreBattleCardId())
        return count + battleCardNum
    },
    setBattleBuyCount(num){
        this.battleByCount = num
    },
    addBattleBuyCount(){
        this.battleByCount  = this.battleByCount  + Gm.oreNet.buyCount
        Gm.oreNet.buyCount = null
    },
    getBattleBuyCount(){
        return this.battleByCount || 0
    },
    getBuyMaxNum(){
         var num = Gm.config.getConst("ore_battle_buy_limit")
        return num - this.getBattleBuyCount()
    },
    isCanBuyBattleCount(){
        var num = Gm.config.getConst("ore_battle_buy_limit")
        return this.getBattleBuyCount() < num
    },
    //获取进入的房间的信息
    getEnterRoomData(){
        if(!this.myOreId){
            var index = null
            for(var i in  this.oreInfo){
                if(this.oreInfo[i].info && this.oreInfo[i].info.playerId == Gm.userInfo.id){
                    index = this.oreInfo[i].index
                    this.myOreId = this.oreInfo[i].id
                    break
                }
            }
            if(index != null){
                return this.oreRoomInfo[index]
            }
            return this.oreRoomInfo[0]
        }
        else{
            var oreData = this.getOreById(this.myOreId)
            return this.oreRoomInfo[oreData.index]
        }
    },
    setMyOreId(id){
        this.myOreId = id
    },
    getMyOreId(){
        return this.myOreId
    },
    getMyRoomIndex(){
        if(this.myOreId){
            return this.getOreById(this.myOreId).index
        }
        return null
    },
    getEnterRoomDataByIndex(index){
        return this.oreRoomInfo[index]
    },
    getSearchEnterRoomData(fight){
        var type = OreFunc.getMappingType(fight)
        var roomData = this.getRoomListInfoByType(type)
        for(var i=0;i<roomData.length;i++){
            if(!this.roomisFull(roomData[i])){
                return roomData[i]
            }
        }
        return roomData[0]
    },
    getRoomListCount(){
        return this.oreRoomInfo.length
    },
    getMonstersById(id){
        var data = this.oreInfo[id]
        var temp = []
        if(data){
            if(data.startTime != 0 && data.heros){
                temp = [0,0,0,0,0,0]
                for(var i=0;i<data.heros.length;i++){
                    if(data.heros[i].baseId !=0){
                        temp[data.heros[i].position-1] = data.heros[i]
                    }
                }
            }
            else{
                for(var i=0;i<data.monsters.length;i++){
                    var monster =Gm.config.getMonster(data.monsters[i])
                    monster.isMonster = true
                    monster.baseId = data.monsters[i]
                    temp.push(monster)
                }
            }
        }
        return temp
    },
    //获取我的工会成员占领数目
    getUnionNum(roomData){
        var num = 0
        for(var i=0;i<roomData.oreList.length;i++){
            var oreData = Gm.oreData.getOreById(roomData.oreList[i])
            if(Gm.unionData.info && Gm.oreData.isEqAllianceId(oreData,Gm.unionData.info.allianceId)){
                num = num + 1
            }
        }
        return num
    },

    //获取战斗奖励列表
    getBattleLogRewardData(){
        var data = [{},{},{},{},{},{}]
        return data
    },
    //获取战斗日志列表
    setBattleLogData(data){
        this.battleLogData = data
        this.battleLogData.logs.sort(function(a,b){
            return  b.time -  a.time
        })
    },
    getBattleLogData(){
        return this.battleLogData
    },
    getBattleLogDataById(id){
        var data = this.getBattleLogData()
        if(data){
            for(var i=0;i<data.lenght;i++){
                if(data[i].logs.id == id){
                    return data[i]
                }
            }
        }
        return null
    },
    //秘境预览
    getAllOreRoom(){
        var data = this.getRoomListInfo()
        return data
    },
    getOreRoomByType(type,notfull){
        var data = this.getRoomListInfo()
        var tempData = []
        if(notfull){//没有满的
            for(var i in data){
                if(data[i].type == type && !this.roomisFull(data[i])){
                    tempData.push(data[i])
                }
            }
        }
        else{
            for(var i in data){
                if(data[i].type == type){
                    tempData.push(data[i])
                }
            }        
        }
        return tempData
    },
    roomisFull(data){
        var key = true
        for(var i=0;i<data.oreList.length;i++){
            var id = data.oreList[i]
            var oreData = this.getOreById(id)
            if(oreData.startTime == 0){
                key = false
                break
            }
        }
        return key
    },
    isEqAllianceId(data,allianceId){
        return (data.info && data.info.allianceId == allianceId)
    },
    //占领的水晶数目
    getRoomPlayerNum(data){
        var key = 0
        for(var i=0;i<data.oreList.length;i++){
            var oreData = this.getOreById(data.oreList[i])
            if(oreData.startTime != 0){
                key = key + 1
            }
        }
        return key
    },
    //被自己同盟成员占领的水晶数目
    getRoomPlayerNumUnion(data,unionId){
         var key = 0
        for(var i=0;i<data.oreList.length;i++){
            var oreData = this.getOreById(data.oreList[i])
            if(oreData.startTime != 0 && this.isEqAllianceId(oreData,unionId)){
                key = key + 1
            }
        }
        return key
    },

    getUnionOreData(allianceId){
        var data =  this.getRoomListInfo()
        var tempData = []
        for(var i in data){
            var unionNum = 0;
            var totalNum = 0
            for(var j=0;j<data[i].oreList.length;j++){
                var oreData = this.getOreById(data[i].oreList[j])
                if(oreData.startTime != 0 ){
                    totalNum = totalNum + 1
                    if(this.isEqAllianceId(oreData,allianceId)){
                        unionNum = unionNum + 1
                    }
                }
            }
            if(unionNum>=1){
                var unionData = {}
                unionData.type =  data[i].type
                unionData.index = data[i].index
                unionData.unionName = Gm.unionData.info.name
                unionData.currentNum = totalNum
                unionData.unionNum = unionNum
                unionData.roomIndex = data[i].roomIndex
                unionData.roomData = data[i]
                tempData.push(unionData)
            }
        }
        return tempData
    },
    setOreRankData(data){
        this.oreRankInfo = data
        //添加自己的排名
        if(this.oreRankInfo.rankList.length>0){
            if(data.score < this.oreRankInfo.rankList[this.oreRankInfo.rankList.length -1].score){
                data.rank = null
            }
            else{
                for(var i=0;i<this.oreRankInfo.rankList.length;i++){
                    if(this.oreRankInfo.rankList[i].info.playerId ==Gm.userInfo.id){
                        data.rank = i+1
                        data.info = this.oreRankInfo.rankList[i].info
                        break;
                    }
                }
            }
        }
        if(data.rank == null){
            data.info = Gm.userInfo
            data.info.serverId  = Gm.loginData.getServerNowId()
        }
    },
    getOreRankData(){
        return this.oreRankInfo
    },
    showRed(){
        if(!OreFunc.oreIsOpen()){
            return false
        }
        if(!Func.isUnlock("OreMainView",false)){
            return false
        }   
        return this.checkOreRedNeedShow()
    },
    setCheckRedTime(){
        var time = new Date(new Date().toLocaleDateString()).getTime()
        var key = Gm.userInfo.id + "OreRedShowKey"
        cc.sys.localStorage.setItem(key,time)
    },
    checkOreRedNeedShow(){
        var time = new Date(new Date().toLocaleDateString()).getTime()
        var key = Gm.userInfo.id + "OreRedShowKey"
        var timepre =  parseInt(cc.sys.localStorage.getItem(key) || "0")
        if(time == timepre){
            return false
        }
        else{
            return true
        }
    },
    hasReward(){
        var data = this.getBattleLogData()
        if(data && data.receives){
            for(var i=0;i<data.receives.length;i++){
                if(data.receives[i].gold >0){
                    return true
                }
            }
        }
        return false
    },
    getMyGoldSpeed(data){
        if(this.myOreId){
            var oreData = this.getOreById(this.myOreId)
            var roomData = Gm.oreData.getEnterRoomDataByIndex(oreData.index)
            var num = 1
            if(data.info && data.info.allianceId){
                num = Gm.oreData.getRoomPlayerNumUnion(roomData,data.info.allianceId)
            }
            var percent = 1
            if(num>1){
                percent =  1+ Gm.config.getOreBuffConfig(num).buff / 10000
            }
            var config = Gm.config.getOreConfigById(oreData.oreId)
            return Math.floor(oreData.perGold * percent)
        }
    },
    getMyOreSpeed(data){
         if(this.myOreId){
            var oreData = this.getOreById(this.myOreId)
            var roomData = Gm.oreData.getEnterRoomDataByIndex(oreData.index)
            var num = 1
            if(data.info && data.info.allianceId){
                num = Gm.oreData.getRoomPlayerNumUnion(roomData,data.info.allianceId)
            }
            var percent = 1
            if(num>1){
                percent =  1+ Gm.config.getOreBuffConfig(num).buff / 10000
            }
            var config = Gm.config.getOreConfigById(oreData.oreId)
            return Math.floor(oreData.perScore * percent)
        }
    },
    isInLine(heroId){
        if(OreFunc.oreIsOpen()){
            if(Gm.oreData.myHeros){
                for(var i=0;i<Gm.oreData.myHeros.length;i++){
                    if(Gm.oreData.myHeros[i].heroId == heroId){
                        return true
                    } 
                }
            }
        }
        return false
    },
});
