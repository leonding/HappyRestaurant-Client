
exports.getExcWeaponIconInfo = function(baseId,level){
    if(!level){
        level = 1
    }
    var heroConfig = Gm.config.getKeyById("HeroConfig","id",baseId)
    if(heroConfig.weaponId){
        var weaponDescConfig = Gm.config.getWeaponDescConfig(heroConfig.weaponId)
        return {picture:weaponDescConfig.icon,level:level}
    }
    else{
        return {picture:"equipicon_put_jz5",level:level}
    }
    
}
  
exports.setPrimarysNode = function(primarysNode,baseAttr1,baseAttr2){
    for (let index = 0; index < 4; index++) {
        var baseNode = primarysNode.getChildByName("node" + (index+1))
        if(baseAttr1[index]){
            baseNode.active = true
            var attrData = baseAttr1[index]
            baseNode.getChildByName("lab1").getComponent(cc.Label).string = EquipFunc.getBaseIdToName(attrData.id)
            baseNode.getChildByName("lab2").getComponent(cc.Label).string = EquipFunc.getBaseIdToNum(attrData.id,attrData.vaule)

            var equipChJs = baseNode.getChildByName("lab2").getComponent("EquipChangeLable")
            if(equipChJs){
                if(baseAttr2 && baseAttr2[index]){
                    equipChJs.setNum(baseAttr2[index].vaule,attrData.vaule,attrData.id)
                }
                else{
                   equipChJs.hideArrow()
                }
            }
        }
        else if(baseAttr2 && baseAttr2[index]){//没有1只有2
            baseNode.active = true
            var attrData = baseAttr2[index]
            baseNode.getChildByName("lab1").getComponent(cc.Label).string = EquipFunc.getBaseIdToName(attrData.id)
            baseNode.getChildByName("lab2").getComponent(cc.Label).string = 0
            var equipChJs = baseNode.getChildByName("lab2").getComponent("EquipChangeLable")
            if(equipChJs){
                equipChJs.setNum(baseAttr2[index].vaule,0,attrData.id)
            }
        }
        else{
            baseNode.active = false
        }
    }
}

exports.getOpenSkillLevelArray = function(){
    var str = Gm.config.getConst("hero_weapon_open_skill")
    var arrayStr = str.split("|")
    var array = []
    for(var i=0;i<arrayStr.length;i++){
        array.push( parseInt(arrayStr[i]))
    }
    return array
}

exports.getOpenYokeLevelArray = function(){
    var str = Gm.config.getConst("hero_weapon_open_yoke")
    var arrayStr = str.split("|")
    var array = []
    for(var i=0;i<arrayStr.length;i++){
        array.push( parseInt(arrayStr[i]))
    }
    return array
}

exports.getOpenYokeStrColor = function(key){
    if(key){
        return new cc.Color(70,56,38)
    }
    else{
          return new cc.Color(139,95,55)
    }
}

exports.getSkillDetailStr = function(config,key){
    if(key){
        return config.detailed
    }
    return config.detailed.replace(/<color=\#[a-fA-F0-9]{6}>/,"<color=#8b5f37>")
}

exports.getWeaponOpenQuility = function(){
    return Gm.config.getConst("hero_unlock_weapon") - 1
}

exports.getYokeMinLevel = function(baseId,heroId,isOther,hero) {
    var data = this.getYokeHerosNew(baseId,heroId)
    var  yokeConfig = Gm.config.getFaZhenYokeByWid(baseId)
    if(data.length < yokeConfig.condition.length - 1){
        return 0
    }
    for(var i=0;i<data.length;i++){
        if(!data[i].hasFlag){
            return 0
        }
    }
    var minLevel = 0
    if(isOther){
        minLevel =  Gm.friendData.getWeaponLevel(hero)
    }
    else{
        minLevel = Gm.heroData.getWeaponLevel(heroId)
    }
    for(var i=0;i<data.length;i++){
        var config = Gm.config.getHero(data[i].baseId)
        if(!Gm.heroData.hasWeapon(data[i].heroId)){
            minLevel = 0
            break;
        }
        var tmaxLevel = Gm.heroData.getWeaponMaxLevel(data[i].baseId)
         if(tmaxLevel < minLevel){
                minLevel = tmaxLevel
        }
    }
    return minLevel
}

exports.getYokeHerosNew = function(baseId,heroId){//1
     //1 获取羁绊条件
     var  yokeConfig = Gm.config.getFaZhenYokeByWid(baseId)
     cc.log("getYokeHerosNew===============>",yokeConfig.condition)
     var heros = []
     if(yokeConfig.type == 1){
         this.getYokeHeroNewByCamp(heros,yokeConfig,baseId)
     }
     else if(yokeConfig.type == 2){
          this.getYokeHeroNewByJob(heros,yokeConfig,baseId)
     }
     else if(yokeConfig.type == 3){
          this.getYokeHeroNewByHero(heros,yokeConfig,baseId)
     }
     return heros
}

exports.getYokeHeroNewByCamp = function(heros,yokeConfig,baseId){
    var array = Func.deepCopyArr(yokeConfig.condition)
    var config = Gm.config.getHero(baseId)
    for(var i=0;i<array.length;i++){
        if(array[i] == config.camp){
            array.splice(i,1)
            break;
        }
    }
    
    var repeatIds = []
    repeatIds.push(baseId)
    if(array.length == 1){//只需要一个
        this.getYokeOneHeroNewByCamp(heros,array[0],1,repeatIds)
    }
    else if(array.length == 2){//需要两个
        if(array[0] == array[1]){//条件一样
            this.getYokeOneHeroNewByCamp(heros,array[0],2,repeatIds)
        }
        else{//条件不一样
            var tHeros = []
            this.getYokeOneHeroNewByCamp(tHeros,array[0],1,repeatIds)
            if(tHeros.length>0){
                heros.push(tHeros[0])
            }
            tHeros = []
            this.getYokeOneHeroNewByCamp(tHeros,array[1],1,repeatIds)
            if(tHeros.length>0){
                heros.push(tHeros[0])
            }
        }
    }
}
exports.getYokeOneHeroNewByCamp = function(heros,camp,total,repeatIds){
    var t = Gm.heroData.getHeroByTeamType(camp)
    if(t.length>0){//有
        this.sortHeros(t)
        for(var i=0;i<t.length;i++){
            if(t[i] && !this.isInArray(repeatIds,t[i].baseId) ){
                t[i].hasFlag = true
                heros.push(t[i])
                repeatIds.push(t[i].baseId)
                if(heros.length == total){
                    break;
                }
            }
        }
    }
    var needNum = total - heros.length
    if(needNum!=0){
        var config = Gm.config.getHeroAll()
            for(var i=0;i<config.length;i++){
            if(config[i].camp == camp &&  !this.isInArray(repeatIds,config[i].id)  && config[i].weaponId !=0){
                var hero = {}
                hero.baseId= config[i].id
                hero.qualityId = parseInt(config[i].id+ "112")
                hero.level = 1
                hero.weaponLv = 1
                hero.hasFlag = false

                heros.push(hero)
                repeatIds.push(config[i].id)
                needNum = needNum - 1
                if(needNum == 0){
                    break
                } 
            }
        }
    }
}

exports.sortHeros = function(heros){
    heros.sort(function(a,b) {
        var level1 = Gm.heroData.getWeaponLevel(a.heroId)
        var level2 = Gm.heroData.getWeaponLevel(b.heroId)
        if(level1 != level2){
            return level2 - level1
        }
        var aq = a.qualityId % 100
        var bq = b.qualityId % 100
        if(aq != bq){
            return bq - aq 
        }
        else{
            return b.baseId - a.baseId
        }
    })
}

exports.getYokeHeroNewByJob = function(heros,yokeConfig,baseId){
    var array = Func.deepCopyArr(yokeConfig.condition)
    var config = Gm.config.getHero(baseId)
    for(var i=0;i<array.length;i++){
        if(array[i] == config.job){
            array.splice(i,1)
            break;
        }
    }
    var repeatIds = []
    repeatIds.push(baseId)
    if(array.length == 1){//只需要一个
        this.getYokeOneHeroNewByJob(heros,array[0],1,repeatIds)
    }
    else if(array.length == 2){//需要两个
        if(array[0] == array[1]){//条件一样
            this.getYokeOneHeroNewByJob(heros,array[0],2,repeatIds)
        }
        else{//条件不一样
            this.getYokeOneHeroNewByJob(heros,array[0],1,repeatIds)
            this.getYokeOneHeroNewByJob(heros,array[1],1,repeatIds)
        }
    }
}

exports.getYokeOneHeroNewByJob = function(heros,job,total,repeatIds){
    var t = Gm.heroData.getHeroByJob(job)
    if(t.length>0){//有
        this.sortHeros(t)
        for(var i=0;i<t.length;i++){
            if(t[i] && !this.isInArray(repeatIds,t[i].baseId)){
                t[i].hasFlag = true
                heros.push(t[i])
                repeatIds.push(t[i].baseId)
                if(heros.length == total){
                    break;
                }
            }
        }
    }
    var needNum = total - heros.length
    if(needNum!=0){
        var config = Gm.config.getHeroAll()
            for(var i=0;i<config.length;i++){
            if(config[i].job == job && !this.isInArray(repeatIds,config[i].id) && config[i].weaponId !=0){
                var hero = {}
                hero.baseId= config[i].id
                hero.qualityId = parseInt(config[i].id + "112")
                hero.level = 1
                hero.weaponLv = 1
                hero.hasFlag = false
                heros.push(hero)
                repeatIds.push(config[i].id)
                needNum = needNum - 1
                if(needNum == 0){
                    break
                } 
            }
        }
    }
}

exports.isInArray = function(array,ids){
    for(var i=0;i<array.length;i++){
        if(array[i] == ids){
            return true
        }
    }
    return false
}

exports.getYokeHeroNewByHero = function(heros,yokeConfig,baseId){
    var array = Func.deepCopyArr(yokeConfig.condition)
    for(var i=0;i<array.length;i++){
        if(array[i] == baseId){
            array.splice(i,1)
            break;
        }
    }
    for(var i=0;i<array.length;i++){
        this.getYokeOneHeroNewByHero(heros,array[i])
    }
}

exports.getYokeOneHeroNewByHero = function(heros,baseId){
    var t = Gm.heroData.getHerosByBaseId(baseId)
    if(t.length>0){//有
       this.sortHeros(t)
       t[0].hasFlag = true
       heros.push(t[0])
       return
    }
    var needNum = 1
    if(needNum!=0){
        var config = Gm.config.getHeroAll()
            for(var i=0;i<config.length;i++){
            if(config[i].id == baseId){//&& config[i].weaponId !=0
                var hero = {}
                hero.baseId= config[i].id
                hero.qualityId = parseInt(config[i].id + "112")
                hero.level = 1
                hero.weaponLv = 1
                hero.hasFlag = false
                heros.push(hero)
                needNum = needNum - 1
                if(needNum == 0){
                    break
                } 
            }
        }
    }
}

exports.getFightValue = function(baseAttr){
    var config = Gm.config.getConfig("FightValueConfig")
    var fight = 0
    for(var i=0;i<baseAttr.length;i++){
        var item = baseAttr[i]
        var tFightValue = Gm.config.getFightValueConfig(item.id)
        if(tFightValue){
            fight = fight + item.vaule * tFightValue.value
        }
    }
    return parseInt(fight)
}

exports.hasNewWeaponSkill = function(heroId){
    var array = this.getOpenSkillLevelArray()
    var weaponLevel = Gm.heroData.getWeaponLevel(heroId)
    for(var i=0;i<array.length;i++){
        if(array[i] -1 ==weaponLevel ){
            return true
        }
    }
    return false
}