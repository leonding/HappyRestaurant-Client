var HeroInfo = require("HeroInfo")
cc.Class({
    properties: {
       
    },
    ctor:function(){

    },
    clearData:function(){
        this.heros = []
        this.lineHeros = [] //上阵列表
        this.heroChips = [] //碎片列表
        this.reservations = {} //预约信息
        this.relates = [] //羁绊数据
        this.relateReds = [] //羁绊红点
        this.poolInfo = [{heroId:0,unloadTime:0}]// 共鸣水晶池
        this.m_backupHeros = [] //备份
        this.m_oWeaponLevel = [];
    },
    isBagSize(){
        return this.heros.length >= Gm.userInfo.heroBagSize
    },
    setReserv(data){
        this.reservations[data.baseId] = data.reservation
    },
    getReserv(baseId){
        return this.reservations[baseId]
    },
    getCanUnlockHero:function(){
        var list = []
        for (let index = 0; index < this.heroChips.length; index++) {
            const v = this.heroChips[index];
            if (this.getHeroByBaseId(v.baseId) == null){
                var hero = Gm.config.getHero(v.baseId)
                if (hero && v.num >= hero.hero_chip_num){
                    v.chipOpen = true
                    list.push(v)
                }
            }
        }
        return list
    },
    getChipNum:function(id){
        var chip = this.getChip(id)
        return chip?chip.num:0
    },
    getChipByBag(){
        var list = []
        for (let index = 0; index < this.heroChips.length; index++) {
            const v = this.heroChips[index];

            var newChip = {}
            Func.dataMerge(newChip,v)
            newChip.count = newChip.num

            list.push(newChip)
        }
        return list
    },
    getChip:function(id){
        return Func.forBy(this.heroChips,"baseId",id)
    },
    subChip:function(data){
        var chip = this.getChip(data.baseId)
        if (chip){
            chip.num = chip.num - data.num
            if (chip.num <=0){
                Func.forRemove(this.heroChips,"baseId",data.baseId)
            }
        }
    },
    changeChip:function(data){
        var chip = this.getChip(data.baseId)
        if (chip){
            chip.num = chip.num + data.num
        }else{
            this.heroChips.push(data)
        }
    },
    initHeroChip:function(_heros){
        for (let index = 0; index < _heros.length; index++) {
            const v = _heros[index];
            var chip = this.getChip(v.baseId)
            if (chip==null){
                chip = {}
                Func.dataMerge(chip,v)
                this.heroChips.push(chip)
            }else{
                Func.dataMerge(chip,v)
            }
        }
        this.setLocalCultrue()
    },
    getMaxHeroLv(){
        var lv = 0
        for (let index = 0; index < this.heros.length; index++) {
            const v = this.heros[index];
            if (v.level > lv){
                lv = v.level
            }
        }
        return lv
    },
    removeHero(heroId){
        for (let index = 0; index < this.heros.length; index++) {
            const v = this.heros[index];
            if (v.heroId == heroId){
                this.heros.splice(index,1)
                for (let i = 0; i < v.equipInfos.length; i++) {
                    Gm.bagData.addEquip(v.equipInfos[i])
                }
            }
        }
        for (let index = 0; index < this.lineHeros.length; index++) {
            const v = this.lineHeros[index];
            for (let i = 0; i < v.hero.length; i++) {
                const id = v.hero[i];
                if (heroId == id){
                    v.hero[i] = 0
                    break
                }
            }
        }
        this.resetPoolByHeroId(heroId)
        Gm.pictureData.removeHero(heroId)
        Gm.unionData.removeHero(heroId)
        Gm.friendData.removeAid(heroId)
    },
    initHero:function(_heros){
        for (let index = 0; index < _heros.length; index++) {
            const v = _heros[index];
            var hero = this.getHeroById(v.heroId)
            if (hero){
                hero.setData(v)
            }else{
                hero = new HeroInfo()
                hero.setData(v)
                this.heros.push(hero)
            }
        }
        Gm.heroData.getPoolLay()
        this.setLocalCultrue()
        Gm.send(Events.All_FIGHT_UPDATE)
    },
    initLineHeros:function(list){
        this.lineHeros = list || []
    },

    initUnLockHero(list){
        this.m_UnLockHeros = list || []
    },

    getUnLockHero(){
        return this.m_UnLockHeros || []
    },
    addUnLockHero(heroInfos){
          for (let index = 0; index < heroInfos.length; index++) {
                const v = heroInfos[index];
                var heroData = Gm.heroData.getHeroById(v.heroId)
                this.m_UnLockHeros.push(heroData.qualityId)
            }
    },

    queryUnlockHeroByBaseId(id){
        for(const index in this.m_UnLockHeros){
            let qualityId = this.m_UnLockHeros[index] 
            let baseId = parseInt(qualityId/ 1000) 
            if(baseId == id){
                return qualityId
            }
        }
        return 0
    },

    setLineHero:function(data){
        var flag = true
        for (let index = 0; index < this.lineHeros.length; index++) {
            const v = this.lineHeros[index];
            if (v.type == data.type){
                this.lineHeros[index] = data
                flag = false
            }
        }
        if (flag){
            this.lineHeros.push(data)
        }
    },
    getFightByLineType:function(type){
        var team = this.getLineByType(type)
        var fight = 0
        if (team){
            for (let index = 0; index < team.hero.length; index++) {
                var hero = this.getHeroById(team.hero[index])
                if (hero){
                    fight = fight + hero.getAttrValue(203)
                }
            }
        }
        return fight
    },
    getFightByLineLimit:function(type){
        var team = this.getLineWithLimit(type)
        var fight = 0
        if (team){
            for (let index = 0; index < team.hero.length; index++) {
                var hero = this.getHeroById(team.hero[index])
                if (hero){
                    fight = fight + hero.getAttrValue(203)
                }
            }
        }
        return fight
    },
    getFightAll(){
        var fight = 0
        if(this.heros){
            for (let index = 0; index < this.heros.length; index++) {
                const v = this.heros[index];
                fight = fight + v.getFight()
            }
        }
        return fight
    },
    getLineByType:function(type){
        return Func.forBy(this.lineHeros,"type",type)
    },
    limitExcept:function(type){
        if (type != ConstPb.lineHero.LINE_DEFEND){
            return true
        }else{
            return false
        }
    },
    getLineWithLimit:function(type){
        var heros = Func.copyArr(Func.forBy(this.lineHeros,"type",type))
        // if (heros && this.limitExcept(type)){
        //     for(const i in heros.hero){
        //         var cheack = Gm.travelData.cheackHero(heros.hero[i])
        //         if (cheack != 1){
        //             heros.hero[i] = 0
        //         }
        //     }
        // }
        return heros
    },
    getBossLineHeros:function(){
        var line = this.getLineByType(ConstPb.lineHero.LINE_BOSS)
        if (line){
            return line.hero
        }
        return []
    },
    getAllLimit:function(typeList){
        var heros = Func.copyArr(this.getAll())
        var tmpList = Gm.travelData.m_tHeroList
        if (heros){
            var remove = []
            for(const i in heros){
                var cheack = Gm.travelData.cheackHero(heros[i].heroId,typeList)
                if (cheack != 1){
                    remove.push(i)
                }
            }
            var tmpCounts = 0
            for(const i in remove){
                heros.splice(remove[i] - tmpCounts,1)
                tmpCounts = tmpCounts + 1
            }
        }
        return heros
    },
    getPoolFight(){
        var fight = 0
        if(this.heros && this.poolInfo){
            for(const i in this.poolInfo){
                for (let index = 0; index < this.heros.length; index++) {
                    if (this.poolInfo[i].heroId == this.heros[index].heroId){
                        fight = fight + this.heros[index].getFight()
                        break
                    }
                }
            }
        }
        return fight
    },
    isInPool:function(heroId){
        for(const i in this.poolInfo){
            if (this.poolInfo[i].heroId == heroId){
                return true
            }
        }
        return false
    },
    resetPoolByHeroId:function(heroId){
        for(const i in this.poolInfo){
            if (this.poolInfo[i].heroId == heroId){
                this.poolInfo[i].heroId = 0
                this.poolInfo[i].unloadTime = 0
            }
        }
    },
    getHeroMaxLevel:function(){
        var maxQuality = Gm.config.getConst("crystal_max_quality")
        var counts = 0
        var maxLevel = 0
        for(var i in this.heros){
            var conf = Gm.config.getHero(this.heros[i].baseId,this.heros[i].qualityId)
            if (conf.quality >= maxQuality){
                counts++
                maxLevel = conf.max_level
            }
        }
        return maxLevel + counts * Gm.config.getConst("crystal_level_limit_value")
    },
    getPoolLay:function(){
        var tops = []
        var lost = []
        this.m_iPoolLevel = 999
        if (this.crystalLevel){
            this.m_iPoolLevel = this.crystalLevel
            for(const i in this.heros){
                if (!this.isInPool(this.heros[i].heroId)){
                    lost.push(this.heros[i])
                }
            }
        }else{
            this.heros.sort(function(a,b){
                return b.level - a.level
            })
            for(const i in this.heros){
                var tmpIdx = -1
                for(const j in tops){
                    if (this.heros[i].level > tops[j].level){
                        tmpIdx = checkint(j)
                        break
                    }
                }
                if (tmpIdx == -1){
                    if (tops.length < 6){
                        if (this.m_iPoolLevel > this.heros[i].level){
                            this.m_iPoolLevel = this.heros[i].level
                        }
                        tops.push(this.heros[i])
                    }else{
                        if (!this.isInPool(this.heros[i].heroId)){
                            lost.push(this.heros[i])
                        }
                    }
                }else{
                    if (this.m_iPoolLevel > this.heros[i].level){
                        this.m_iPoolLevel = this.heros[i].level
                    }
                    tops.splice(tmpIdx,0,this.heros[i])
                    lost.push(tops.splice(tops.length - 1,1)[0])
                }
            }
        }
        for(const i in tops){
            for(const j in this.poolInfo){
                if (this.poolInfo[j].heroId == tops[i].heroId){
                    this.poolInfo[j].heroId = 0
                    this.poolInfo[j].unloadTime = 0
                    break
                }
            }
        }
        if (!Func.isUnlock("CrystalView")){
            this.m_iPoolLevel = 1
        }
        return {tops:tops,list:lost}
    },
    isBossLineByBaseId:function(baseId){
        var list = this.getBossLineHeros()
        for (let index = 0; index < list.length; index++) {
            const heroId = list[index];
            var hero = this.getHeroById(heroId)
            if (hero && hero.baseId == baseId){
                return true
            }
        }
        return false
    },
    isBossLineByheroId(heroId){
        var list = this.getBossLineHeros()
        for (let index = 0; index < list.length; index++) {
            if (heroId == list[index]){
                return true
            }
        }
        return false
    },
    getHeroById:function(id){
        return Func.forBy(this.heros,"heroId",id)
    },
    getHeroByBaseId:function(id){
        return Func.forBy(this.heros,"baseId",id)
    },
    getHeroMaxBaseId:function(id){
        var idx = -1
        var quality = 0
        for (let index = 0; index < this.heros.length; index++) {
            const v = this.heros[index];
            if (v.baseId == id && quality < v.qualityId){
                quality = v.qualityId
                idx = index
            }
        }
        if (this.heros[idx]){
            return this.heros[idx]
        }
    },
    getHeroByQualityId(qualityId){
        return Func.forBy(this.heros,"qualityId",qualityId)
    },
 
    getHerosByQualityId(qualityId){
        var list = []
        for (let index = 0; index < this.heros.length; index++) {
            const v = this.heros[index];
            if (v.qualityId == qualityId){
                list.push(v)
            }
        }
        return list
    },
    getHerosByBaseId(baseId){
        var list = []
        for (let index = 0; index < this.heros.length; index++) {
            const v = this.heros[index];
            if (v.baseId == baseId){
                list.push(v)
            }
        }
        return list
    },
    //获得大于等于该英雄品质的英雄
    getGreatThanEqualHeros(qualityId){
        var baseId = parseInt(qualityId/1000)
        var list = this.getHerosByBaseId(baseId)
        var ret = []
        for (let index = 0; index < list.length; index++) {
            const v = list[index];
            if (v.qualityId >= qualityId){
                ret.push(v)
            }
        }
        return ret
    },
    getAll:function(){
        var tmpNone = []
        for(const i in this.heros){
            if (this.heros[i].attribute.length == 0){
                tmpNone.push(this.heros[i].heroId)
            }
        }
        if (tmpNone.length > 0){
            Gm.heroNet.getHero(0,tmpNone)
        }
        return this.heros
    },


    // 获取hero去重后的数据
    // 同一baseId取最优品级
    getUniqueHeros(){
        var unique = {}
        var copyHero = []
        for(let i = 0; i < this.heros.length; ++i){
            if( unique[this.heros[i].baseId] && this.heros[i].qualityId > unique[this.heros[i].baseId].qualityId ){
                let index  = unique[this.heros[i].baseId].index
                copyHero[index] = this.heros[i]
                unique[this.heros[i].baseId] = this.heros[i]
                unique[this.heros[i].baseId].index = index
            }else if( !unique[this.heros[i].baseId] ){
                copyHero[copyHero.length] = this.heros[i]
                unique[this.heros[i].baseId] = this.heros[i]
                unique[this.heros[i].baseId].index = copyHero.length-1
            }

        }
        return copyHero
    },

    //获取重复的英雄去掉品级ID相同的
    getDupliHeros(){
        var copyHero = []
        var herosUniqueHeros = this.getUniqueHeros()
        for(const index in herosUniqueHeros){
            let hero = Gm.config.getQulityHero(herosUniqueHeros[index].qualityId)
            let quality = hero.quality 
            let idGroup = hero.idGroup
            let skins = Gm.config.getSkins(idGroup)
            skins.sort((a,b)=>{
                if(a.type == b.type){
                    return a.quality - b.quality 
                }else{
                    if(a.type == 1){
                        return 1
                    }else if(b.type == 1){
                        return -1
                    }
                }
               
            })
            for(const skinIndex in skins){
                if( skins[skinIndex].type == 0 && skins[skinIndex].quality <= quality || 
                    skins[skinIndex].type == 1 && Gm.userInfo.hasSkinById(skins[skinIndex].id)){
                    let qualityHero = Gm.config.getGroupHeroBySkin(skins[skinIndex].id)
                    copyHero[copyHero.length] = qualityHero[0]
                }

            }
        }
        return copyHero
    },

    
    saveCultrue:function(destData,heroId){
        if (destData){
            var hero = this.getHeroById(heroId)
            for(const i in hero.cultureAttribute){
                var tmpId = hero.cultureAttribute[i].attrId
                for(const j in destData){
                    if (destData[j].attrId == tmpId){
                        hero.cultureAttribute[i].attrValue = destData[j].attrValue
                        break
                    }
                }
            }
        }
    },
    setLocalCultrue:function(destData){
        this.m_oLocalCul = destData
    },
    saveLocalCultrue:function(heroId){
        if (this.m_oLocalCul){
            var hero = this.getHeroById(heroId)
            for(const i in hero.cultureAttribute){
                var tmpId = hero.cultureAttribute[i].attrId
                var tmpTotal = hero.cultureAttribute[i].attrValue
                for(const j in this.m_oLocalCul){
                    if (this.m_oLocalCul[j].attrId == tmpId){
                        hero.cultureAttribute[i].attrValue = tmpTotal + this.m_oLocalCul[j].attrValue
                        break
                    }
                }
            }
        }
        this.m_oLocalCul = null
    },
    setRelates(list){
        this.relates = list
    },
    getRelateByGroupId(idGroup){
        var data = Func.forBy(this.relates,"idGroup",idGroup)
        if (data == null){
            data = {idGroup:idGroup,heroRelate:[]}
            this.relates.push(data)
        }
        return data
    },
    setRelateGroup(groupData){
        var data = this.getRelateByGroupId(groupData.idGroup)
        var isInsert = true
        for (let index = 0; index < data.heroRelate.length; index++) {
            const v = data.heroRelate[index];
            if (v.heroGroupId == groupData.heroRelate[0].heroGroupId){
                data.heroRelate[index] = groupData.heroRelate[0]
                isInsert = false
                break
            }
        }
        if (isInsert){
            data.heroRelate.push(groupData.heroRelate[0])
        }
    },
    getRelateAidNum(playerId){
        var aidNum = 0
        for (let index = 0; index < this.relates.length; index++) {
            const v = this.relates[index];
            for (let i = 0; i < v.heroRelate.length; i++) {
                const v1 = v.heroRelate[i];
                if (v1.playerId == playerId){
                    aidNum = aidNum + 1
                }
            }
        }
        return aidNum
    },
    setRelateReds(list){
        for (let index = 0; index < list.length; index++) {
            const v = list[index];
            var groupData = this.getRelateRedByGroupId(v.idGroup)
            for (let i = 0; i < v.heroRelate.length; i++) {
                const v1 = v.heroRelate[i];
                var heroRelate = Func.forBy(groupData.heroRelate,"heroGroupId",v1.heroGroupId)
                if (heroRelate == null ){
                    heroRelate = {}
                    groupData.heroRelate.push(heroRelate)
                }
                heroRelate.heroGroupId = v1.heroGroupId
                heroRelate.state = v1.state
            }
        }
    },
    getRelateRedByGroupId(idGroup){
        var data = Func.forBy(this.relateReds,"idGroup",idGroup)
        if (data == null){
            data = {idGroup:idGroup,heroRelate:[]}
            this.relateReds.push(data)
        }
        return data
    },
    getHeroFight(qualityId){
        return Func.random(100,10000)
    },
    toHeroInfo(heroData){
        var hero = new HeroInfo()
        hero.setData(heroData)
        return hero
    },
    isFlyLock(heroId){
        if (this.isline(ConstPb.lineHero.LINE_BOSS,heroId)){
            return true
        }
        return false
    },
    isline(lineType,heroId){
        var lineHero = this.getLineByType(lineType)
        if (lineHero){
            if (Func.indexOf(lineHero.hero,heroId) > -1){
                return true
            }
        }
        return false
    },
    heroFlyAll(){
        var list = []
        for(const i in this.heros){
            var v = this.heros[i]
            // if (v.baseId != 1306){
            //     continue
            // }
            var heroConf = Gm.config.getHero(v.baseId,v.qualityId)

            var newData = {}
            newData.heroId = v.heroId
            newData.baseId = v.baseId
            newData.qualityId = v.qualityId
            newData.level = v.level
            newData.lock = v.lock
            newData.skin = v.skin

            newData.quality = heroConf.quality
            newData.camp = heroConf.camp
            newData.job= heroConf.job

            newData.isLine = HeroFunc.flyLockType(newData) > 0

            list.push(newData)
        }
        list.sort(function(a,b){
            if (b.level == a.level){
                if (a.quality == b.quality){
                    if (a.camp == b.camp){
                        return a.baseId - b.baseId
                    }
                    return b.camp - a.camp
                }else{
                    return b.quality - a.quality
                }
            }else{
                return b.level - a.level
            }
        })
        return list
    },
    heroWishAll(id,filter,job){
        var list = []
        // 查找抽卡池中的女神
        var lotteryCfg = Gm.config.getLotteryConfig(id)
        var groupIds = []
        for(var i = 0; i < lotteryCfg.itemGroup.length; i++){
            groupIds.push(lotteryCfg.itemGroup[i].type)
        }
        for(var i = 0; i < lotteryCfg.payItemGroup.length; i++){
            groupIds.push(lotteryCfg.payItemGroup[i].type)
        }
        groupIds.push(lotteryCfg.ensureGroup)
        var pkgGroups = []
        for(var i = 0; i < groupIds.length; i++){
            var pkgCfg = Gm.config.getPrizeGroupsConfig(groupIds[i])
            for(var j = 0; j < pkgCfg.length; j++){
                if(Gm.userInfo.maxMapId >= pkgCfg[j].minMapId && Gm.userInfo.maxMapId <= pkgCfg[j].maxMapId){
                    pkgGroups.push(pkgCfg[j])
                }
            }
        }
        var heroIds = []
        var hero_synthetise_list_quality = Gm.config.getConst("hero_synthetise_list_quality")
        for(var i = 0; i < pkgGroups.length; i++){
            for(var j = 0; j < pkgGroups[i].itemInfo.length; j++){
                if(pkgGroups[i].itemInfo[j].id % 10 >= hero_synthetise_list_quality && heroIds.indexOf(pkgGroups[i].itemInfo[j].id) == -1){
                    heroIds.push(pkgGroups[i].itemInfo[j].id)
                }
            }
        }
        for(const i in heroIds){
            var qualityId = heroIds[i]
            var baseId = parseInt(qualityId/1000)
            var heroConf = Gm.config.getHero(baseId,qualityId)

            if ((filter == 0 || filter == heroConf.camp)&&(job == 0 || job == heroConf.job)){
                var newData = {}
                // newData.heroId = v.heroId
                newData.baseId = baseId
                newData.qualityId = qualityId
                newData.level = 1
                newData.lock = false
                // newData.skin = v.skin

                newData.quality = heroConf.quality
                newData.camp = heroConf.camp
                newData.job= heroConf.job

                newData.isLine = HeroFunc.flyLockType(newData) > 0

                newData.without = false
                var listHeros = this.getGreatThanEqualHeros(qualityId)
                if(listHeros.length == 0){
                    newData.without = true
                }
                list.push(newData)
            }
        }
        list.sort(function(a,b){
            if (b.level == a.level){
                if (a.quality == b.quality){
                    if (a.camp == b.camp){
                        return a.baseId - b.baseId
                    }
                    return b.camp - a.camp
                }else{
                    return b.quality - a.quality
                }
            }else{
                return b.level - a.level
            }
        })
        return list
    },
    backupHeros(){
        this.m_backupHeros = Func.copyObj(this.heros)
    },
    //专属武器等
    getWeaponLevel(heroId){
        var hero = this.getHeroById(heroId)
        if(hero && hero.weaponLv){
            return hero.weaponLv 
        }
        return 1
    },
    setWeaponLevel(heroId,level){
        var hero = this.getHeroById(heroId)
        if(hero){
            hero.weaponLv = level
        }
    },
    hasWeapon(heroId){
        var hero = this.getHeroById(heroId)
        var config = Gm.config.getHero(hero.baseId)
        if(hero.qualityId % 100 <= ExcWeaponFunc.getWeaponOpenQuility() || !config.weaponId){
            return false
        }
        return true
    },
    //获取最大的专属武器的Level
    getWeaponMaxLevel(baseId){
         var heros = Gm.heroData.getHerosByBaseId(baseId)
         var maxLevel = 0
         for(var i=0;i<heros.length;i++){
             var tmaxLevel = this.getWeaponLevel(heros[i].heroId) 
             if( tmaxLevel > maxLevel){
                 maxLevel = tmaxLevel
             }
         }
         return maxLevel
    },
    getHeroByTeamType(type){//每个baseId只取一个,并且是有专属武器的
        var t = []
        var temp = []
        for(var i=0;i<this.heros.length;i++){
            if(!temp[this.heros[i].baseId]){
                temp[this.heros[i].baseId] = 1
                var config = Gm.config.getHero(this.heros[i].baseId)
                if(config.camp == type && config.weaponId != 0){
                    var heros = this.getHerosByBaseId(this.heros[i].baseId)
                    if(heros.length > 0){
                        heros.sort(function(a,b){
                            return b.qualityId - a.qualityId
                        })
                        t.push(heros[0])
                    }
                }
            }
        }
        return t
    },
    getHeroByJob(job){//每个baseId只取一个,并且是有专属武器的
         var t = []
        var temp = []
        for(var i=0;i<this.heros.length;i++){
            if(!temp[this.heros[i].baseId]){
                temp[this.heros[i].baseId] = 1
                var config = Gm.config.getHero(this.heros[i].baseId)
                if(config.job == job && config.weaponId != 0){
                    cc.log("================>",this.heros[i].baseId,config.weaponId)
                    var heros = this.getHerosByBaseId(this.heros[i].baseId)
                    if(heros.length > 0){
                        heros.sort(function(a,b){
                            return b.qualityId - a.qualityId 
                        })
                        t.push(heros[0])
                    }
                }
            }
        }
        return t
    },
});
