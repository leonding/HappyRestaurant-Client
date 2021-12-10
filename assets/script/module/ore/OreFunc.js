exports.istest = false

exports.getStartTime = function(){
    if(this.istest){
        var date = new Date()
        var currentTime = date.getTime()
        var config = Gm.config.getOreTestConfig()
        for(var i=0;i<config.length;i++){
            var start = Func.dealConfigTime(config[i].OreStartTime)
            var end = start + config[i].OreContinueTime
            if(currentTime>=start && currentTime<=end){
                return start
            }
        }
        return 0
    }
    var timeStar = Func.dealConfigTime(Gm.config.getConst("ore_start_time"))
    return timeStar
}

exports.getStartTime1 = function(){
    var date = new Date()
    var currentTime = date.getTime() + 10*60*1000
    var config = Gm.config.getOreTestConfig()
    for(var i=0;i<config.length;i++){
        var start = Func.dealConfigTime(config[i].OreStartTime)
        var end = start + config[i].OreContinueTime
        if(currentTime>=start && currentTime<=end){
            return start
        }
    }
}

exports.getEndTime = function(){
    if(this.istest){
        var date = new Date()
        var currentTime = date.getTime()
        var config = Gm.config.getOreTestConfig()
        for(var i=0;i<config.length;i++){
            var start = Func.dealConfigTime(config[i].OreStartTime)
            var end = start + config[i].OreContinueTime
            if(currentTime>=start && currentTime<=end){
                return end
            }
        }
        return 0
    }
    var timeStar = this.getStartTime()
    var timeEnd =  timeStar + Gm.config.getConst("ore_continue_time")
    return timeEnd
}

exports.oreIsOpen = function(){//活动是否开启
    var currentTime = Gm.userData.getTime_m()
    var timeStar = this.getStartTime()
    var timeEnd =  this.getEndTime()
    if(currentTime>=timeStar && currentTime<=timeEnd){
        return true
    }
    return false
}

exports.getRoomNameStr = function(type,index){
     var data = Gm.config.getOreConfigByType(type)
     return data.name + index
}



exports.getOrePositions = function(type){
    var config = Gm.config.getOreConfigByType(type)
    var coordinateArray = config.coordinate.split("|")
    var array = []
    for(var i=0;i<coordinateArray.length;i++){
        var str = coordinateArray[i]
        var strArray = str.split(",")
        var x  = parseInt(strArray[0])
        var y  = parseInt(strArray[1])
        array.push(cc.v2(x,y))
    }
    return array
}

exports.getOrePositions2 = function(type){
    var config = Gm.config.getOreConfigByType(type)
    var coordinateArray = config.coordinate2.split("|")
    var array = []
    for(var i=0;i<coordinateArray.length;i++){
        var str = coordinateArray[i]
        var strArray = str.split(",")
        var x  = parseInt(strArray[0])
        var y  = parseInt(strArray[1])
        array.push(cc.v2(x,y))
    }
    return array
}

exports.getBattleLogTimeStr = function(destTime){
     var _fen = 60
    var _shi = 3600
    var _tian = 86400
    var tmpShi = Math.floor((destTime%_tian)/_shi)
    var tmpFen = Math.floor((destTime%_shi)/_fen)
    var tmpMiao= Math.floor(destTime%_fen)
    if(tmpShi){
        return cc.js.formatStr(Ls.get(7500039),tmpShi)
    }
    else{
        return cc.js.formatStr(Ls.get(7500040),tmpFen)
    }
}

exports.getTimeStr = function(destTime){
    var _fen = 60
    var _shi = 3600
    var _tian = 86400
    var tmpShi = Math.floor((destTime%_tian)/_shi)
    var tmpFen = Math.floor((destTime%_shi)/_fen)
    var tmpMiao= Math.floor(destTime%_fen)
    return  Func.addZero(tmpShi) + ":" + Func.addZero(tmpFen) + ":" + Func.addZero(tmpMiao)
}

exports.timeToDayAndH = function(destTime,item){
    var _fen = 60
    var _shi = 3600
    var _tian = 86400
    var tmpTian = Math.floor(destTime/_tian)
    var tmpShi = Math.floor((destTime%_tian)/_shi)
    var tmpFen = Math.floor((destTime%_shi)/_fen)
    var str = ""
    if(tmpShi>0){
        str = cc.js.formatStr(Ls.get(7500035),tmpShi,tmpFen)
    }
    else{
        str = cc.js.formatStr(Ls.get(7500036),tmpFen)
    }
    return str
}

exports.getRewardNumByTime = function(time,num){
    var  num = num / 60
    return Math.floor(time * num)
}

exports.getMappingType = function(fight){
    var oreRoomConfig = Gm.config.getConfig("OreRoomConfig")
    for(var i=0;i<oreRoomConfig.length;i++){
        var str = oreRoomConfig[i].mapping
        var array = str.split("_")
        var min = parseInt(array[0])
        var max = parseInt(array[1])
        if(min<fight && fight<max){
            return  oreRoomConfig[i].type
        }
    }
    var str = oreRoomConfig[0].mapping
    var array = str.split("_")
    var max = parseInt(array[1])
    if(fight>max){
        return oreRoomConfig[0].type
    }
    return oreRoomConfig[oreRoomConfig.length-1].type
}

exports.getOreBattleCardId = function(){
    return 200701
}

exports.getOreBattleCardPrice = function(){
    return Gm.config.getConst("ore_cost_gold")
}

exports.getResetBattleCount = function(){
    return Gm.config.getConst("ore_battle_count")
}

exports.getNameBgSpriteName = function(data){
    var str = "/img/shuijing/"
    if(data.info){
        if(data.info.playerId == Gm.userInfo.id){
             str = str + "crystal_icon_name_own"
        }
        else{
             str = str + "crystal_icon_name_on"
        }
    }
    else{
            str = str +"crystal_icon_name_off"
    }
    return str
}

exports.getNameTitleColor = function(data){
    if(data.info){
        if(data.info.playerId == Gm.userInfo.id){
            return new cc.Color(0,252,255)
        }
        else{
              return new cc.Color(255,255,255)
        }
    }
}

exports.getNumShowStr = function(num){
    if(num>0){
        return "(+" + num + ")"
    }
    return "(" + num  + ")"
}

exports.getNumShowStrColor = function(num){
     if(num>0){
        return new cc.Color(0,255,0)
    }
    return new cc.Color(255,0,0)
}

exports.rewardBoxAddAnimation = function(node,key){
    var tnode = node.getChildByName("rewardAnimationNode")
    if(tnode){
        tnode.active = key
        return
    }
    if(key){
        var self = this
        Gm.load.loadPerfab("perfab/ui/shuijing",function(Perfab){
            if(node && node.isValid){
                var item = cc.instantiate(Perfab)
                item.getComponent(cc.Animation).play("shuijing")
                node.addChild(item)
                item.name = "rewardAnimationNode"
            }
        })
    }
}