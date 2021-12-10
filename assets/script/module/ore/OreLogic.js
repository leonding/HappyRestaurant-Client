// OreLogic
var CoreLogic = require("CoreLogic")
cc.Class({
    extends: CoreLogic,
    properties: {
        
    },
    ctor:function(){
        
    },
    register:function(){
        //登录成功
        // this.events[Events.LOGIN_SUC]                                            = this.onLogicSuss.bind(this)
        //水晶秘境列表返回
        this.events[MSGCode.OP_ORE_ROOM_LIST_S]                   = this.onRoomListInfo.bind(this)
        //水晶秘境战斗返回
        this.events[MSGCode.OP_ORE_BATTLE_S]                          = this.onBattle.bind(this)
        //水晶秘境占领提示
        this.events[MSGCode.OP_ORE_OCCUPIED_S]                     = this.onOccupied.bind(this)
        //水晶秘境领取奖励返回
        this.events[MSGCode.OP_ORE_RECEIVE_S]                         = this.onReceive.bind(this)
        //水晶秘境战斗日志返回
        this.events[MSGCode.OP_ORE_BATTLE_LOG_S]                  = this.onBatleLog.bind(this)
        //水晶秘境战斗日志数据返回
        this.events[MSGCode.OP_ORE_BATTLE_LOG_DATA_S]       = this.onBattleLogData.bind(this)
        //水晶秘境排行榜返回
        this.events[MSGCode.OP_ORE_RANK_S]                             = this.onRank.bind(this)
        //水晶秘境防守阵容
        this.events[MSGCode.OP_ORE_DEFENDER_S]                     = this.onDefender.bind(this)
        //水晶秘境房间信息返回
        this.events[MSGCode.OP_ORE_ROOM_S]                           = this.onOreRoomInfo.bind(this)
        //水晶秘境购买券
        this.events[MSGCode.OP_ORE_BUY_COUNT_S]                  = this.onOreBuyRet.bind(this)
    },
    // onLogicSuss:function(){
    //     Gm.oreNet.sendOreDeffender(0)
    // },
    onRoomListInfo:function(data){
        if(data){
            Gm.oreData.setRoomListInfo(data.roomList)
            Gm.oreData.setLastBattleTime(data.lastBattleTime)
            Gm.oreData.setBattleCount(data.battleCount)
            Gm.oreData.addRoomTypeIndex()
            Gm.oreData.setBattleBuyCount(data.battleBuyCount || 0)
        }
        this.openOreMainView()
    },
    getOreData(tdata){
        var oreData = Gm.oreData.getOreById(tdata.id)
        var config = Gm.config.getOreConfigById(oreData.oreId)
        var roomData = Gm.oreData.getEnterRoomDataByIndex(oreData.index)
        var data = {}
        data.titleName = config.name + roomData.roomIndex
        if(oreData.info){
            data.head = oreData.info.head
        }
        data.scores = []
        data.scores[0] = {num:oreData.perScore}
        data.scores[1] = {num:oreData.perGold}
        if(tdata.battleInfo.fightResult == 1){
            var num1 = 0
            var num2 = 0
            if(Gm.oreData.myOreId){
                var tOreData = Gm.oreData.getOreById(Gm.oreData.myOreId)
                num1 = oreData.perScore - tOreData.perScore
                num2 = oreData.perGold - tOreData.perGold
            }
            else{
                num1 = oreData.perScore
                num2 = oreData.perGold
            }
            data.scores[0].add = num1
            data.scores[1].add = num2
        }else{
            data.scores[0].add = 0
            data.scores[1].add = 0
        }
        return data
    },
    onBattle:function(data){
        if(data){
            //显示战斗界面
            data.battleInfo.oreData = this.getOreData(data)
            Gm.ui.create("BattleLoadView",{battleInfo:[data.battleInfo],isRecord:true})
            var oreData = Gm.oreData.getOreById(data.id)
            if(oreData.info){
                Gm.oreData.reduceBattleCount()
            }
            if(data.battleInfo.fightResult == 1){
                // 战斗胜利更新防守阵容
                var tHeros = []
                for(var i=0;i<data.battleInfo.battleData.roleInfo.length;i++){
                    if(data.battleInfo.battleData.roleInfo[i].pos >0){
                        data.battleInfo.battleData.roleInfo[i].position = data.battleInfo.battleData.roleInfo[i].pos
                        data.battleInfo.battleData.roleInfo[i].heroId = data.battleInfo.battleData.roleInfo[i].id
                        tHeros.push(data.battleInfo.battleData.roleInfo[i])
                    }
                }
                Gm.oreData.myHeros = tHeros
                var fightValue = null
                if(Gm.oreData.myOreId){
                    var tOreData = Gm.oreData.getOreById(Gm.oreData.myOreId)
                    fightValue = tOreData.info.fightValue
                    tOreData.info = null
                    tOreData.startTime = 0
                    tOreData.allianceId = null
                }
                var oreData = Gm.oreData.getOreById(data.id)
                oreData.info = Gm.userInfo
                oreData.info.serverId = Gm.loginData.getServerNowId()
                if(Gm.unionData.info){
                    oreData.info.allianceId = Gm.unionData.info.allianceId
                }
                oreData.startTime = data.startTime
                Gm.oreData.myOreId = data.id
                if(fightValue){
                    oreData.info.fightValue = fightValue
                }
                else{//取战斗的
                    var tdata = Gm.heroData.getLineByType(ConstPb.lineHero.LINE_ORE)
                    var fight =0
                    for(var i=0;i<tdata.hero.length;i++){
                        if(tdata.hero[i]){
                            var h = Gm.heroData.getHeroById(tdata.hero[i])
                            fight = fight + h.fight
                        }
                    }
                    oreData.info.fightValue = fight
                }
                //更新界面
                Gm.send(Events.UPDATE_ORE_INFO,data)
            }
            //更新挑战次数
            Gm.send(Events.ORE_UP_BAT_COUNT)
        }
    },
    onOccupied:function(data){
        if(data){
            var oreData = Gm.oreData.getOreById(data.id)
            if(oreData){
                oreData.startTime = Gm.userData.getTime_m()
                 //更新房间信息
                Gm.oreNet.sendOreRoomInfo(oreData.index)
                Gm.oreData.myOreId = null
            }

            if(Gm.ui.isExist("OreMainView")){//存在直接弹出
                var msg = cc.js.formatStr(Ls.get(7500041), data.name)
                var callback = function(btnType){
                    if(btnType == 1){
                        Gm.send(Events.ORE_ENTER_ROOM,oreData)
                    }
                } 
                Gm.box({msg:msg},callback)
            }
            else{//标记需要弹出
                this.occupiedData = data
                var date = new Date()
                this.occupiedDay = date.getDay()
            }
        }
    },
    checkShowOccupied:function(){
        var date = new Date()
        var day = date.getDay()
        if(day == this.occupiedDay){
            var oreData = Gm.oreData.getOreById(this.occupiedData.id)
            var msg = cc.js.formatStr(Ls.get(7500041), this.occupiedData.name)
            var callback = function(btnType){
                if(btnType == 1){
                    Gm.send(Events.ORE_ENTER_ROOM,oreData)
                }
            } 
            Gm.box({msg:msg},callback)
        }
        this.occupiedDay = null
    },
    onReceive:function(data){
        if(data && data.id !=0){
            var oreData = Gm.oreData.getOreById(data.id)
            Gm.send(Events.ORE_ON_GET_REWARD,data)
        }
        else if(data && data.id == 0){ 
            var tdata = Gm.oreData.getBattleLogData()
            for(var i=0;i<tdata.receives.length;i++){
                if(tdata.receives[i].roomType == data.roomType){
                    tdata.receives[i].gold = 0
                }
            }
            Gm.send(Events.ORE_ON_GET_REWARD,data)
            Gm.red.refreshEventState("ore")
        }
    },
    onBatleLog:function(data){
        if(data){
            Gm.oreData.setBattleLogData(data)
            Gm.send(Events.ORE_BATTLELOG_INFO)
            Gm.red.refreshEventState("ore")
        }
    },
     getOreData1(tdata){
        var oreData = Gm.oreData.getOreById(tdata.id)
        var config = Gm.config.getOreConfigById(oreData.oreId)
        var roomData = Gm.oreData.getEnterRoomDataByIndex(oreData.index)
        var data = {}
        data.titleName = config.name + roomData.roomIndex
        data.head = tdata.info.head
        
        data.scores = []
        data.scores[0] = {num:oreData.perScore}
        data.scores[1] = {num:oreData.perGold}
        data.isRecord = true
        return data
    },
    onBattleLogData:function(data){
        if(data){
            var battleLogInfo = Gm.oreNet.battleLogInfo
            data.battleInfo.oreData = this.getOreData1(battleLogInfo)
            if(Gm.heroData.getHeroById(data.battleInfo.battleData.roleInfo[0].id)){//自己是攻
                  data.battleInfo.hegemonyData = {
                    defpidname:Gm.userInfo.name,
                    atkpidname:battleLogInfo.info.name
                  }
            }
            else{
                 data.battleInfo.hegemonyData = {
                    defpidname:battleLogInfo.info.name,
                    atkpidname:Gm.userInfo.name
                  }
            }
            data.battleInfo.rfightResult = battleLogInfo.result ? 1 :0
            Gm.ui.create("BattleLoadView",{battleInfo:[data.battleInfo],isRecord:true})
        }
    },
    onRank:function(data){
        if(data){
            Gm.oreData.setOreRankData(data)
            Gm.send(Events.ORE_RANK_INFO)
        }
    },
    onDefender:function(data){
        if(data.id == 0){//登录请求数据返回
            Gm.oreData.myHeros = data.heros
            return
        }
        if(!data.setting){
            var oreData = Gm.oreData.getOreById(data.id)
            //处理一下baseId
            for(var i=0;i<data.heros.length;i++){
                if(data.heros[i].heroId != 0){
                    data.heros[i].baseId = Math.floor(data.heros[i].qualityId / 1000)
                }
            }
            oreData.heros = data.heros
            Gm.send(Events.ON_GET_DEFENDER_INFO,data.heros)
        }
        else{
            var oreData = Gm.oreData.getOreById(data.id)
            //处理一下baseId
            for(var i=0;i<data.heros.length;i++){
                if(data.heros[i].heroId != 0){
                    data.heros[i].baseId = Math.floor(data.heros[i].qualityId / 1000)
                }
            }
            var heros = []
            for(var i=0;i<Gm.oreNet.settingHeros.length;i++){
                if(Gm.oreNet.settingHeros[i] !=0){
                    var t= Gm.heroData.getHeroById(Gm.oreNet.settingHeros[i])
                    heros.push(t)
                }
                else{
                    heros.push(0)
                }
            }
            oreData.heros = heros
            Gm.send(Events.ON_GET_DEFENDER_INFO,heros)
        }
    },
    onOreRoomInfo:function(data){
        if(data){
            for(var i=0;i<data.oreList.length;i++){
                Gm.oreData.setOreData(data.oreList[i])
            }
        }
        Gm.send(Events.ORE_UPDATE_ROOM,data)
    },
    onOreBuyRet:function(){
        Gm.oreData.addBattleBuyCount()
        Gm.send(Events.ORE_UP_BAT_COUNT)
    },
    //水晶是否在免战中
    isOreInWarfree:function(oreData) {
        var time = Gm.config.getConst("ore_protected_time")
        if(Gm.userData.getTime_m() -  oreData.startTime <= time){//免战中
            return true
        }
        return false
    },
    //自己是否在免战中
    checkMeCanBattle:function(){
       var id = Gm.oreData.myOreId
       if(id){
            var oreData = Gm.oreData.getOreById(id)
            var time = Gm.config.getConst("ore_protected_time")
            if(Gm.userData.getTime_m() - oreData.startTime < time){
                return false
            }
       }
       return true
    },
    oreBtnClick(){
        if(OreFunc.oreIsOpen()){
            Gm.oreNet.sendOreRoomListInfo()
        }
        else{
            this.createData()
        }
    },
    createData(){
        if(this.deafaultData){
            this.onRoomListInfo(this.deafaultData)
            return
        }
        var config = Gm.config.getOreServerConfig()
        var data = {}
        data.roomList = []
        data.battleCount = 0
        var id = 10000
        for(var i=0;i<config[0].oreRoom.length;i++){
            var oreRoomConfig = Gm.config.getOreConfigByType(config[0].oreRoom[i].id)
            var length = parseInt(config[0].oreRoom[i].vaule)
            for(var j=0;j<length;j++){
                var temp = {}
                temp.type = config[0].oreRoom[i].id
                temp.index = data.roomList.length
                temp.oreList = []
                var fac1 = (oreRoomConfig.factories[j] && oreRoomConfig.factories[j].id) || 0
                for(var z=0;z<oreRoomConfig.ore.length;z++){
                    var t = {}
                    t.id = id
                    id = id + 1
                    t.oreId = oreRoomConfig.ore[z].id
                    var OreConfig = Gm.config.getOreConfigById(t.oreId)
                    t.startTime = 0
                    t.curGold = 0
                    t.curScore = 0
                    t.perGold = OreConfig.gold[0].num
                    var fac2 = oreRoomConfig.oreFactories[z] || 0
                    t.perScore = Math.floor((10000 + fac1 + fac2)/10000 * OreConfig.ore[0].num)
                    t.monsters = this.getDefaultMonster(OreConfig.monster[0].id)
                    temp.oreList.push(t)
                }
                data.roomList.push(temp)
            }
        }
        this.deafaultData =data
        this.onRoomListInfo(data)
    },
    getDefaultMonster(id){
        var config = Gm.config.getOreMonsterConfig(id)
        var ids = []
        for(var i=0;i<config.monster.length;i++){
            ids.push(config.monster[i].id)
        }
        return ids
    },
    openOreMainView(){
        if(!Gm.ui.getLayer("OreMainView")){
            Gm.ui.create("OreMainView",null,function(){
                Gm.oreNet.sendOreBattleLog()
            })
        }
        else{
            Gm.send(Events.ORE_ROOM_INFO)
        }
    },
});

