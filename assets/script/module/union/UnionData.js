var to = {}
to[7001] = "level"
to[7002] = "exp"
to[7003] = "activity"
cc.Class({
    properties: {
        
    },
    ctor:function(){
        this.clearData()
    },
    clearData(){
        this.id = 0
        this.isSign = false
        this.reList = null
        this.info = null
        this.bossInfo = null
        this.applyList = []
        this.rankList = null

        //公会竞技
        this.activeAtyOpen = false //
        this.monsterData = []         // 怪物数据
        this.dailyClearTime = 0      //竞技任务下次刷新时间
        this.sportsTaskList = []       //竞技任务数据
        this.activeReceivedList = [] //竞技任务活跃度已经领取的数据
        this.alreadyPassTowers = [] //首通奖励
        this.islandInfoData = []      //岛屿内部数据
        this.alreadyReciveRewardList = [] //已经领取的奖励
        this.needShowNewChapter = false //显示新章节动画
    },
    isUnion(){
        return this.id > 0 
    },
    getUnionName(){
        if (this.isUnion()){
            return Gm.unionData.info.name
        }else{
            return "无"
        }
    },
    setInfo(data){
        this.info = data
        if (data){
            this.id = data.allianceId
            this.bossInfo = data.bossInfo
        }else{
            this.id = 0
            this.reList = null
            this.info = null
            this.bossInfo = null
            this.applyList = []
            this.rankList = null
        }
    },
    getMember(id){
        id = id || Gm.userInfo.id
        for (let index = 0; index < this.info.memberInfos.length; index++) {
            const v = this.info.memberInfos[index];
            if (v.arenaFightInfo.playerId == id){
                return v
            }
        }
    },
    isLeader(id){
        var member = this.getMember(id)
        if (!member){
            return false
        }
        return member.arenaFightInfo.role == ConstPb.allianceRole.ALLIANCE_ROLE_LEADER
    },
    isMgr(id){
        var member = this.getMember(id)
        if (!member){
            return false
        }
        return member.arenaFightInfo.role == ConstPb.allianceRole.ALLIANCE_ROLE_LEADER || member.arenaFightInfo.role == ConstPb.allianceRole.ALLIANCE_ROLE_SECLEADER
    },
    getMgrNum(){
        var num = 0
        for (let index = 0; index < this.info.memberInfos.length; index++) {
            const v = this.info.memberInfos[index];
            if (v.arenaFightInfo.role ==  ConstPb.allianceRole.ALLIANCE_ROLE_SECLEADER ){
                num = num + 1
            }
        }
        return num
    },
    getOpenTime(index){
        var time = this.info.bossOpenTime[index]
        return time || 0
    },
    modifyData(data,isAdd){
        if (this.info==null){
            return
        }
        var key = to[data.allianceAttr]
        if (key && this.info.hasOwnProperty(key)){
            if (data.type == 1){//总值
                this.info[key] = data.count
            }else if (data.type == 2){//变化值
                if (isAdd){
                    this.info[key] = this.info[key] + data.count
                }else{
                    this.info[key] = this.info[key] - data.count
                }
            }
        }
    },
    devoteSYNC(){
        if(this.info){
            var member = Gm.unionData.getMember()
            if (member){
                member.devote =  Gm.userInfo.devote
            }
        }
    },
    roleStr(role){
        return role==1?Ls.get(800010):role==2?Ls.get(800011):Ls.get(800012)
    },
    getMaxOpenNum(){
        return Math.floor(this.info.level/5)+2
    },
    changeOffOn(list){
        for (let index = 0; index < list.length; index++) {
            const v = list[index];
            var member = this.getMember(v.playerId)
            if (member){
                member.arenaFightInfo.leaveTime = v.leaveTime
            }
        }
    },


    // --------工会竞技
    //退出公会清除数据
    cleanSportsData(){
        this.monsterData = []         // 怪物数据
        this.alreadyPassTowers = [] //首通奖励
        this.islandInfoData = []      //岛屿内部数据
        this.alreadyReciveRewardList = [] //已经领取的奖励
        this.sportsEndTime = 0
         if(this.getSportsMissionEndTime() < Gm.userData.getTime_m()){
             this.activeReceivedList = [] //竞技任务活跃度已经领取的数据
             this.sportsTaskList = [] //竞技数据
         }
    },
    setSportsEndTime(endTime){
        this.sportsEndTime = endTime
    },
    getSportsEndTime(){
        if(this.sportsEndTime){
            return  this.sportsEndTime
        }
        return 0
    },
    setMaxOPenIslandId(islandId){
        this.maxIslandId = islandId
    },
    getMaxOpenIslandId(){
        if(!this.sportsIsOpen()){
            return 0
        }
        if(this.maxIslandId){
            return this.maxIslandId
        }
        return 1
    },
    setIslandData(group,data){
        this.islandInfoData[group-1] = data
    },
    getIslandData(group){
        if(this.islandInfoData[group-1]){
            return this.islandInfoData[group-1]
        }
        return null
    },
    getProgressData(group){
        var data = {}
        data.pointsArray = []
        var config = Gm.config.getAllianceIslandsConfigById(group).scores
        for(var i=0;i<config.length;i++){
            data.pointsArray.push(config[i].num)
        }
        data.currentPoints = this.getPointsByGroup(group)
       
        return data
    },
    getPointsByGroup(group){
        var config = Gm.config.getAllianceIslandsConfigById(group).scores
        if(group<this.getMaxOpenIslandId()){
             return config[config.length-1].num
        }
        else{
            return  this.getCurrentPoints()
        }
    },
    setCurrrentPoints(currentPoints){
        this.currentPoints = currentPoints
    },
    getCurrentPoints(){
        return this.currentPoints || 0
    },
    setMonsterData(id,data){
        // for(var i=0;i<data.length;i++){
        //     var monster = Gm.config.getMonster(data[i].monsterId)
        //     data[i].maxHp = monster.maxHp
        //     data[i].maxMp = monster.maxMp
        // }
        this.monsterData[id] = data
    },
    getMonsterData(id){
        if( this.monsterData[id]){
            return this.monsterData[id]
        }
        return []
    },
    reciveMonsterHp(id){
        var data = this.getMonsterData(id)
        for(var i=0;i<data.length;i++){
            data[i].hp = data[i].maxHp
            data[i].mp = Math.min(data[i].maxMp/2)
        }
    },
    getSportsMonsterByTowerId(id,monsterId){
        var data = this.getMonsterData(id)
        if(data){
            for(var i=0;i<data.length;i++){
                if(data[i].monsterId == monsterId){
                    return data[i]
                }
            }
        }
        return null
    },
    setAleardyPassIds(array){
        this.alreadyPassTowers = array
    },
    addAleardyPassId(id){
        var has = false
        for(var i=0;i<this.alreadyPassTowers.length;i++){
            if(this.alreadyPassTowers[i] == id){
                has = true
            }
        }
        if(!has){
            this.alreadyPassTowers.push(id)
        }
    },
    hasFirstPassReward(id){
        for(var i=0;i<this.alreadyPassTowers.length;i++){
            if(id == this.alreadyPassTowers[i]){
                return false
            }
        }
        return true
    },
    setAlreadyReciveRewardList(group,array){
        this.alreadyReciveRewardList[group-1] = array
    },
    addAlreadyReciveRewardList(group,floorIndex){
        if(!this.alreadyReciveRewardList[group-1]){
            this.alreadyReciveRewardList[group-1] = []
        }
       this.alreadyReciveRewardList[group-1].push(floorIndex)
    },
    isReciveReward(group,floorIndex){
         var  tconfig = Gm.config.getAllianceIslandRewardConfig(group,floorIndex)
        if(this.alreadyReciveRewardList[group-1]){
            for(var i=0;i<this.alreadyReciveRewardList[group-1].length;i++){
                if(this.alreadyReciveRewardList[group-1][i] == tconfig.id){
                    return true
                }
            }
        }
        return false
    },
    getRewardScore(group){
        var scores = Gm.config.getAllianceIslandsConfigById(group).scores
        var points = this.getPointsByGroup(group)
        for(var i=0;i<scores.length;i++){
            if(points>=scores[i].num && (!this.isReciveReward(group,i+1))){
                return i+1
            }
        }
        return null
    },

    setSportsHeroData(data){//
        this.sportsHeroData = this.dealHeroData(data)
    },
    getSportsHeroData(){//
        if(this.sportsHeroData){
            var data = this.dealHeroLevelData( this.sportsHeroData)
            return  data
        }
        return []
    },
    dealHeroLevelData(tdata){
        var list = []
        for(let i=0;i<tdata.length;i++){
            var hero = Gm.heroData.getHeroById(tdata[i].heroId)
            if (hero){
                tdata[i].level = hero.level
                tdata[i].fight = hero.fight
                tdata[i].qualityId = hero.qualityId
                if (tdata[i].baseId == 0){
                    tdata[i].baseId = Gm.config.getHero(0,tdata[i].qualityId).idGroup
                }
                list.push(tdata[i])
            }
        }
        return list
    },
    dealHeroData(newData){//
        var list = []
        for (let index = 0; index < newData.length; index++) {
            const v = newData[index];
            var hero = Gm.heroData.getHeroById(v.heroId)
            if (hero){
                v.level = hero.level
                v.fight = hero.fight
                v.qualityId = hero.qualityId
            }
            if (v.baseId == 0){
                v.baseId = Gm.config.getHero(0,v.qualityId).idGroup
            }
            list.push(v)
        }
        return list
    },
    getHeroById(id){//
        var data = this.getSportsHeroData()
        for(var i=0;i<data.length;i++){
            if(data[i].heroId == id){
                return data[i]
            }
        }
        return null
    },
     addNewHeros(heroInfos){
         if(this.sportsHeroData){
            for (let index = 0; index < heroInfos.length; index++) {
                const v = heroInfos[index];

                var heroData = Gm.heroData.getHeroById(v.heroId)

                var newData = {}
                newData.heroId = heroData.heroId
                newData.baseId = heroData.baseId
                newData.qualityId = heroData.qualityId
                
                newData.hp = heroData.getAttrValue(100)
                newData.maxHp = newData.hp
                newData.maxMp = heroData.getAttrValue(101)
                newData.mp = Math.floor(newData.maxMp/2)
                newData.level = heroData.level
             
                this.sportsHeroData.push(newData)
            }
         }
    },
    removeHero(heroId){
        if(this.sportsHeroData){
            for(let index = 0;index < this.sportsHeroData.length;index++){
                if(this.sportsHeroData[index].heroId == heroId){
                    this.sportsHeroData.splice(index,1)
                }
            }
        }
    },
    getSportNDeadHeroData(){//
        var data = this.getSportsHeroData()
        var tempData = []
        for(var i=0;i<data.length;i++){
            if(data[i].hp > 0){
                tempData.push(data[i])
            }
        }
        return tempData 
    },
    getSportsDeadHeroData(){//
        var data = this.getSportsHeroData()
        var tempData = []
        for(var i=0;i<data.length;i++){
            if(data[i].hp == 0){
                tempData.push(data[i])
            }
        }
        return tempData
    },
    getHeroDeadNum(){//
        var data = this.getSportsDeadHeroData()
        return data.length
    },
    reviveHeroInfo(){//
        var newData = this.getSportsHeroData()
        for (let index = 0; index < newData.length; index++) {
            var  v = newData[index];
            v.hp = v.maxHp
            v.mp = v.maxMp
        }
    },
    reviveHeroById(id){//
        var newData = this.getSportsHeroData()
        for (let index = 0; index < newData.length; index++) {
            const v = newData[index];
            if(v.heroId == id){
                v.hp = v.maxHp
                v.mp = v.maxMp
                break
            }
        }
    },
    saveEventHp(eventHero,hpData){//
        if (hpData.hp != null){
            eventHero.hp = hpData.hp
        }
        if (hpData.mp != null){
            eventHero.mp = hpData.mp
        }
        if (hpData.maxHp != null){
            eventHero.maxHp = hpData.maxHp
        }
        if (hpData.maxMp != null){
            eventHero.maxMp = hpData.maxMp
        }
    },

    // 联盟竞技任务
    setSportsMissionData(args){//设置竞技任务数据
        for(const i in args.taskList){
            this.pushData(args.taskList[i])
        }
    },
    //更新任务
    updateSportsMissonData(args){
          var length = args.taskList.length
          if(length == 2){//两个的话
               for(const i in args.taskList){
                    if(args.taskList[i].rate == -1){
                           for (let index = 0; index < this.sportsTaskList.length; index++) {
                                if (this.sportsTaskList[index].data.id ==  args.taskList[i].id){
                                    this.sportsTaskList.splice(index,1)
                                    break
                                }
                            }
                    }
                    else{
                        this.pushData(args.taskList[i])
                    }
               }
          }
          else if(length == 1){//只有一个更新
                this.pushData(args.taskList[0])
          }
    },
    pushData:function(item){
        var tmpIndex = -1
        var tmpConfig = Gm.config.getTaskById(item.id)
        if (tmpConfig){
            for (let index = 0; index < this.sportsTaskList.length; index++) {
                if (this.sportsTaskList[index].data.id == item.id){
                    tmpIndex = index
                    break
                }
            }
            if (tmpIndex != -1){
                this.sportsTaskList[tmpIndex].rate = item.rate
            }else{
                this.sportsTaskList.push({rate:item.rate,data:tmpConfig})
            }
        }
    },
    //获取联盟竞技任务时间下次的刷新时间
    getSportsMissionEndTime(){
        return  this.dailyClearEndTime || 0
    },
    setSportsMissionEndTime(time){
        this.dailyClearEndTime = time
    },
    getSportsMissionData(){
        return this.sportsTaskList
    },
    setSportsMissionPoints(points){
        this.sportsMissionPoints = points
    },
    getSportsMissionPoints(){
        return this.sportsMissionPoints || 0
    },
    //竞技任务有已经完成的
    getSportsTaskFinish(){
        if(!this.isUnion()){
            return false
        }
        var config = Gm.config.getViewById(40002)
        if(config.openMapId && config.openMapId > Gm.userInfo.getMaxMapId()){
            return false
        }
        if(this.getSportsMissionEndTime() < Gm.userData.getTime_m()){
             return false
        }
        if(this.sportsTaskList){
            for(var i=0;i<this.sportsTaskList.length;i++){
                if(this.sportsTaskList[i].rate !=-1 && this.sportsTaskList[i].rate == this.sportsTaskList[i].data.rate){
                    return true
                }
            }
            //还要检查active中是否有可以领取的
            var nowActive = Gm.unionData.getSportsMissionPoints()
            //积分的是否可以领取
             var tmpData = Gm.config.getAllianceTaskActiveConfig()
             for(var i=0;i<tmpData.length;i++){
                 if(tmpData[i].type == 3){
                     if(nowActive>=tmpData[i].active && this.isActiveRece(tmpData[i].id)){
                         return true
                     }
                 }
             }
        }
        return false
    },
    isActiveRece:function(destId){//false已经领取 true没有领取
        if (destId){
            for(const i in this.activeReceivedList){
                if (this.activeReceivedList[i] == destId){
                    return false
                }
            }
        }
        return true
    },
    setSportsRankData(data){
        this.sportsRankData = data
        this.sportsRankData.refreshTime = Gm.userData.getTime_m() + 60 * 1000
    },
    getSportsRankData(){
        return this.sportsRankData
    },
    setReviceHeroHasFree(key){
        this.reviceHeroFreeNum = key
    },
    getReviceHeroHasFree(){
        return this.reviceHeroFreeNum
    },
    reviceHeroHasFree(){
        return this.reviceHeroFreeNum>0
    },
    setBattleLimit(num){
        this.battleLimitNum = num
    },
    getBattleLimit(){
        return this.battleLimitNum || 0
    },
    canBattle(group){
        return (this.battleLimitNum || 0) > 0 ||  Gm.unionData.getMaxOpenIslandId()> group
    },
    getIslandPercent(group){
        var config = Gm.config.getAllianceIslandsConfigById(group)
        var maxS = config.scores[config.scores.length-1]
        var num = parseInt(this.getPointsByGroup(group) / maxS.num * 100)
        if(num>100){
            num = 100
        }
        return num
    },
    setNextOpenTime(nextopentime){
        this.nextopentime = nextopentime
    },
    getNextOpenTime(){
        return this.nextopentime
    },
    sportsIsOpen(){
        var time2 = this.getNextOpenTime()
        if(time2 == -1){
            return true
        }
        return false
    }
});
