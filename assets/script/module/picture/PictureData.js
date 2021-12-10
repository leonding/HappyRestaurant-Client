cc.Class({
    properties: {
       
    },
    ctor:function(){
        this.clearData()
        
    },
    clearData:function(){
        this.mjEndTime = 0
        this.picData = {currentMapId:0}
        this.chessList = {3:[],4:[],5:[]}
        // this.currentMapId = 0
        // this.heroInfo = []
        // this.floorInfo = []
        // this.chessList = []
        this.treasureData = {currentMapId:0}
        this.treasureChessList = {4:[]}
    },
    getData(treasure){
        if (treasure){
            return this.treasureData
        }
        return this.picData
    },
    getPictureId(){
        if (this.getNowId() == 0){
            return checkint(Func.dateFtt("yyyyMM",Gm.userData.getTime_m()))
        }
        var conf = Gm.config.getPicturePuzzle(this.getNowId())
        return conf.group
    },
    setData(args){
        if (args.treasure){
            this.treasureData = args
        }else{
            this.picData = args
        }
        if (args.heroInfo){
            for (let index = 0; index < args.heroInfo.length; index++) {
                const v = args.heroInfo[index];
                var hero = Gm.heroData.getHeroById(v.heroId)
                if (hero){
                    v.qualityId = hero.qualityId
                }
            }
        }
        if (args.floorInfo){
            args.floorInfo.sort(function(a,b){
                return a.stageId - b.stageId
            })
            for (var i = 0; i < args.floorInfo.length; i++) {
                var v = args.floorInfo[i]
                this.updateMonsterLv(v)
            }
        }
    },
    addChessItem(data,nowId,treasure){
        var conf = Gm.config.getPicturePuzzle(nowId)
        var chessList = this.getChessList(treasure)
        if (chessList[conf.type] == null){
            chessList[conf.type] = []
        }
        chessList[conf.type].push(data)
    },
    getChessList(treasure){
        if (treasure){
            return this.treasureChessList
        }
        return this.chessList
    },
    setChessData(args){
        var chessList = this.getChessList(args.treasure)
        chessList[args.page] = args.chessList
    },
    getChessData(page,treasure){
        var chessList = this.getChessList(treasure)
        return chessList[page]
    },
    addHeroinfo(dd,treasure){
        var newData = this.getData(treasure)
        if (newData.currentMapId == 0){
            return
        }
        newData.heroInfo.push(dd)
    },
    removeHero(heroId){
        var remove = function(newData){
            if (newData.currentMapId == 0){
                return
            }
            Func.forRemove(newData.heroInfo,"heroId",heroId)
        }
        remove(this.getData(true))
        remove(this.getData(false))

        // var removeChess = function(list){
        //     for(const i in list){
        //         var dd = list[i]
        //         Func.forRemove(dd,"heroId",heroId)
        //     }
        // }
        // removeChess(this.chessList)
        // removeChess(this.treasureChessList)
    },
   
    getHeroinfo(treasure){
        var newData = this.getData(treasure)
        var list = []
        for (let index = 0; index < newData.heroInfo.length; index++) {
            const v = newData.heroInfo[index];
            if (v.hp > 0){
                var hero = Gm.heroData.getHeroById(v.heroId)
                if (hero){
                    v.level = hero.level
                    v.fight = hero.fight
                }
                if (v.baseId == 0){
                    v.baseId = Gm.config.getHero(0,v.qualityId).idGroup
                }
                list.push(v)
            }
        }
        return list
    },
    getHero(heroId,treasure){
        var newData = this.getData(treasure)
        var hero = Func.forBy(newData.heroInfo,"heroId",heroId)
        return hero
    },
    changeHeroQualityId(newData){
        var list = [true,false]
        for (var i = 0; i < list.length; i++) {
            var hero = this.getHero(newData.heroId,list[i])
            if (hero){
                hero.qualityId = newData.qualityId
            }
        }
    },
    isHeroDead(treasure){
        var newData = this.getData(treasure)
        for (let index = 0; index < newData.heroInfo.length; index++) {
            const v = newData.heroInfo[index];
            if (v.hp == 0 && data.maxMp != 0){
                return true
            }
        }
    },
    setEventData(args){
        var data = this.getFloorInfoByStageId(args.stageId,args.treasure)
        data.heroInfo = args.heroInfo
        this.updateMonsterLv(data)
    },
    updateMonsterLv(data){
        var conf = Gm.config.getPictureEvent(data.eventId)
        if (conf.type == 1){
            for (var j = 0; j < data.heroInfo.length; j++) {
                data.heroInfo[j].level = HeroFunc.monsterFormatLv(data.heroInfo[j].level)
            }
        }
    },
    getEventDataByStageId(stageId,treasure){
        var dd = this.getFloorInfoByStageId(stageId,treasure)
        return dd.heroInfo
    },
    saveEventHp(eventHero,hpData){
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
    getNowId(treasure){
        var newData = this.getData(treasure)
        return newData.currentMapId
    },
    getFloorInfoByStageId(stageId,treasure){
        var newData = this.getData(treasure)
        return newData.floorInfo[stageId]
    },
    getStageCompleteNum(treasure,isReal=false){
        var newData = this.getData(treasure)
        var num = 0
        for (let index = 0; index < newData.floorInfo.length; index++) {
            const v = newData.floorInfo[index];
            if(v.isFinish == 1){
                num = num+1
            }else if (!isReal){
                var conf = Gm.config.getPictureEvent(v.eventId)
                if (conf.type != 1){//非战斗可认为已通过
                    num = num+1
                }
            }
        }
        return num
    },
    changeFloorInfo(data,treasure){
        var dd = this.getFloorInfoByStageId(data.stageId,treasure)
        if (dd){
            dd.isFinish = data.isFinish || dd.isFinish
            dd.isReward = data.isReward || dd.isReward
        }
    },
    getDeadNum(treasure){
        var newData = this.getData(treasure)
        var num = 0
        for (let index = 0; index < newData.heroInfo.length; index++) {
            const v = newData.heroInfo[index];
            if (v.hp == 0 && v.maxMp != 0){
                num = num + 1
            }
        }
        return num
    },
    reviveHeroinfo(treasure){
        var newData = this.getData(treasure)
        for (let index = 0; index < newData.heroInfo.length; index++) {
            const v = newData.heroInfo[index];
            v.hp = v.maxHp
            v.mp = v.maxMp
        }
    },
    addNewHeros(heroInfos){
        for (let index = 0; index < heroInfos.length; index++) {
            const v = heroInfos[index];

            var heroData = Gm.heroData.getHeroById(v.heroId)

            var newData = {}
            newData.heroId = heroData.heroId
            newData.baseId = heroData.baseId
            newData.qualityId = heroData.qualityId
            
            newData.hp = heroData.getAttrValue(100)
            newData.maxHp = newData.hp
            newData.mp = 0
            newData.maxMp = heroData.getAttrValue(101)
            this.addHeroinfo(Func.dataMerge({},newData),false)
            this.addHeroinfo(Func.dataMerge({},newData),true)
        }
    },
    getMiJingEndTime(){
        if (this.mjEndTime > 0){
            return this.mjEndTime
        }
        var startDate = new Date(Gm.config.getConst("treasure_puzzle_open_time")).getTime()
        var countinueTime = Gm.config.getConst("treasure_puzzle_countinue_time")
        this.mjEndTime = startDate + Math.ceil(Func.translateTime1(startDate,true)/countinueTime)*countinueTime*1000
        return this.mjEndTime
    },
    getNowRow(treasure,type){
        var newData = this.getData(treasure)
        var num = 0
        for (let index = 0; index < newData.floorInfo.length; index++) {
            const v = newData.floorInfo[index];
            if(v.isFinish == 1){
                num = index+1
            }else{
                var conf = Gm.config.getPictureEvent(v.eventId)
                if (conf.type == 1){
                    break
                }
                //非战斗可认为已通过
                num = index+1
            }
        }
        return Math.floor(num/type)
    },
});
