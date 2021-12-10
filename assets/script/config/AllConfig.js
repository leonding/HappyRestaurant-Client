var CoreConfig = require("CoreConfig")
cc.Class({
    extends: CoreConfig,
    properties: {
    },
    ctor:function(){
    },
    //常量表
    getConst:function(key){
        var item = this.getKeyById("ConstantKeyValueConfig","key",key)
        if (item){
            if (item.type == "Integer" || item.type == "float" || item.type == "Long"){
                return checkint(item.value)
            }
            return item.value
        }
        return null
    },
    getSound:function(id){
        return this.getKeyById("SystemSoundConfig","id",id).file_name
    },
    getHeroAttr:function(value){
        let tmpConfig = this.getKeyById("FightValueConfig","attribute_id",value)
        if (tmpConfig){
            return tmpConfig.attribute_name
        }else{
            return "属性"+value
        }
    },
    getFightValueConfig:function(id){
        return  this.getKeyById("FightValueConfig","id",id)
    },
    getServerConfigName(){
        var appType = Bridge.getAppType()
        if (appType >0 ){
            return "ServerConfig" + appType
        }
        return "ServerConfig"
    },
    getAllServers:function(){
        return this.getConfig(this.getServerConfigName())
    },
    serverById:function(serverId){
        var item = this.getKeyById(this.getServerConfigName(),"id",serverId)
        if (item == null){
            var conf = this.getAllServers()
            return conf[conf.length-1]
        }
        return item
    },
    getViewById:function(viewId){
        return this.getKeyById("ViewIdConfig","viewId",viewId)
    },
    getViewByName:function(viewName,interfaceParameter){
        if (interfaceParameter){
            return this.getKeyById2("ViewIdConfig","clientDes",viewName,"interfaceParameter",interfaceParameter)
        }else{
            return this.getKeyById("ViewIdConfig","clientDes",viewName)
        }
    },
    getViewsByName(viewName){
        return this.getKeysById("ViewIdConfig","clientDes",viewName)
    },
    getGroupByChapter:function(chapter){
        let tmpData = this.getConfig("ChapterGroupConfig")
        for(const i in tmpData){
            for(const j in tmpData[i].subsetId){
                if (tmpData[i].subsetId[j].id == chapter){
                    return tmpData[i]
                }
            }
        }
    },
    getChapterById:function(chapter){
        return this.getKeyById("ChapterConfig","id",chapter)
    },
    getBubById:function(bubId){
        return this.getKeyById("BubblingConfig","id",bubId)
    },
    getJobFactor:function(destJob){
        return this.getKeyById("JobAttackFactorConfig","id",destJob)
    },
    getMapById:function(mapId){
        return this.getKeyById("MapConfig","id",mapId)
    },
    getMapsByChap:function(chapter,isElite){
        var mapType = isElite?2:1
        return this.getKeysById2("MapConfig","chapter",chapter,"mapType",mapType)
    },
    getBattleBg:function(id,battleType){
        var tmpType = battleType || 0
        var item = this.getKeyById2("BattleBGConfig","battleId",id,"battleType",tmpType)
        if (item == null){
            item = this.getConfig("BattleBGConfig")[0]
        }
        return item
    },
    getBattleAuraConfig:function(peopleNum){
        return this.getKeysById("BattleAuraConfig","pattyMembers",peopleNum)
    },
    getBattleAuraById(id){
        return this.getKeyById("BattleAuraConfig","id",id)
    },
    getPoolLevel:function(){
        let tmpData = this.getConfig("CrystalMaxLevelConfig")
        for(const i in tmpData){
            if (Gm.heroData.m_iPoolLevel >= tmpData[i].minLevel && 
                Gm.heroData.m_iPoolLevel < tmpData[i].maxLevel){
                return tmpData[i].limitMaxLevel
            }
        }
        return 999
    },
    getLimitMax:function(){
        let tmpData = this.getConfig("CrystalMaxLevelConfig")
        var len = tmpData.length - 1
        for(var i in tmpData){
            if (Gm.heroData.m_iPoolLevel >= tmpData[i].minLevel && 
                Gm.heroData.m_iPoolLevel < tmpData[i].maxLevel){
                if (i < len){
                    return tmpData[checkint(i)+1].minLevel
                }
            }
        }
        return 999
    },
    getPoolNeed:function(crystalLevel,stage){
        let tmpData = this.getKeyById2("HeroUpLevelConfig","crystalLevel",crystalLevel,"stage",stage)
        if (!tmpData){
            tmpData = this.getKeyById2("HeroUpLevelConfig","crystalLevel",crystalLevel + 1,"stage",0)
        }
        return tmpData
    },
    getPoolMax:function(){
        let tmpData = this.getConfig("CrystalMaxLevelConfig")
        var tmpNum = 0
        for(const i in tmpData){
            if (tmpNum < tmpData[i].limitMaxLevel){
                tmpNum = tmpData[i].limitMaxLevel
            }
        }
        return tmpNum
    },
    getHeroMaxLevel:function(){
        let tmpData = this.getConfig("HeroUpLevelConfig")
        var tmpMax = 0
        for(const i in tmpData){
            if (tmpData[i].crystalLevel > tmpMax){
                tmpMax = tmpData[i].crystalLevel
            }
        }
        return tmpMax
    },
    getLineUp:function(level){
        var tmpField = 1
        var tmpLevel = 0
        let tmpData = this.getConfig("UnlockLineUpConfig")
        for(const i in tmpData){
            if (tmpData[i].level > level){
                tmpLevel = tmpData[i].level
                break
            }else{
                tmpField = tmpData[i].field
            }
        }
        return {field:tmpField,level:tmpLevel}
    },
    getFightLineUp:function(level){
        var tmpField = 1
        let tmpData = this.getConfig("UnlockFightLineConfig")
        for(const i in tmpData){
            if (tmpData[i].level > level){
                break
            }else{
                tmpField = tmpData[i].field
            }
        }
        return tmpField
    },
    characterByAttribute:function(characterID){
        return this.getKeyById("CharacterEffectConfig","characterID",characterID)
    },
    characterById:function(id){
        return this.getKeyById("CharacterEffectConfig","id",id)
    },
    characterMotion:function(id){
        return this.getKeyById("CharacterMotionConfig","id",id)
    },
    getMonster:function(monsterId){
        return this.getKeyById("MonsterConfig","id",monsterId)
    },
    getMonsterByMap:function(mapId){
        return this.getKeysById("MonsterConfig","mapId",mapId)
    },
    //clazz 1.列阵 2.普通 3.both
    checkYokeByClazz:function(clazz,data){
        var list = {}
        if (clazz != 2){
            list[1] = []
        }
        if (clazz != 1){
            list[2] = []
        }
        var all = this.getConfig("ZhenfaConfig")
        for(const i in all){
            var tmpCan = false
            if (data.id == all[i].wid){
                if (all[i].clazz == clazz || clazz == 3){
                    for(const j in all[i].condition){
                        if (all[i].type == 3 && all[i].condition[j] == data.id){//英雄
                            tmpCan = true
                            break
                        }else if(all[i].type == 2 && all[i].condition[j] == data.job){//职业
                            tmpCan = true
                            break
                        }else if(all[i].type == 1 && all[i].condition[j] == data.camp){//阵营
                            tmpCan = true
                            break
                        }
                    }
                }
            }
            if (tmpCan){
                list[all[i].clazz].push(all[i])
            }
        }
        return list
    },
    getFaZhenYoke:function(){
        return this.getKeysById("ZhenfaConfig","clazz",1)
    },
    getYokeById:function(id){
        return this.getKeyById("ZhenfaConfig","id",id)
    },
    getFaZhenYokeByWid:function(wid){
        var data = this.getFaZhenYoke()
        for(var i=0;i<data.length;i++){
            if(data[i].wid == wid){
                return data[i]
            }
        }
    },
    getHeroAll:function(){
        var allHero = this.getConfig("HeroConfig")
        var result = []
        for (let index = 0; index < allHero.length; index++) {
            const v = allHero[index];
            if (v.use == 1){
                result.push(v)
            }
        }
        // result.sort((a,b)=>{
        //     return a.sort - b.sort
        // })
        return result
    },
    getHeroAttrQualityRatioConfig:function(monsterId){
        return this.getKeyById("HeroAttrQualityRatioConfig","id",monsterId)
    },
    getHeroByTeamType(type){
        var allHero = this.getConfig("HeroConfig")
        var result = []
        for (let index = 0; index < allHero.length; index++) {
            const v = allHero[index];
            if ((type == 0 || v.camp == type) && v.use == 1){
                result.push(v)
            }
        }
        result.sort((a,b)=>{
            return a.sort - b.sort
        })
        return result
    },
    getHero:function(monsterId,quality){
        if (monsterId == 0 && quality){
            monsterId = this.getQulityHero(quality).idGroup
        }
        var retn = Func.copyArr(this.getKeyById("HeroConfig","id",monsterId))
        if (retn.qualityProcess == null){
            return
        }
        var tmpQua = quality
        if (!tmpQua){
            tmpQua = retn.qualityProcess[0]
        }
        var hero = this.getQulityHero(tmpQua)
        for(const i in hero){
            if (!retn[i]){
                retn[i] = hero[i]
            }
        }
        return retn
    },
    getQulityHero:function(monsterId){
        return this.getKeyById("HeroQualityConfig","id",monsterId)
    },

    getGroupHeroBySkin:function(skinId){
        return this.getKeysById("HeroQualityConfig","skin_id",skinId)
    },

    getSkin(id){
        return this.getKeyById("HeroSkinConfig","id",id)
    },
    getSkins(idGroup){
        var list = this.getKeysById("HeroSkinConfig","idGroup",idGroup)
        list.sort(function(a,b){
            if (a.quality == b.quality){
                return a.type - b.type
            }
            return a.quality - b.quality
        })
        return list
    },
    getSkinsByType(idGroup,type){
        var list = this.getKeysById2("HeroSkinConfig","idGroup",idGroup,"type",type)
        list.sort(function(a,b){
            if (a.quality == b.quality){
                return a.type - b.type
            }
            return a.quality - b.quality
        })
        return list
    },
    getGroupHero:function(idGroup){
        return this.getKeysById("HeroQualityConfig","idGroup",idGroup)
    },
    getChipNow:function(monsterId,quality){
        var tmpTotal = 0
        var retn = this.getKeyById("HeroConfig","id",monsterId)
        for(const i in retn.qualityProcess){
            const tmpConfig = Gm.config.getQulityHero(retn.qualityProcess[i])
            if (tmpConfig.quality > quality){
                tmpTotal = tmpTotal + tmpConfig.hero_chip_num
            }
        }
        return tmpTotal
    },
    getCanUseHeros(){
        var list = this.getConfig("HeroConfig")
        var tab = []
        for (let index = 0; index < list.length; index++) {
            const v = list[index];
            if (v.use != 3){
                tab.push(v)
            }
        }
        return tab
    },
    getHerosByQuality:function(quality){
        var list = this.getConfig("HeroQualityConfig")
        var tab = []
        for(const i in list){
            if (list[i].quality == quality){
                var tmpGroup = this.getKeyById("HeroConfig","id",list[i].idGroup)
                if (tmpGroup.qualityProcess[0] == list[i].id){
                    tab.push(list[i])
                }
            }
        }
        return tab
        // return this.getKeysById("HeroQualityConfig","quality",quality)
    },
    getHeroByQuality(quality){
        return this.getKeyById("HeroQualityConfig","quality",quality)
    },
    getItem:function(id){
        return this.getKeyById("ItemConfig","id",id)
    },
    getItemsByType:function(type){
        return this.getKeysById("ItemConfig","type",type)
    },
    getEquip:function(id){
        return this.getKeyById("EquipConfig","id",id)
    },
    getEquipByEquipClass(equipClass){
        return this.getKeysById("EquipConfig","equipClass",equipClass)
    },  
    getBuyBag:function(id){
        return this.getKeyById("BackpackLatticeeConfig","id",id)
    },
    getEquipViewType:function(id){
        return this.getKeyById("EquipTypeConfig","id",id)
    
    },
    getPrizeConfig:function(group){
        return this.getKeyById("PrizeDrawPackageConfig","group",group)
    },
    getPrizeGroupsConfig:function(group){
        return this.getKeysById("PrizeDrawPackageConfig","group",group)
    },
    getLotteryConfig:function(id){
        return this.getKeyById("PrizeDrawFieldConfig","id",id)
    },
    getDrawEquipReward:function(mode,times){
        var tmpRet = this.getKeysById("DrawEquipRewardConfig","mode",mode)
        var tmpIdx = tmpRet.length - 1
        for(const i in tmpRet){
            if (times < tmpRet[i].times){
                tmpIdx = checkint(i)
                break
            }
        }
        return tmpRet[tmpIdx]
    },
    getDrawequipBy2:function(mode,times){
        return this.getKeyById2("DrawEquipRewardConfig","mode",mode,"times",times)
    },
    getLotteryLib:function(itemGroup){
        var list = this.getKeysById("DrawShopLibraryConfig","itemGroup",itemGroup)
        var tab = []
        for(const i in list){
            if (list[i].showCondition == 2){
                if (Gm.heroData.getHeroByBaseId(list[i].itemId)){
                    tab.push(list[i])
                }
            }else{
                tab.push(list[i])
            }
        }
        return tab
        // return this.getKeysById("DrawShopLibraryConfig","itemGroup",itemGroup)
    },
    getBranch:function(guideGroup){
        return this.getKeysById("BranchGuideConfig","guideGroup",guideGroup)
    },
    getGuideBattle:function(){
        return this.getConfig("VirtualBattleConfig")
    },
    getGuide:function(guideId){
        return this.getKeyById("NoviceGuideConfig","guideId",guideId)
    },
    getGuides:function(guideGroup){
        return this.getKeysById("NoviceGuideConfig","guideGroup",guideGroup)
    },
    getCopsById:function(copId){
        return this.getKeysById("CopywritingConfig","copId",copId)
    },
    getSkill:function(monsterId){
        return this.getKeyById("SkillViewConfig","baseId",monsterId)
    },
    getMailConfig:function(destId){
        return this.getKeyById("MailConfig","id",destId)
    },
    getTaskById:function(missionId){
        return this.getKeyById("TaskConfig","id",missionId)
    },
    getDailyMis:function(destMisId){
        if (destMisId){
            return this.getKeyById("DailyTaskActiveConfig","id",destMisId)
        }else{
            return this.getConfig("DailyTaskActiveConfig")
        }
    },
    getDailyActive:function(destDay){
        if (destDay){
            return this.getKeyById("Activity_DailyTaskConfig","day",destDay)
        }else{
            return this.getConfig("Activity_DailyTaskConfig")
        }
    },
    getBuffWithId:function(destId){
        return this.getKeyById("BuffConfig","id",destId)
    },
    getPlayerLevel:function(destlevel){
        return this.getKeyById("PlayerUpLevelConfig","id",destlevel)
    },
    getLevelMaxQuality:function(quality){
        var tmpReturn = this.getKeysById("HeroUpLevelConfig","quality",quality)
        var tmpValue = 0
        for(const i in tmpReturn){
            if (tmpReturn[i].id > tmpValue){
                tmpValue = tmpReturn[i].id
            }
        }
        return tmpValue
    },
    getHeroByLv:function(destLevel){
        return this.getKeyById("HeroUpLevelConfig","id",destLevel)
    },
    getJobWithId:function(destId){
        return this.getKeyById("SecondaryJobConfig","id",destId)
    },
    getJobInfo:function(destJob,destPoint){
        let tmpData = this.getConfig("JobAttrConfig")
        for(const i in tmpData){
            if (tmpData[i].job == destJob){
                if (destPoint){
                    if (tmpData[i].jobPoint == destPoint){
                        return tmpData[i]
                    }
                }else{
                    return tmpData[i]
                }
            }
        }
    },
    getMaxJob:function(destJob){
        let tmpData = this.getConfig("JobAttrConfig")
        var tmpMaxNum = 0
        for(const i in tmpData){
            if (tmpData[i].job == destJob){
                if (tmpData[i].jobPoint > tmpMaxNum){
                    tmpMaxNum = tmpData[i].jobPoint
                }
            }
        }
        return tmpMaxNum
    },
    getArenaMon:function(destId){
        return this.getKeyById("ArenaMonsterConfig","id",destId)
    },
    getArenaReward:function(){
        return this.getConfig("ArenaRankRewardConfig")
    },
    getLearnSkill:function(jobId,jobPoint){
        // console.log("jobId,jobPoint===:",jobId,jobPoint)
        let tmpData = this.getConfig("SkillViewConfig")
        var tmpReturn = []
        for(const i in tmpData){
            if (tmpData[i].job == jobId && tmpData[i].condition == jobPoint){
                tmpReturn.push(tmpData[i].baseId)
            }
        }
        return tmpReturn
    },
    getAllLearnSkill:function(jobId){
        var tmpReturn = this.getKeysById("SkillViewConfig","job",jobId)
        tmpReturn.sort(function(a,b){
            return a.condition - b.condition
        })
        return tmpReturn
    },
    getNextJobAdds:function(destJob,destPoint){
        // let tmpData = this.getConfig("JobAttrConfig")
        // for(const i in tmpData){
        //     if (tmpData[i].job == destJob){
        //         if (destPoint != 1){
        //             if (tmpData[i].jobPoint == destPoint){
        //                 var tmpRet = {}
        //                 for(const j in tmpData[i]){
        //                     tmpRet[j] = tmpData[i][j] - tmpData[i-1][j]
        //                 }
        //                 return tmpRet
        //             }
        //         }else{
        //             return tmpData[i]
        //         }
        //     }
        // }
        return this.getKeyById2("JobAttrConfig","job",destJob,"jobPoint",destPoint)
    },
    getAllJobById:function(destJob){
        var tmpReturn = []
        var getJobTree = function(JobId,destArray){
            destArray.splice(0,0,JobId)
            var tmpJob = Gm.config.getJobWithId(JobId)
            if (tmpJob){
                if (tmpJob.preJobid){
                    getJobTree(tmpJob.preJobid,destArray)
                }else{
                    destArray.splice(0,0,0)
                }
            }
        }
        getJobTree(destJob,tmpReturn)
        return tmpReturn
    },
    getCultrueData:function(destLevel,destQuality){
        return this.getKeyById2("HeroCultureConfig","level",destLevel,"quality",destQuality)
    },
    getCultureFloat:function(cultureType,destBili){
        var tmpRet = this.getKeysById("HeroCultureFloatConfig","cultureType",cultureType)
        for(const i in tmpRet){
            if (tmpRet[i].attributeAatiosMin < destBili && tmpRet[i].attributeAatiosMax >= destBili){
                return tmpRet[i]
            }
        }
    },
    getTrainByLevel:function(destLevel,destQuality){
        return this.getKeyById2("HeroTrainConfig","trainLevel",destLevel,"quality",destQuality)
    },
    getDrillByLevel:function(destLevel,destQuality){
        return this.getKeyById2("HeroAwakenConfig","awakenStage",destLevel,"quality",destQuality)
    },
    getDrillMax:function(destQuality){
        var tmpData = this.getKeysById("HeroAwakenConfig","quality",destQuality)
        var tmpRet = null
        for(const i in tmpData){
            if (tmpRet == null || tmpData[i].trainLevel > tmpRet.trainLevel){
                tmpRet = tmpData[i]
            }
        }
        return tmpRet
    },
    getTuneByTwo:function(destLevel,destQuality){
        return this.getKeyById2("HeroTuneConfig","level",destLevel,"quality",destQuality)
    },
    getTuneByRandom:function(exclusive){
        var tmpData1 = this.getKeysById("TuneTextConfig","exclusiveHero",0)
        var tmpData2 = this.getKeysById("TuneTextConfig","exclusiveHero",exclusive)
        var tmpLens1 = tmpData1.length - 1
        var tmpLens2 = 0
        if (tmpData2){
            tmpLens2 = tmpData2.length - 1
        }
        var tmpidx = Func.random(0,tmpLens1 + tmpLens2)

        var tmpRet = null
        if (tmpidx > tmpLens1){
            tmpRet = tmpData2[tmpidx - tmpLens1]
        }else{
            tmpRet = tmpData1[tmpidx]
        }
        return tmpRet
    },
    getTravelById:function(taskId){
        return this.getKeyById("TravelTaskConfig","id",taskId)
    },
    getCapture:function(otherFight){
        var tmpBi = Math.floor((Gm.heroData.getFightByLineLimit(ConstPb.lineHero.LINE_TRAVEL_CAPTURE)/otherFight)*100)
        var tmpConfig = this.getConfig("HeroCaptureConfig")
        var tmpLens = tmpConfig.length
        for(var i = 1;i < tmpLens;i++){
            var xiao = i - 1
            if (tmpBi >= tmpConfig[xiao].min && tmpBi < tmpConfig[i].min){
                 return tmpConfig[xiao]
            }
        }
        return tmpConfig[tmpLens - 1]
    },
    getUnlockSkills:function(quality){
        var list = this.getKeysById("HeroAwakenConfig","quality",quality)
        var tab = []
        for (let index = 0; index < list.length; index++) {
            const v = list[index];
            if (v.awaken_skill > 0){
                tab.push(v)
            }
        }
        tab.sort(function(a,b){
            return a.awaken_skill - b.awaken_skill
        })
        return tab
    },
    getLockSkill:function(destLevel,destQuality,defaultSkill){
        let tmpData = this.getConfig("HeroAwakenConfig")
        var tmpReturn = defaultSkill
        for(const i in tmpData){
            if (tmpData[i].quality == destQuality){
                if (tmpData[i].awaken_skill && tmpData[i].awaken_skill <= destLevel){
                    tmpReturn = tmpData[i].awaken_skill
                }
            }
        }
        return tmpReturn
    },
    getTypeConfigById:function(id){
        return this.getKeyById("TypeConfig","id",id)
    },
    getTypeConfigByType:function(type){
        return this.getKeysById("TypeConfig","type",type)
    },
    getTypeConfigByType1:function(type,childType){
        var list = this.getTypeConfigByType(type)
        if (childType == null){
            return list
        }
        return Func.forBy(list,"childType",childType)
    },
    getHeroType:function(childType){
        return this.getTypeConfigByType1(1,childType)
    },
    getQuality:function(childType){
        return this.getTypeConfigByType1(2,childType)
    },
    getEquipPart:function(childType){
        return this.getTypeConfigByType1(3,childType)
    },
    getEquipType:function(childType){
        return this.getTypeConfigByType1(4,childType)
    },
    getJobType:function(childType){
        return this.getTypeConfigByType1(5,childType)
    },
    getGodlyType:function(childType){
        return this.getTypeConfigByType1(8,childType)
    },
    getJbType:function(childType){
        return this.getTypeConfigByType1(9,childType)
    },
    getBaseAttr:function(childType){
        return this.getTypeConfigByType1(7,childType)
    },
    getPlayerAttr(childType){
        return this.getTypeConfigByType1(10,childType)
    },
    getDungeonType(childType){
        return this.getTypeConfigByType1(11,childType)
    },
    getDungeonMonster:function(id,mode){
        return this.getKeyById("DungeonMonsterConfig","id",this.getDungeonInfo(id,mode).oneMonsterGroup)
    },
    getTeamType:function(childType){
        return this.getTypeConfigByType1(12,childType)
    },
    getSmeltEquip:function(){
        var list = this.getConfig("RefreshEquipConfig")
        for (let index = 0; index < list.length; index++) {
            const v = list[index];
            if (Gm.userInfo.level >= v.minLevel && Gm.userInfo.level <= v.maxLevel){
                return v
            }
        }
        return list[0]
    },
    getGodly:function(lv,id){
        return this.getKeyById2("GodlyConfig","level",lv,"attributeId",id)
    },
    getGodlyInit:function(part,group){
        return this.getKeyById2("GodlyInitConfig","part",part,"group",group)
    },
    getStrengthen:function(lv){
        return this.getKeyById("StrengthenConfig","id",lv)
    },
    getStrengthenPro:function(lv){
        return this.getKeyById("StrengthenProConfig","level",lv)
    },
    getVip:function(lv){
        return this.getKeyById("VipConfig","id",lv || Gm.userInfo.vipLevel)
    },
    getMinVip:function(name){
        var all = this.getConfig("VipConfig")
        var idx = 0
        for(var i = 0;i < all.length;i++){
            if (all[i][name] > 0){
                idx = i
                break
            }
        }
        return idx
    },
    getVipPackage:function(id){
        return this.getKeyById("VipPackageConfig","id",id)
    },
    buy:function(num){
        var item = this.getKeyById("BuyCostConfig","id",num)
        if(item){
            return item
        }
        var all = this.getConfig("BuyCostConfig")
        return all[all.length-1]
    },
    getGem:function(id){
        return this.getKeyById("GemstoneConfig","id",id)
    },
    getGemShop:function(){
        var list = this.getConfig("GemShopConfig")
        list.sort(function(a,b){
            return a.id-b.id
        })
        return list
    },
    getGemBuy:function(lv){
        return this.getKeyById("GemBuyConfig","id",lv)
    },
    getSuit:function(suitId){
        return this.getKeyById("SuitAttrConfig","id",suitId)
    },
    getProbability:function(lv,num){
        return this.getKeyById2("ProbabilityConfig","level",lv,"num",num)
    },
    getSilverBuy:function(num){
        return this.getKeyById2("ShopSilverBuyValueConfig","id",num)
    },
    getRelateGroupIds(){
        var list = []
        var confs = this.getConfig("HeroRelateConfig")
        for (let index = 0; index < confs.length; index++) {
            const v = confs[index];
            if (Func.indexOf(list,v.idGroup) == -1){
                list.push(v.idGroup)
            }
        }
        list.sort((a,b)=>{
            return a-b
        })
        return list
    },
    getRelateByGroupId(id){
        return this.getKeysById2("HeroRelateConfig","idGroup",id)
    },
    getJbs:function(){
        return this.getConfig("HeroRelateConfig")
    },
    getJbByType:function(type){
        return this.getKeysById("HeroRelateConfig","relateType",type)
    },
    getJbAwards:function(){
        return this.getConfig("HeroRelateRewardConfig")
    },
    getJbsByHeroId:function(heroId){
        var list = this.getJbs()
        var tab = []
        for (let index = 0; index < list.length; index++) {
            const v = list[index];
            for (let i = 0; i < v.sparkCondition.length; i++) {
                const v1 = v.sparkCondition[i];
                if (v1 == heroId){
                    tab.push(v)
                    break
                }
            }
        }
        return tab
    },
    getJbsByNum:function(num){
        var list = this.getJbs()
        var tab = []
        for (let index = 0; index < list.length; index++) {
            const v = list[index];
            if(v.sparkCondition.length == num){
                tab.push(v)
            }
        }
        return tab
    },
    getChat:function(id){
        return this.getKeyById("ChatConfig","id",id)
    },
    getMonthSigns:function(round){
        var list = this.getKeysById("SignRewardConfig","round",round)
        if (list.length == 0){
            var maxRound = 0
            var allList = this.getConfig("SignRewardConfig")
            for (let index = 0; index < allList.length; index++) {
                const v = allList[index];
                if (v.round > maxRound){
                    maxRound = v.round
                }
            }
            list = this.getMonthSigns(maxRound)
        }
        return list
    },
    getSignCount(id){
        if (id){
            return this.getKeyById("SignCountRewardConfig","id",id)
        }
        return this.getConfig("SignCountRewardConfig")
    },
    getWeekSign(day){
        if (day){
            return this.getKeyById("WeekSignConfig","day",day) 
        }
        return this.getConfig("WeekSignConfig")
    },
    getWeekSignTask(group){
        return this.getKeysById("WeekSignTaskConfig","groupNum",group)
    },
    getWeekSignTaskById(taskId){
        return this.getKeyById("WeekSignTaskConfig","taskId",taskId)
    },
    getWeekSignSpeed(id){
        return this.getKeyById("WeekSignSpeedConfig","id",id) 
    },
    // getPayProduct(page){
    //     return this.getKeysById("PayProductConfig","bookmark",page)
    // },
    getPayProductAtyId(activityId){
        return this.getKeyById("PayProductConfig","associationId",activityId)
    },
    getPayProductItemId(itemId){
        return this.getKeyById("PayProductConfig","itemId",itemId)
    },
    getEventPay(id){
        if (id){
            return this.getKeyById("EventPayConfig","id",id)
        }
        return this.getConfig("EventPayConfig")
    },
    getUnionShop(){
        var confs = this.getConfig("AllianceShopConfig")
        var lv = Gm.userInfo.level
        for (let index = 0; index < confs.length; index++) {
            const v = confs[index];
            if (lv >= v.minLevel && lv <= v.maxLevel ){
                return v
            }
        }
    },
    getUnion(lv){
        return this.getKeyById("AllianceConfig","id",lv)
    },
    getUnionBoss(lv){
        return this.getKeyById("AllianceBossConfig","id",lv)
    },
    getUnionBossGroup(id){
        return this.getKeyById("AllianceBossGroupConfig","id",id)
    },
    getLanguage(id){
        return this.getKeyById("LanguageConfig","id",id)
    },
    getWorldBoss(id){
        if (id == null){
            return this.getConfig("WorldBossConfig")
        }
        return this.getKeyById("WorldBossConfig","id",id)
    },
    getWorldBossTimes(){
        return this.getConfig("WorldBossTimeConfig")
    },
    getWorldBossRankAward(){
        return this.getConfig("WorldBossRankingConfig")
    },
    getOpenDungeons(type){
        var date = date = new Date(Gm.userData.getTime_m())
        var list = []
        var month = date.getDate()
        var day = date.getDay()==0?7:date.getDay()
        var confs = this.getConfig("DungeonConfig")

        for (let index = 0; index < confs.length; index++) {
            var v = confs[index]
            if (type && v.type != type){
                continue;
            }
            if (ConstPb.EventOpenType.EVENTOP_FUBEN == type){
                // var openTime = Func.dealConfigTime(v.openTime[0])
                // var closeTime = Func.dealConfigTime(v.closeTime)
                // if (Gm.userData.getTime_m() >= openTime && Gm.userData.getTime_m() < closeTime){
                //     list.push(v)    
                // }
                list.push(v) 
                continue
            }

            var flag = false
            var num
            if (v.clientOpenTime[0].type == 0){ //周
                num = day
            }else if (v.clientOpenTime[0].type ==1){ //月
                num = month
            }else if (v.clientOpenTime[0].type == 2){
                flag = true
            }
            if (num){
                for (let i = 0; i < v.clientOpenTime.length; i++) {
                    const v1 = v.clientOpenTime[i];
                    if (v1.arg == num){
                        flag = true
                        break
                    }
                }
            }
            if (flag){
                list.push(v)
                // if (type){
                //     list.push(v)
                // }else{
                //     for (let index = 0; index < v.openTime.length; index++) {
                //         const openTime = v.openTime[index];
                //         if (Gm.userData.getDayPassTime() >= openTime.time && Gm.userData.getDayPassTime() < openTime.time + v.duration  ){
                //             list.push(v)
                //         }
                //     }
                // }
            }
        }
        return list
    },
    getDungeon(id){
        return this.getKeyById("DungeonConfig","id",id)
    },
    getDungeonInfo(dungeonId,mode){
        var item = this.getKeyById2("DungeonInfoConfig","dungeonId",dungeonId,"mode",mode)
        if (item){
            var info = this.getDungeon(dungeonId)
            if (info){
                item.name = info.name
            }
        }
        return item
    }, 
    getDungeonGroups(dungeonId){
        return this.getKeysById("DungeonInfoConfig","dungeonId",dungeonId)
    },
    getDungeonStarRewardConfig(dungeonId,index){
        var list = this.getKeysById("DungeonStarRewardConfig","dungeonId",dungeonId)
        list.sort(function(a,b){
            return a.id - b.id
        })
        if (index != null){
            return list[index]
        }
        return list
    },
    getItemByRuneId(runeId){
        return this.getKeyById2("ItemConfig","type",126,"childType",runeId)
    },
    getItemsByRune(list){
        var items = this.getItemsByType(126)
        var result = []
        for (let i = 0; i < list.length; i++) {
            const v = list[i];
            for (let j = 0; j < items.length; j++) {
                const v1 = items[j];
                if(v.id == v1.childType && Gm.bagData.getNum(v1.id) > 0 ){
                    result.push(v1)
                    break
                }
            }
        }
        return result
    },
    getItemType(show){
        var list = this.getKeysById("ItemTypeConfig","show",show)
        var result = []
        for (let index = 0; index < list.length; index++) {
            const v = list[index];
            result.push(v.id)
        }
        return result
    },
    getMarquee(id){
        return this.getKeyById("MarqueeConfig","id",id)
    },
    getTowerGroup(group){
        if (group == null){
            return this.getConfig("TowerMapGroupConfig")
        }
        return this.getKeyById("TowerMapGroupConfig","group",group)
    },
    getTower(id){
        if (id == null){
            return this.getConfig("TowerMapConfig")
        }
        return this.getKeyById("TowerMapConfig","id",id)
    },
    attrIdToKey(attrId){
        var typeData = this.getBaseAttr(attrId)
        return typeData.systemName
    },
    attrKeyToId(attrKey){
        return this.getKeyById("TypeConfig","systemName",attrKey)
    },
    getEventPayReward(childType,startLevel){
        var list
        if (startLevel){
            list = this.getKeysById2("EventPayRewardConfig","childType",childType,"startLevel",startLevel)
        }else{
            list = this.getKeysById("EventPayRewardConfig","childType",childType)
        }
        
        list.sort((a,b)=>{
            return a.id - b.id
        })
        return list
    },
    getEventPayRewardStartLevel(childType,startLevel){
        var list = []
        var data = this.getEventPayReward(childType)
        var firtStartLevl = -1
        for(var i=data.length-1;i>=0;i--){
            if(data[i].startLevel <= startLevel && firtStartLevl== -1){
                firtStartLevl = data[i].startLevel
                for(;i>=0;i--){
                    if(data[i].startLevel == firtStartLevl){
                        list.push(data[i])
                    }
                    else{
                        break
                    }
                }
                break
            }
        }
        return list
    },
    getEventPayRewardId(id){
        return this.getKeyById("EventPayRewardConfig","id",id)
    },
    getEventType(){
        var list = this.getConfig("EventTypeConfig")
        list.sort((a,b)=>{
            return a.id - b.id
        })
        return list
    },
    getEventTypeByType(type){
        return this.getKeyById("EventTypeConfig","type",type)
    },
    getEventPay(childType){
        return this.getKeyById("EventPayConfig","childType",childType)
    },
    getRewardShowConfig(id){
        var item = this.getKeyById("RewardShowConfig","id",id || 1001)
        if (item == null){
            item = this.getKeyById("RewardShowConfig","id",1001)
        }
        return item
    },
    getFilterWorld(){
        var list = []
        var conf = this.getConfig("DictionaryConfig")
        if(conf){
            for (let index = 0; index < conf.length; index++) {
                list.push(conf[index].dictionary)
            }
        }
        return list
    },
    getBuyForm(groupId){
        var list = this.getKeysById("BugFormConfig","id",groupId)
        list.sort(function(a,b){
            return a.id - b.id
        })
        return list
    },
    getPicturePuzzle(id){
        return this.getKeyById("PicturePuzzleConfig","id",id)
    },
    getPicturePuzzleGroup(group){
        return this.getKeysById("PicturePuzzleConfig","group",group)
    },
    getPuzzlePos(type){
        var list = this.getKeysById("PuzzleConfig","type",type)
        list.sort(function(a,b){
            return a.position - b.position
        })
        return list
    },
    getPictureEvent(id){
        return this.getKeyById("PictureEventConfig","id",id)
    },
    getPictureEventGroup(id){
        return this.getKeyById("PictureEventGroupConfig","id",checkint(id))
    },
    getModuleShop(shopType){
        var list = []
        var conf = this.getConfig("ModuleShopConfig")
        for (let index = 0; index < conf.length; index++) {
            const v = conf[index];
            if (v.shopType == shopType && Gm.userInfo.maxMapId >= v.minMapId && Gm.userInfo.maxMapId <= v.maxMapId){
                list.push(v)
            }
        }
        list.sort(function(a,b){
            return b.index - a.index
        })
        return list
    },
    getEventGroup(id){
        if (id == null){
            var list = this.getConfig("EventGroupConfig")
            list.sort(function(a,b){
                return a.sort - b.sort
            })
            return list
        }
        return this.getKeyById("EventGroupConfig","id",checkint(id))
    },
    getEventGroupsByType(type){
        if (type == null){
            return this.getEventGroup()
        }
        var list = this.getKeysById("EventGroupConfig","type",type)
        list.sort(function(a,b){
                return a.sort - b.sort
            })
        return list
    },
    getEventSign(){
        return this.getConfig("EventSignConfig")
    },
    getEventTasksByDay(day){
        var list = this.getConfig("TaskConfig")
        var result = []
        for (let index = 0; index < list.length; index++) {
            const v = list[index];
            if (v.day == day){
                if (Func.indexOf(result,v.conditionType) ==-1 ){
                    result.push(v.conditionType)
                }
            }
        }
        return result
    },
    getEventTasksByType(type,day){
        return this.getKeysById2("TaskConfig","conditionType",type,"day",day)
    },
    getPictureHelp(queueId){
        return this.getKeysById("PictureHelpConfig","queueGroup",queueId)
    },
    getDrawBoxReward:function(mode,times){
        var tmpRet = this.getKeysById("DrawBoxRewardConfig","mode",mode)
        var tmpIdx = tmpRet.length - 1
        for(const i in tmpRet){
            if (times < tmpRet[i].times){
                tmpIdx = checkint(i)
                break
            }
        }
        return tmpRet[tmpIdx]
    },
    getDrawBoxRewardBy2:function(mode,times){
        return this.getKeyById2("DrawBoxRewardConfig","mode",mode,"times",times)
    },
    getTerms(){
        return this.getConfig("TermsConfig")
    },
    getTermsByID(id){
        return this.getKeysById("TermsConfig","id",id)
    },
    UserAuthenticateConfig(account,password){
        return this.getKeyById2("UserAuthenticateConfig","account",account,"password",password)  
    },
    getMainStory(){
        return this.getConfig("MainStoryConfig")
    },
    getStoryList(){
        return this.getConfig("StoryListConfig")
    },
    getStoryListByType(type){
        return this.getKeysById("StoryListConfig","type",type)
    },
    getStoryListByUnlockMap(map){
        return this.getKeyById("StoryListConfig","unlockMap",map)
    },
    getServerGate(appType){
        return this.getKeyById("ServerGateConfig","appType",checkint(appType))
    },
    getAllQulityHero:function(){
        var list = this.getConfig("HeroQualityConfig")
        return list
    },
    getLimitGiftId(id){
        return this.getKeyById("LimitGiftConfig","id",id)
    },


    //工会竞技
    getAllianceIslandsConfig(){//
        return this.getConfig("AllianceIslandsConfig")
    },
    getAllianceIslandsConfigById(id){
          return this.getKeyById("AllianceIslandsConfig","group",id)
    },
    getAllianceIslandsMonsterConfig(){
        return this.getConfig("AllianceIslandsMonsterConfig")
    },
    getAllianceIslandsMonsterConfigById(id){
        return this.getKeyById("AllianceIslandsMonsterConfig","id",id)
    },
    //获取公会竞技岛屿某岛屿
    getAllianceIslandsMonsterConfigByGroup(groupIndex){
        let config = this.getAllianceIslandsMonsterConfig()
        let tempConfig = []
        for(var i=0;i<config.length;i++){
            if(config[i].group == groupIndex){
                tempConfig.push(config[i])
            }
        }
        return tempConfig
    },
    //获得公会竞技岛屿某层 earningsId(难度)
    getAllianceIslandsMonsterConfigByEarningsID(groupIndex,floorIndex,earningsId){
        var data = this.getAllianceIslandsMonsterConfigByGroup(groupIndex)
        for(var i=0;i<data.length;i++){
            if(data[i].earnings == earningsId && data[i].score == floorIndex){
               return data[i]
            }
        }
        return null
    },  
    //获取公会竞技某岛屿某层的怪物 (通过主编号id)
    getIslandTowerMonsters(id){
        var data = this.getAllianceIslandsMonsterConfig()
        var tempConfig = []
        for(var i=0;i<data.length;i++){
            if(data[i].id == id){
                tempConfig = data[i].monsterIds
                break
            }
        }
        return tempConfig
    },
    //获取公会竞技排行榜配置数据
    getAllianceRankRewardConfig(){
        return this.getConfig("AllianceRankRewardConfig")
    },
    getAllianceTaskActiveConfig(){
        return this.getConfig("DailyTaskActiveConfig")
    },
    getAllianceTaskActiveConfigById(id){
        return this.getKeyById("DailyTaskActiveConfig","id",id)
    },
    getAllianceIslandReward(group){
        return this.getKeyById("AllianceIslandsRewordConfig","id",group)
    },
    getAllianceIslandRewardConfig(group,score){
        var data = this.getConfig("AllianceIslandsRewordConfig")
        for(var i=0;i<data.length;i++){
            if(data[i].group == group && data[i].score == score){
                return data[i]
            }
        }
        return null
    },

    getHeroSortById:function(id){
        var v = this.getKeyById("HeroConfig","id",id)
        if(v){
            return v.sort
        }
    },
    getHeroByType:function(type) {
        var data  = this.getConfig("HeroConfig")
        var temp = []
        for(var i=0;i<data.length;i++){
            if(data[i].type == type){
                temp.push(data[i])
            }
        }
        return temp
    },
    getHomePageViewConfig(id){
        return this.getKeyById("HomePageConfig","id",id)
    },
    getHomePageViewCount(){
        return this.getConfig("HomePageConfig").length
    },
    getHeroFeelByLv(baseId,lv){
        var list = this.getKeysById("HeroIntimateConfig","heroId",baseId)
        list.sort(function(a,b){
            return a.intimateLv - b.intimateLv
        })
        if (lv == null){
            return list
        }
        return Func.forBy(list,"intimateLv",lv)
    },
    getHeroCollect(quality){
        if (quality == null){
            return this.getConfig("HeroCollectConfig")
        }
        return this.getKeyById("HeroCollectConfig","quality",quality)
    },
    getHomesteadConfig(){
        return this.getConfig("HomesteadConfig")
    },

    //专属武器
    getWeaponUpLevelConfig(id){
        return this.getKeyById("WeaponUpLevelConfig","id",id)
    },
    //找属性条数
    getWeaponUpLevelBaseAttrMinLevel(attrNum){
        var data = this.getConfig("WeaponUpLevelConfig")
        for(var i=0;i<data.length;i++){
            if(data[i].baseAttr.length == attrNum){
                return data[i]
            }
        }
        return null
    },
    getWeaponMaxLevel(){
        var data = this.getConfig("WeaponUpLevelConfig")
        return data[data.length-1].level
    },
    getWeaponUpLevelConfigByWeaponAndLevel(weaponId,level){
        var maxLevel = this.getWeaponMaxLevel()
        level = Math.min(level,maxLevel)
        var data =  this.getConfig("WeaponUpLevelConfig")
        for(var i=0;i<data.length;i++){
            if(data[i].weaponId == weaponId  && data[i].level == level){
                return data[i]
            }
        }
        return null
    },
    getWeaponCostConfig(level,camp){
        var maxLevel = this.getWeaponMaxLevel()
        level = Math.min(level,maxLevel)
        var data =  this.getConfig("WeaponCostConfig")
        for(var i=0;i<data.length;i++){
            if(data[i].level == level  && data[i].camp == 0){
                return data[i]
            }
        }
        for(var i=0;i<data.length;i++){
            if(data[i].level == level  && data[i].camp == camp){
                return data[i]
            }
        }
        return null
    },
    getWeaponDescConfig(weaponId){
        return this.getKeyById("WeaponDescConfig","weaponId",weaponId)
    },
    getHeroHistoryByBaseId(baseId){
        return this.getKeyById("HistoryConfig","id",baseId)
    },

    getBingoDataByTurn(turn){
        var id = 0
        var data = {}
        do{
           data =  this.getKeyById("BingoConfig","id",++id)
        }while(!(data.minTurn <= turn && turn <= data.maxTurn))
        
        return data
    },

    getBingoConfig(){
        return this.getConfig("BingoConfig")
    },


      //水晶秘境
    getOreConfigByType(type){
        var data = this.getConfig("OreRoomConfig")
        for(var i=0;i<data.length;i++){
            if(data[i].type == type){
                return data[i]
            }
        }
    },
    getOreConfigById(id){
        return this.getKeyById("OreConfig","oreId",id)
    },
    getOreMonsterConfig(id){
         return this.getKeyById("OreMonsterConfig","monsterId",id)
    },
    getOreBuffConfig(number){
        return this.getKeyById("OreBuffConfig","number",number)
    },
    getOreAwardConfig(){
        return this.getConfig("OreAwardrConfig")
    },
    getZhenFaBossById(id){
        return this.getKeyById("ZhenFaBossConfig","id",id)
    },
    getZhenFaBossHeroById(id){
        if (id){
            return this.getKeyById("ZhenFaHelpHeroConfig","id",id)
        }
        return this.getConfig("ZhenFaHelpHeroConfig") 
    },
    getZhenFaBossRecommendById(id){
        return this.getKeyById("ZhenFaRecommendConfig","id",id)
    },
    getOreServerConfig(){
        return this.getConfig("OreServerConfig")
    },
    getOreTestConfig(){
        return this.getConfig("OreTimeConfig")
    },

    getLimitMarketConfigById(id){
        return this.getKeyById("LimitMarketConfig","id",id)
    },
    getLimitMarketConfig(){
        return this.getConfig("LimitMarketConfig")
    },
    getOnlineRwardById(id){
        return this.getKeyById("OnlineRewardConfig","id",id)
    },

    //同盟争霸
    getAllianceWarStageConfig(stageType){
        return this.getKeyById("AllianceWarStageConfig","stageType",stageType)
    },
    getAllianceWarCityConfig(warID){
        if(warID){
            return this.getKeyById("AllianceWarCityConfig","warID",warID)
        }
        return this.getConfig("AllianceWarCityConfig")
    },
    getAllianceWarCitysConfig(type){
        return this.getKeysById(AllianceWarCityConfig,"type",type)
    },
    getAllianceWarRandomConfig(group){
        return this.getKeyById("AllianceWarRandomConfig","group",group)
    },
    getAllianceWarRankingConfig(id){
        if(id){
            return this.getKeyById("AllianceWarRankingConfig","id",id)
        }
        return this.getConfig("AllianceWarRankingConfig")
    },
    getAllianceWarInspireConfig(){
        return this.getConfig("AllianceWarInspireConfig")
    },
    getAccumulativePayConfig(type){
        var config = this.getConfig("FirstPayConfig")
        var data = []
        for(let key in config){
            if(config[key].type == type){
                data.push(config[key])
            }
        }
        return data
    },

    //根据ID返回首充和累充奖励的Type
    getPayRewardTypeById(id){
        var config = this.getConfig("FirstPayConfig")
        for(let key in config){
            if(config[key].id == id){
                return config[key].type
            }
        }
    },

    getAccumulativePayConfigById(id){
        return this.getKeyById("FirstPayConfig","id",id)
    },

    getAccuPayBattleById:function(Id){
        return this.getConfig("AccuVirtualBattleConfig"+Id)
    },


    //获取后台的配置
    getBackConfig(){
        return this.getConfig("NetworkConfig")
    }

});
