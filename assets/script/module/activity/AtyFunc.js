exports.TYPE_TIME_NOOB = 101 //新手礼包
exports.TYPE_TIME_UP = 102 //成长基金
exports.TYPE_TIME_CHAPTER = 103 //章节礼包
exports.TYPE_TIME_LIMIT = 104 //限时礼包

exports.TYPE_NORMAL_DAY = 202
exports.TYPE_NORMAL_WEEK = 203
exports.TYPE_NORMAL_MONTH =204
exports.TYPE_NORMAL_DOAMIND =201

exports.TYPE_MONTH_CARD =   301 //月卡

exports.TYPE_TXZ = 401 //通行证

exports.TYPE_VIP = 10000 //vip

exports.PAY_CZJI = 105100 //成长基金
exports.PAY_ZJLB = 103100 //章节礼包
exports.PAY_TXZ = 401100 //通行证
exports.PAY_FIRST = 501101 //首冲

exports.ACCU_PAY_TYPE = 2 //累充
exports.FIRS_PAY_TYPE = 1 //首充


exports.ANNIVER_SKIN_TYPE = 2
exports.ANNIVER_SIGN_TYPE = 1

exports.VIP_BASE_ATY_ID = 100100

exports.getVipActivityId = function(lv){
    return lv+exports.VIP_BASE_ATY_ID
}

exports.openView = function(){
    var appType = Bridge.getAppType()
    if (appType == 0 || Gm.loginData.isOpenShop()){
        if (Bridge.isReview()){
            if (Gm.userInfo.authenticate == 2){
                Gm.floating(Gm.config.getErr(-60021))
                return
            }
        }
        Gm.ui.create("ActivityMainView",true)
    }
}

exports.getPrice = function(id,isVipExp){
    var payConf = Gm.config.getPayProductAtyId(id)
    var cost = payConf.cost
    if (isVipExp){
        cost = payConf.costChina || 0
    }
    var conf = Gm.config.getEventPayRewardId(id)
    if (conf.discount > 0){
        cost = cost * (1-conf.discount/10000)
        cost = Math.ceil(cost*10)/10
    }
    return cost
}

exports.getPriceStr = function(id){
    var num = AtyFunc.getPrice(id)
    if (num == 0){
        return Ls.get(20053)
    }
    return Gm.config.getPayProductAtyId(id).costSymbol + num
}

exports.getVipExp = function(id){
    return exports.getPrice(id,true) * Gm.config.getConst("vip_conversion")/100
}

exports.timeToTSFM = function(destTime,miao,isZh){
    miao = miao || false
    var _fen = 60
    var _shi = 3600
    var _tian = 86400
    var tmpTian = Math.floor(destTime/_tian)
    var tmpShi = Math.floor((destTime%_tian)/_shi)
    var tmpFen = Math.floor((destTime%_shi)/_fen)
    var tmpMiao= Math.floor(destTime%_fen)

    var str = Func.addZero(tmpShi+tmpTian*24)+ ":"+ Func.addZero(tmpFen)
    if (miao){
        str = str + ":"+ Func.addZero(tmpMiao)
    }
    // if (tmpTian > 0){
    //     str = tmpTian + "-" + str
    // }
    return str
}

exports.timeToTSFMzh = function(destTime,miao){
    var _fen = 60
    var _shi = 3600
    var _tian = 86400
    var tmpTian = Math.floor(destTime/_tian)
    var tmpShi = Math.floor((destTime%_tian)/_shi)
    var tmpFen = Math.floor((destTime%_shi)/_fen)
    var tmpMiao= Math.floor(destTime%_fen)

    if (tmpTian > 0){
        return tmpTian + Ls.get(7007)
    }else{
        return Func.addZero(tmpShi)+ ":" + Func.addZero(tmpFen) + ":" +Func.addZero(tmpMiao)
        // if(tmpShi > 0){
        //     return Func.addZero(tmpShi)+ ":" + Func.addZero(tmpFen) + ":" +Func.addZero(tmpMiao)
        // }else{
        //     if (tmpFen > 0){
        //         return Func.addZero(tmpFen) + ":" +Func.addZero(tmpMiao)
        //     }

        // }
    }
    return ""
}

exports.timeToDayAndH = function(destTime,item){
    var _fen = 60
    var _shi = 3600
    var _tian = 86400
    var tmpTian = Math.floor(destTime/_tian)
    var tmpShi = Math.floor((destTime%_tian)/_shi)
    var tmpFen = Math.floor((destTime%_shi)/_fen)
    var tmpMiao= Math.floor(destTime%_fen)
    var str = ""
    if(tmpTian>0){
        str = str + tmpTian + Ls.get(5308)
        if(tmpShi>0){
            str = str + " "+tmpShi + Ls.get(5309)
         }
    }
    else{
        str = str + " "+tmpShi + Ls.get(5309)  +  " " + tmpFen + Ls.get(5310)
        if(tmpShi==0){
            item.node.color = new cc.Color(255,0,0)
        }
    }
    return str
}

exports.timeTo = function(destTime){
    var _fen = 60
    var _shi = 3600
    var _tian = 86400
    var tmpTian = Math.floor(destTime/_tian)
    var tmpShi = Math.floor((destTime%_tian)/_shi)
    var tmpFen = Math.floor((destTime%_shi)/_fen)
    var tmpMiao= Math.floor(destTime%_fen)
    if (tmpTian > 0){
        str = tmpTian + Ls.get(5308)
        return str
    }

    var str = Func.addZero(tmpShi)+ Ls.get(5309)+ Func.addZero(tmpFen) + Ls.get(5310)
    return str
}

//年龄限制 是否可以购买
exports.checkCanPay = function(id){
    if( Bridge.isHk() ){ return true }
    Gm.userInfo.monthConsumeAdd(0)//跨月的时候要清除
    var birthDay = Gm.userInfo.getBirthDay()
    var age = Func.getAge(birthDay)
    var  money = AtyFunc.getPrice(id)
    money = money + Gm.userInfo.getMonthConsume()
    var canPayMaxNumber = AtyFunc.getMaxPayNumber(age)
    if(canPayMaxNumber == -1){
        return true
    }
    if(money<=canPayMaxNumber){
        return true
    }
    return false
}

//年龄限制 获取最大的可以金额
exports.getMaxPayNumber = function(age) {
    var  str =  Gm.config.getConst("account_buy_jp")
    var array1 = str.split("|")
    var array2 = array1[0].split("_")
    var array3 = array1[1].split("_")
    var age1 = checkint(array2[0])
    var money1 = checkint(array2[1])
    var age2 = checkint(array3[0])
    var money2 = checkint(array3[1])

    if(age<age1){
        return money1
    }
    else if(age>= age1 && age<age2 ){
        return money2
    }
    return -1 //无穷大
}

exports.isPay = function (id) {
    var conf = Gm.config.getEventPayRewardId(id)
    if (conf.childType == AtyFunc.TYPE_MONTH_CARD){
        var dd = Gm.activityData.getAtyId(id)
        if (dd == null || (dd && Gm.userData.getTime_m() > dd.expireTime)){
            return true
        }
    }else{
        var payConf = Gm.config.getPayProductAtyId(id)
        return payConf?true:false
    }
}
exports.checkBuy = function (id) {
    if (AtyFunc.getPrice(id) == 0){
        exports.sendPay(id)
        return
    }
    if(Gm.userInfo.isInputAge()){//已经输入年龄
        //检测是否绑定帐号
        if(Bridge.isHk() && Gm.getLogic("PayShopLogic").isBindAccount()){
            //没有绑定
            Gm.ui.create("AccountSwitchView",true)
            return 
        }
        if(AtyFunc.checkCanPay(id)){//可以支付
            exports.sendPay(id)
        }
        else{
            //限制警告
            // Gm.ui.create("AgeAlertView")
            Gm.ui.removeByName("ActivityBuyView")
            Gm.ui.removeByName("ActivityTimeNoobBuyView")
            Gm.box({msg:Ls.get(413),ok:Ls.get(1119),cancel:Ls.get(1222)})
        }
    }
    else{//输入年龄
        Gm.ui.create("PlayerAgeView")
    }
}

exports.sendPay = function (id) {
    if (exports.isPay(id)){
        Gm.payNet.createPay(id)
    }else{
        Gm.activityNet.reward(id)
    }
    Gm.ui.removeByName("ActivityBuyView")
    Gm.ui.removeByName("ActivityTimeNoobBuyView")
}
