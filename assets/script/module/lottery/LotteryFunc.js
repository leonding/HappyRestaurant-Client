exports.getCostWeight = function(id){
    if( ConstPb.playerAttr.PAY_GOLD == id){
        return 2
    }
    else if(ConstPb.playerAttr.GOLD == id){
        return 1
    }
    return 3
}

exports.setTopNode = function(tmpData,m_tTopNode){
        var tmpList = [ConstPb.playerAttr.GOLD, ConstPb.playerAttr.PAY_GOLD]
        var needList = ["tenCost","payTenCost"]
        for(const i in tmpData){
            for(const j in needList){
                var tmpNeed = tmpData[i].config[needList[j]]
                for(const k in tmpNeed){
                    var tmpCan = true
                    for(const o in tmpList){
                        if (tmpNeed[k].id == tmpList[o]){
                            tmpCan = false
                            break
                        }
                    }
                    if (tmpCan){
                        tmpList.push(tmpNeed[k].id)
                    }
                }
            }
        }
        tmpList = tmpList.sort(function(a,b){
            var index1 = LotteryFunc.getCostWeight(a)
            var index2 = LotteryFunc.getCostWeight(b)
            return index1 - index2
        })
        for(const i in m_tTopNode){
            if (tmpList[i]){
                if(tmpList[i] == ConstPb.playerAttr.GOLD || tmpList[i] ==  ConstPb.playerAttr.PAY_GOLD){
                    var labelNode = m_tTopNode[i].getChildByName("label")
                    if(labelNode){
                        labelNode.active = true
                        var str = Ls.get(20050)
                        if(tmpList[i] ==  ConstPb.playerAttr.GOLD){
                            str = Ls.get(20053)
                        }
                        labelNode.getComponent(cc.Label).string = str
                    }
                }
                m_tTopNode[i].active = true
                var node = m_tTopNode[i].getChildByName("node")
                var spr = node.getChildByName("spr")
                var item = Func.itemConfig({type:ConstPb.itemType.TOOL,id:tmpList[i]})
                Gm.load.loadSpriteFrame("img/items/" +item.con.icon,function(sp,icon){
                    icon.spriteFrame = sp
                    var tmpScale = 50/sp._originalSize.width
                    icon.node.scale = tmpScale
                },spr.getComponent(cc.Sprite))
                var lab =node.getChildByName("lab")
                if (tmpList[i] ==  ConstPb.playerAttr.GOLD){
                    lab.getComponent(cc.Label).string = Gm.userInfo.golden || 0//Func.transNumStr(Gm.userInfo.golden || 0)
                }else if(tmpList[i] == ConstPb.playerAttr.PAY_GOLD){
                    lab.getComponent(cc.Label).string = Gm.userInfo.payGolden || 0//Func.transNumStr(Gm.userInfo.payGolden || 0)
                }else if(tmpList[i] == ConstPb.playerAttr.FRIEND_POINT){
                    lab.getComponent(cc.Label).string = Gm.userInfo.getCurrencyNum(ConstPb.playerAttr.FRIEND_POINT) || 0//Func.transNumStr(Gm.userInfo.getCurrencyNum(ConstPb.playerAttr.FRIEND_POINT) || 0)
                }else{
                    lab.getComponent(cc.Label).string = item.num//Func.transNumStr(item.num)
                }
            }else{
                m_tTopNode[i].active = false
            }
        }
}

exports.getChouKaImgTitleBg = function(quiltyId){
    var  typeConfigId = [216,216,216,215,215,214];
    var config = Gm.config.getTypeConfigById(typeConfigId[quiltyId])
    return config.currencyIcon
}
exports.getChouKaTzImgTitleBg = function(quiltyId){
    var  typeConfigId = ["chouka_img_r","chouka_img_sr","chouka_img_ssr"];
    return typeConfigId[quiltyId-1]
}

exports.getChoukaTzTitleNameByQualityId = function(quiltyId){
    var str = ""
    if(quiltyId == 1){
       str = "R"
    }
    else if(quiltyId == 2){
       str = "SR"
    }
    else if(quiltyId == 3){
        str ="SSR"
    }
    return cc.js.formatStr(Ls.get(3115),str)
}

exports.getChoukaImgTitlePercent = function(type,quiltyId){
    var model = type +1
    if(type == 2){
        model = 5
    }
    var config = Gm.config.getKeysById("ProbabilityDisplayConfig","mode",model)
    var total  = 0
    for(var i=0;i<config.length;i++){
        if(config[i].qualityId == quiltyId){
            if(config[i].weight.indexOf("%") != -1){
                total = total + parseFloat(config[i].weight.replace("%",""))
            }
        }
    }
    // if((type == 0 || type ==2)&& quiltyId == 5){
    //     return 0.05
    // }
    return total/100
}

exports.getChoukaPercentByQualityId = function(quiltyId){
    if(quiltyId == 1){
        return 0.5876
    }
    else if(quiltyId == 3){
        return 0.3624
    }
    else if(quiltyId == 5){
        return 0.05
    }
}


exports.getChoukaTitleNameByQualityId = function(quiltyId){
    var str = ""
    if(quiltyId == 1){
       str = "N"
    }
    else if(quiltyId == 3){
       str = "R"
    }
    else if(quiltyId == 5){
        str ="SR"
    }
    return cc.js.formatStr(Ls.get(3115),str)
}

exports.getChouKaPersonRes = function(type){ //背景 任务
    if(type==0){//标准
        return {person:"chouk_pt1",titleName:"chouk_pt2",pos:{x:-152.5,y:512}}
    }
    else if(type == 1){//友情
       return {person:"chouk_yq1",titleName:"chouk_yq2",pos:{x:-226.5,y:336}} 
    }
    //限时
    return {person:"chouk_sd1",titleName:null} 
}

exports.addDrawPoint = function(m_tTopNode){
    var drowPointNode = null
    for(const i in m_tTopNode){
        if(i==2){
            m_tTopNode[i].active = true
            var node =  m_tTopNode[i].getChildByName("node")
            var spr = node.getChildByName("spr")
            var item = Func.itemConfig({type:ConstPb.itemType.TOOL,id:ConstPb.playerAttr.DRAW_POINT})
            if(item && item.con && item.con.icon){
                Gm.load.loadSpriteFrame("img/items/" +item.con.icon,function(sp,icon){
                    if(icon && icon.node && icon.node.isValid){
                        icon.spriteFrame = sp
                    }
                },spr.getComponent(cc.Sprite))
            }
            var lab =node.getChildByName("lab").getComponent(cc.Label)
            lab.string = Gm.userInfo.getGameCoinNum(ConstPb.playerAttr.DRAW_POINT)
            drowPointNode = m_tTopNode[i]
            break
        }
    }
    return  drowPointNode
}

exports.pageIndexToFiledId = function(index){
       let array = []
       array[0] = 1001 // 标准抽卡
       array[1] = 1002 // 友情抽卡
       array[2] = 5001 // 限时武将抽卡
       array[4] = 1008 // 套装抽卡
       return array[index]
}

exports.filedIdToModeId = function(id){
    var config = Gm.config.getLotteryConfig(id)
    return config.mode
}

exports.getWishTotalNumber = function(){
    return Gm.config.getConst("draw_wish_ensure_count")
}

exports.getWishOpenNumber = function(){
    return Gm.config.getConst("draw_wish_limit_count")
}

exports.setWishDesLabel = function(label,wishNum,finishNum){
    var str1 = Ls.get(5846)
    var number  = Math.max(0,LotteryFunc.getWishTotalNumber() - Gm.lotteryData.getWishNumber())
    var str2 =   cc.js.formatStr(Ls.get(20073),number)
    var str3 = Ls.get(5847)
    if(wishNum == 0){
        label.string = str1
    }
    else if(wishNum == 1){
        if(finishNum == 0){
            label.string = str2
        }
        else if(finishNum == 1){
            label.string = str1
        }
    }
    else if(wishNum == 2){
         if(finishNum == 0){
            label.string = str2
        }
        else if(finishNum == 1){
            label.string = str2
        }
        else if(finishNum == 2){
             label.string = str3
        }
    }
}

exports.getLotteryAwardNewRes = function(){
    var str = Gm.config.getConst("gacha_character_quality")
    var strArray = str.split("|")
    var data = []
    for(var i=0;i<strArray.length;i++){
        var strDataArray = strArray[i].split("*")
        var t = {}
        t.quality = strDataArray[0]
        t.qualityRes = strDataArray[1]
        t.res1 = strDataArray[2]
        t.res2 = strDataArray[3]
        t.ani = strDataArray[4]
        data.push(t)
    }
    return data
}

exports.singleHeroShowInfo = []

exports.getTaoZShowConfig = function(){
    var index = Gm.lotteryData.getTzJob()
     if(this.singleHeroShowInfo[index-1]){
         return this.singleHeroShowInfo[index-1]
     }
    var data = []
    var config = Gm.config.getConst("single_hero_show_info_" + index)
    var arrayStr = config.split("|")
    for(var i=0;i<arrayStr.length;i++){
        var t = {}
        var strArray = arrayStr[i].split("_")
        t.type = parseInt(strArray[0])
        t.id = parseInt(strArray[1])
        data.push(t)
    }

    var rData = []
    var tdata = Gm.lotteryData.getLotteryThirdInfoData()
    for(var i=0;i<data.length;i++){
        if(data[i].type == 30000){
             for(var j=0;j<tdata.other.itemInfo.length;j++){
                if(data[i].id == tdata.other.itemInfo[j].id){
                    var temp = {}
                    temp.type = data[i].type
                    temp.id =   data[i].id
                    temp.percent =  tdata.other.itemInfo[j].percent
                    rData.push(temp)
                }
            }
        }
        else{
            for(var j=0;j<tdata.equipData.itemInfo.length;j++){
                for(var z=0;z<tdata.equipData.itemInfo[j].length;z++){
                    if(data[i].id == tdata.equipData.itemInfo[j][z].id){
                        var temp = {}
                        temp.type = tdata.equipData.itemInfo[j][z].type
                        temp.id =  data[i].id
                        temp.percent = tdata.equipData.itemInfo[j][z].percent
                        rData.push(temp)
                    }
                }
            }
        }
    }
    if(!this.singleHeroShowInfo[index-1]){
        this.singleHeroShowInfo[index-1]= rData
    }
    return rData
}

exports.getTzHeroPercent = function(){
    var heroPercent = 0
    var config = Gm.lotteryData.getConfigByFieId(1008)
    if(config){
        for(var i=0;i< config.itemGroup.length;i++){
            if(config.itemGroup[i].type == 80000){
                heroPercent = config.itemGroup[i].weights/10000
            }
        }
    }
    return heroPercent
}

exports.getTzEquipPercent = function(){
    var equipPercent = 0
    var config = Gm.lotteryData.getConfigByFieId(1008)
    if(config){
        for(var i=0;i< config.itemGroup.length;i++){
            if(config.itemGroup[i].type == 40000){
                equipPercent = config.itemGroup[i].weights/10000
            }
        }
    }
    return equipPercent
}

exports.getJobRes = function(){
    return ["job__img_zhans","job__img_fas","job__img_shes","job_img_fuz"]
}


exports.transBtn = function(node,data){
    var lay = node.getChildByName("lay")
    var type = lay.getChildByName("typeNode").getChildByName("type")
    var spr = lay.getChildByName("typeNode").getChildByName("spr")
    var lab = lay.getChildByName("lab").getComponent(cc.Label)

    var tmpFree = 0
    var tmpNum = 0
    var tmpSprite = null
    var tmpHas = false
    var useGoldPay = false //是否使用付费的

    for(const i in data){
        var item = Func.itemConfig(data[i])
        tmpSprite = item.con.icon
        tmpNum = data[i].num

        if (data[i].id == ConstPb.playerAttr.PAY_GOLD){//使用付费钻石
            tmpFree = 2
        }else if(data[i].id ==  ConstPb.playerAttr.GOLD){//使用免费钻石
            tmpFree = 1
        }else{
            tmpFree = 0
        }

        if (item.num >= data[i].num){
            tmpHas = true
            if(tmpFree == 1){
                if(data[i].num > (Gm.userInfo.golden || 0)){
                    useGoldPay = true
                }
            }
            break
        }
    }
    
    type.active = true
    spr.active = true
    Gm.load.loadSpriteFrame("img/items/" +tmpSprite,function(sp,icon){
        if(icon && icon.node && icon.node.isValid){
            icon.spriteFrame = sp
            var tmpScale = 30/sp._originalSize.width
            icon.node.width = sp._originalSize.width * tmpScale
            icon.node.height = sp._originalSize.height * tmpScale
        }
        },spr.getComponent(cc.Sprite))

    lab.string = tmpNum

    if (tmpHas){
        lab.node.color = cc.color(255,255,255)
    }else{
        lab.node.color = cc.color(255,0,0)
    }

    if (tmpFree == 1){
        if(useGoldPay){
            type.getComponent(cc.Label).string = Ls.get(20050)
        }
        else{
            type.getComponent(cc.Label).string = Ls.get(20053)
        }
    }else if(tmpFree == 2){
         type.getComponent(cc.Label).string = Ls.get(20050)
    }
    else{
        type.active = false
    }
}

exports.onBtnClick = function(config,payConfigData,drawType,num,teamNum,itemNum,callback,isFree=false) {
    var tmpSend = this.checkItem(payConfigData,isFree)
    if(tmpSend && teamNum && !isFree){
        tmpSend = Gm.checkBagAddTeam(teamNum,callback)
    }
    if(tmpSend && itemNum && !isFree){
        tmpSend = Gm.checkBagAddItem(itemNum,true)
    }
    if(tmpSend && !isFree){
        if(Gm.getLogic("LotteryLogic").checkNoMoreRemindsToday()){
            tmpSend = this.checkCostDiamond(drawType,payConfigData, function(data){
                Gm.ui.create("LotteryDiamondTip",{
                    num:num,
                    data:data,
                    id:config.id,
                    drawType:drawType,
                    quality:config.darwQuality,
                    callback:callback})
            })
        }
    }        
    if (tmpSend || isFree){
        Gm.cardNet.sendDrawCard(config.id,drawType,config.darwQuality)
        return tmpSend
    }
    return false
}

exports.checkItem = function(data,isNoTips){
    if (data.length > 0){
        for(const i in data){
            var item = Func.itemConfig(data[i])
            if (item.num >= data[i].num){
                return true
            }
        }
    }
    if (!isNoTips){
        var item = data[data.length-1]
        var conf = Gm.config.getItem(item.id)
        if (item.id == ConstPb.playerAttr.GOLD){
            Gm.floating(2001)
        }else if (conf){
            Gm.floating(conf.name + Ls.get(1740))
        }else{
            Gm.floating(20011)    
        }
        Gm.ui.create("HeroAccessView",{itemType:ConstPb.itemType.TOOL,baseId:item.id})
    }
    return false
}

exports.TICKET_BASE = 200102//初级抽奖券
exports.TICKET_HIGH = 200103//高级抽奖券
exports.checkCostDiamond=function(drawType, data, func){
    if(data.length > 0){
        for(const i in data){
            var item = Func.itemConfig(data[i])
            if( item.num >= data[i].num){
                if(data[i].id == ConstPb.playerAttr.GOLD || data[i].id == ConstPb.playerAttr.PAY_GOLD || data[i].id == this.TICKET_BASE || data[i].id == this.TICKET_HIGH){
                    var gold = 0
                    var gold_pay = 0
                    var ticket = 0
                    var ticket_high = 0
                    if(data[i].id == ConstPb.playerAttr.GOLD){
                        var cost = Gm.userInfo.golden - data[i].num 
                        gold = data[i].num
                        if(cost < 0){   
                            gold_pay = Math.abs(cost)
                        }
                    }else if(data[i].id == ConstPb.playerAttr.PAY_GOLD){
                        gold_pay = data[i].num
                    }else if(data[i].id == this.TICKET_BASE || data[i].id == this.TICKET_HIGH){
                        if(drawType == 0){
                            return true
                        }
                        if(data[i].id == this.TICKET_BASE){
                            ticket = data[i].num
                        }else{
                            ticket_high = data[i].num
                        }
                    }
                    if(func){
                        func({gold:gold,gold_pay:gold_pay,ticket:ticket,ticket_high:ticket_high})
                    }
                    return false    
                }
                return true
            }
        }
    }
    return false
}