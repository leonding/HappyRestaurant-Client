exports.TYPE_BASE_NUM = 10000

exports.MAX_NUM = 0

exports.getMaxNum = function(){
    if (exports.MAX_NUM){
        return exports.MAX_NUM
    }

    var list = Gm.config.getTower()

    var item = {id:0}
    for (let index = 0; index < list.length; index++) {
        const v = list[index];
        if (v.id > item.id){
            item = v
        }
    }
    exports.MAX_NUM = exports.towerIdToNum(item.id,item.group)
    return exports.MAX_NUM
}
exports.openTower = function(){
    if (!Func.isUnlock("TowerView",true)){
        return
    }
    var list = Gm.config.getTowerGroup()

    for (let index = 0; index < list.length; index++) {
        const v = list[index];
        if (v.group > 0 && Gm.userInfo.maxMapId > v.unlockCondition){
            Gm.ui.create("TowerEnterView")
            return
        }
    }
    Gm.ui.create("TowerView",list[0])
}


exports.towerNumToId = function(towerType,towerNum){
    return towerType * exports.TYPE_BASE_NUM + towerNum
}

exports.towerIdToType = function(towerId){
    return Math.floor(towerId/exports.TYPE_BASE_NUM)
}

exports.towerIdToNum = function(towerId,towerType){
    if (towerType == 0){
        return towerId
    }
    return towerId%(towerType*exports.TYPE_BASE_NUM)
}

exports.showFightTeam = function(towerId){
    var towerType = this.towerIdToType(towerId)
    var fightType
    if (towerType == 0){
        fightType = ConstPb.lineHero.LINE_TOWER
    }else if (towerType == 1){
        fightType = ConstPb.lineHero.LINE_TOWER1
    }else if (towerType == 2){
        fightType = ConstPb.lineHero.LINE_TOWER2
    }else if (towerType == 3){
        fightType = ConstPb.lineHero.LINE_TOWER3
    }

    var groupConf = Gm.config.getTowerGroup(towerType)
    var nowData = Gm.towerData.getTowerByType(towerType)
    if (nowData.layer >= groupConf.maxLayerEveryday){
        Gm.floating(2011)
        return
    }
    Gm.ui.create("FightTeamView",{type:fightType,towerId:towerId,towerType:towerType})
}

exports.isTimeOpen = function(clientOpenTime){
    var date = date = new Date(Gm.userData.getTime_m())
    var month = date.getDate()
    var day = date.getDay()==0?7:date.getDay()
    var num
    if (clientOpenTime[0].type == 0){ //周
        num = day
        if (day == 0){ //0全周
            return true
        }
    }else if (clientOpenTime[0].type ==1){ //月
        num = month
    }else if (clientOpenTime[0].type == 2){//全天
        return true
    }
    if (num){
        for (let i = 0; i < clientOpenTime.length; i++) {
            const v1 = clientOpenTime[i];
            if (v1.arg == num){
                return true
            }
        }
    }
    return false
}

exports.getTowerBoxId = function (towerId) {
    return Math.floor(towerId/10)*10
}



