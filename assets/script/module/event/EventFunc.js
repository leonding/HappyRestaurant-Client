exports.Type = cc.Enum({
    XS: 1,//新手活动
    DUNGEON:4,//副本活动（遗迹)
    SHOP:6//商城活动（遗迹） 商城时间为入口
});

//是否开启
exports.isOpen = function (type) {
    var timeData = exports.getTime(type)
    if (timeData.openTime > 0){
        if (Gm.userData.getTime_m() >= timeData.openTime && Gm.userData.getTime_m() < timeData.closeTime){
            return Gm.userInfo.maxMapId >= timeData.unlockMapId
        }
    }
    return false
}
exports.getTime = function(type){
    var resultData = {openTime:0,closeTime:0}
    var list = Gm.config.getEventGroupsByType(type)
    if (list == null || list && list.length == 0){
        return resultData
    }
    var conf = list[0]
    resultData.openTime = Func.dealConfigTime(conf.eventStart)
    resultData.closeTime = Func.dealConfigTime(conf.eventEnd)
    resultData.unlockMapId = conf.unlockMapId
    return resultData
}

exports.getXsConfs = function () {
    var list = []
    list.push(Gm.config.getEventGroup(ConstPb.EventGroup.EVENT_DAY_SIGN))
    list.push(Gm.config.getEventGroup(ConstPb.EventGroup.EVENT_SIGN_TASK))
    return list
}