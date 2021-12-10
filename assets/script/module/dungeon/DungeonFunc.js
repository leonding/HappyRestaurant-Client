
exports.Type = cc.Enum({
    DEFAULT: 1,
});

exports.starTips = function (conf,point) {
    var dataMode = Gm.dungeonData.getDataByMode(conf.dungeonId,conf.mode)
    var str = cc.js.formatStr("<color=#FF0000>%s</c>",conf.name + " " + conf.des)
    
    var list = []
    for (let index = 0; index < conf.star.length; index++) {
        const v = conf.star[index];
        var color
        var flag = false
        if (dataMode && dataMode.star[index] > 0){
            color = "00FF00"
            flag = true
        }else{
            color = "ffffff"
        }
        var value = v.num
        if (v.type == 6){//特殊处理，武将职业
            value = Gm.config.getJobType(value).childTypeName
        }else if (v.type == 7){//特殊处理,光环
            value = Gm.config.getBattleAuraById(value).aruaInfo
        }
        var ss = cc.js.formatStr("<color=#%s>%s</c>",color,cc.js.formatStr(Gm.config.getDungeonType(v.type).childTypeName,value))
        flag?list.unshift(ss):list.push(ss)
    }
    for (let index = 0; index < list.length; index++) {
        const v = list[index];
        str = str + "\n" + v
    }
    Gm.ui.create("ItemTipsView",{data:str,itemType:-1,pos:point})
}

exports.isUnlock = function (conf,isPrint) {
    if (conf.openconditions){
        var dungeonData = Gm.dungeonData.getData(conf.openconditions)
        if (dungeonData && dungeonData.lastBattleMode){
            return true
        }
        if (!this.isUnlockAllMode(conf.openconditions)){
            if (isPrint){
                var openConf = Gm.config.getDungeon(conf.openconditions)
                Gm.floating(cc.js.formatStr( Ls.get(5279),openConf.name))     
            }
            return false
        }
    }
    return true
}

exports.isUnlockAllMode = function (dungeonId){
    var list = Gm.config.getDungeonGroups(dungeonId)
    var modeConf = list[list.length-1]
    var dataMode = Gm.dungeonData.getDataByMode(modeConf.dungeonId,modeConf.mode)
    if (dataMode == null){
        return false
    }
    return true
}

exports.getDungeonActivityRedStr = function () {
    var dateStr = Func.dateFtt("yyyy-MM-dd",Gm.userData.getTime_m())
    dateStr = dateStr + "newDungeonActivity"
    return dateStr
}

