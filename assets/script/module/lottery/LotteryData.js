const page_mode = {//左边类型 右边数组下标
    1:0,
    2:1,
    3:3,
    4:3,
    6:3,
    5:2,
    7:4,
}
cc.Class({
    properties: {
    	lotteryList:null,
        cardList:null,
    },
    ctor:function(){
        this.m_rewardItems = null //获得的物品
        this.clearData()
    },
    clearData:function(){
        this.cardList = [
            [],
            [],
            [],
            [],
            [],
        ]
        this.m_arrUnlockHero = [];
        this.m_nMaxMilliSecToday = 0 //当天的最大时间戳
    },
    getLottery:function(fieldId){
        for(const i in this.cardList){
            var field = checkint(i)
            if (field == fieldId){
                return this.cardList[i]
            }
        }
    },
    openAll:function(){
        return this.cardList
    },
    setData:function(args){
        // this.cardList[args.activityID] = {}
        // this.cardList[args.activityID].offerStatus = args.offerStatus
        // this.cardList[args.activityID].info = []
        // for(const i in args.info){
        //     this.cardList[args.activityID].info.push(args.info[i])
        // }
        for(const i in args.info){
            var tmpPage = -1
            var fieldIdx = -1
            var v = args.info[i]
            v.nowTime = Gm.userData.getTime_m()
            const config = Gm.config.getLotteryConfig(v.fieldId)
            var tmpIdx = page_mode[config.mode]
            if (tmpIdx != undefined){
                if (this.cardList[tmpIdx]){
                    tmpPage = tmpIdx
                }
                for(const j in this.cardList[tmpIdx]){
                    if (this.cardList[tmpIdx][j] && this.cardList[tmpIdx][j].data.fieldId == v.fieldId){
                        tmpPage = tmpIdx
                        fieldIdx = checkint(j)
                        break
                    }
                    if (this.cardList[tmpIdx][j].data.nextJobEquipTime != null && v.fieldId >= 1004 && v.fieldId <= 1007){
                        tmpPage = tmpIdx
                        fieldIdx = checkint(j)
                        break
                    }
                }
            }else{
                for(const j in this.cardList){
                    if (this.cardList[j][0] && this.cardList[j][0].data.fieldId == v.fieldId){
                        tmpPage = j
                        fieldIdx = 0
                        break
                    }
                }
                if (tmpPage == -1){
                    tmpPage = this.cardList.length
                }
            }
            if (this.cardList[tmpPage]){// 限定英雄，新加页面
                if (fieldIdx == -1){
                    this.cardList[tmpPage].push({
                        data:v,
                        config:config,
                    })
                }else{
                    this.cardList[tmpIdx][fieldIdx].data = v
                    this.cardList[tmpIdx][fieldIdx].config = config
                }
            }else{// 限定英雄，新加页面
                this.cardList[tmpPage] = [{
                    data:v,
                    config:config,
                }]
            }
        }
    },
    getData:function(idx){
        return this.cardList[idx]
    },
    setOffer:function(activityID,itemId){
        this.cardList[activityID].offerStatus = itemId
    },
    setOne:function(field,args){
        for(const i in this.cardList){
            for(const j in this.cardList[i]){
                if (this.cardList[i][j].data.fieldId == field){
                    this.cardList[i][j].data.hasDrawOne = args.info.hasDrawOne
                    this.cardList[i][j].data.nextFreeTime = args.info.nextFreeTime
                    this.cardList[i][j].data.boxSumCount = args.info.boxSumCount
                    this.cardList[i][j].data.boxOpenId = args.info.boxOpenId
                    this.cardList[i][j].data.nowTime = Gm.userData.getTime_m()
                    break
                }
            }
        }
    },
    getOne:function(destId,field){
        if (this.cardList[destId] && this.cardList[destId].info){
            for(const i in this.cardList[destId].info){
                if (this.cardList[destId].info[i].fieldId == field){
                    return this.cardList[destId].info[i]
                }
            }
        }
    },
    getUsed:function(destData){
        var tmpHas = 0
        var tmpIdx = -1
        for(const i in destData){
            tmpIdx = i
            if (destData[i].type == ConstPb.itemType.PLAYER_ATTR){
                if (Gm.userInfo.getDataBy(destData[i].id) >= destData[i].num){
                    tmpHas = destData[i].id
                    break
                }
            }else if(destData[i].type == ConstPb.itemType.TOOL){
                var item = Gm.bagData.getItemByBaseId(destData[i].id)
                if (item && item.count >= destData[i].num){
                    tmpHas = destData[i].id
                    break
                }
            }
        }
        return {done:tmpHas,idx:tmpIdx}
    },
    setBoxShow:function(award){
        this.m_tBoxAward = award
    },
    getLocalUnLockHeroId:function(heroid){
        var heroIdList = JSON.parse(cc.sys.localStorage.getItem("unlockheroid") || "[]") 
        return heroIdList.indexOf(heroid)
    },
    setLocalUnLockHeroId:function(heroid){
        var heroIdList = JSON.parse(cc.sys.localStorage.getItem("unlockheroid") || "[]")
        heroIdList.push(heroid)
        
        cc.sys.localStorage.setItem("unlockheroid",JSON.stringify(heroIdList))
    },
    getUnLockHeroIdFromExtraId:function(id, heroid){
        var length = this.m_arrUnlockHero.length    
        for(let i = 0; i < length; i++){
            if(i != id){
                if(this.m_arrUnlockHero[i] == heroid){
                    return true
                }
            }
        }
        return false
    },

    setUnLockHeroId:function(id, heroid){
        this.m_arrUnlockHero[id] = heroid
    },
    clearUnLockHeroId:function(){
        this.m_arrUnlockHero.length = 0
    },
    getDataByField(field){
        for(const i in this.cardList){
            for(const j in this.cardList[i]){
                if (this.cardList[i][j].data.fieldId == field){
                    return this.cardList[i][j].data
                }
            }
        }
    },
    getConfigByFieId(fieId){
        for(const i in this.cardList){
            for(const j in this.cardList[i]){
                if (this.cardList[i][j].data.fieldId == fieId){
                    return this.cardList[i][j].config
                }
            }
        }
    },

    //推荐阵容数据
    getSuggestData(){
        if(!this.suggestData){
            var config = Gm.config.getConfig("TuijianConfig")
            this.suggestData = []
            for(var i=0;i<config.length;i++){
                var campId = config[i].campId -1
                if(!this.suggestData[campId]){
                    this.suggestData[campId] = []
                }
                this.suggestData[campId].push(config[i])
            }
            this.sortSuggestData()
        }
        return this.suggestData
    },
    sortSuggestData(){
        //排序置顶
        this.suggestData.sort(function(a,b){
            if(a[0].type != b[0].type){
                return b[0].type - a[0].type
            }
             return a[0].campId - b[0].campId
        })
        //排序新
        // for(var i=0;i<this.suggestData.length;i++){
        //     var data = this.suggestData[i]
        //     if(data){
        //         data.sort(function(a,b){
        //             if(a.type == 2 && b.type!=2){
        //                 return 1
        //             }
        //             else if(a.type != 2 && b.type==2){
        //                 return -1
        //             }
        //             return a.id - b.id
        //         })
        //     }
        // }
    },

    //
    getProbabilityDisplayConfig(){
            return Gm.config.getConfig("ProbabilityDisplayConfig")
    },
    getProbabilityDisplayData(){
        //if(!this.probabilityDisplayData){
            var data = this.getProbabilityDisplayConfig()
           var probabilityDisplayData = this.dealProbabilityDisplayData(data)
           var temp = []
        for(var i=0;i<probabilityDisplayData.length;i++){
                temp.push(Func.copyObj(probabilityDisplayData[i]))
        }
        return temp
    },
    dealProbabilityDisplayData(data){
        var tempData = []
        for(var i=0;i<data.length;i++){
            var item = data[i]
            if(!tempData[item.mode-1]){
                tempData[item.mode-1] = []
            }
            tempData[item.mode-1].push(item)
        }
        return tempData
    },
    getProbabilityDisplayDataByIndex(index){
        var data = this.getProbabilityDisplayData()
        return  data[index]
    },
    getProbabilityDisplayDataByMode(mode){
        var data = this.getProbabilityDisplayData()
        for(var i in data){
            if(data[i] && data[i][0] && data[i][0].mode == mode){
                return data[i]
            }
        }
        return []
    },
    getProbabilityDisplayDataByIndexAndQuli(mode,qualityId){
        var data = this.getProbabilityDisplayDataByMode(mode)
        var tdata = []
        for(var i=0;i<data.length;i++){
            if(data[i].qualityId == qualityId ){
                tdata.push(data[i])
                if(data[i].weight.indexOf("%") != -1){
                    data[i].weight = parseFloat(data[i].weight.replace("%",""))/100
                }
            }
        }
        tdata.sort(function(a,b){
            return b.type - a.type 
        })
        return tdata
    },
    dealNotActivityHero(data,filedId){
        //先计算出未激活的比分
        var nActivityWight= 0
        for(var i=0;i<data.length;i++){
            if(!Gm.lotteryData.isActivateHero(filedId,data[i].wId)){
                nActivityWight = nActivityWight + parseFloat(data[i].weight)
                 data[i].activity = false
            }
            else{
                 data[i].activity = true
            }
        }
        //
        var total = LotteryFunc.getChoukaPercentByQualityId(5)
        if(filedId == 1002){
            total = 0.0261
        }
        var surplusWeight = total - nActivityWight
        for(var i=0;i<data.length;i++){
            if(!data[i].activity){
                data[i].weight = 0
            }
            else{
                var tpercent = parseFloat(data[i].weight) / surplusWeight
                var weight = nActivityWight * tpercent
                data[i].weight =  parseFloat(data[i].weight) + weight
            }
        }
    },
    isActivateHero(filedId,id){
        if(filedId != 1001 && filedId != 1002 && filedId != 1008){
            return true;
        }
        var baseId = parseInt(id/1000)
        var config = Gm.config.getHeroByType(1)
        var key = false
        for(var i=0;i<config.length;i++){
            if(config[i].id == baseId){
                key = true
                break
            }
        }
        if(key){
            var activityHeros = Gm.heroData.getUnLockHero()
            for(var i=0;i<activityHeros.length;i++){
                if(parseInt(activityHeros[i]/1000) == baseId){
                    return true
                }
            }
            return false
        }
        return true
    },
     isActivateHero1(filedId,id){
        var baseId = parseInt(id/1000)
        var config = Gm.config.getHeroByType(1)
        var key = false
        for(var i=0;i<config.length;i++){
            if(config[i].id == baseId){
                key = true
                break
            }
        }
        if(key){
            var activityHeros = Gm.heroData.getUnLockHero()
            for(var i=0;i<activityHeros.length;i++){
                if(parseInt(activityHeros[i]/1000) == baseId){
                    return true
                }
            }
            return false
        }
        return true
    },
    getQuiliTyIdTypesArray(mode){
         var data = this.getProbabilityDisplayDataByMode(mode)
         var ids = []
         var isInArray = function(array,ids){
             for(var i=0;i<array.length;i++){
                 if(array[i] == ids){
                     return true
                 }
             }
             return false
         }
         for(var i=0;i<data.length;i++){
             if(!isInArray(ids,data[i].qualityId)){
                 ids.push(data[i].qualityId)
             }
         }
         return ids
    },
    //每天
    setCheckRedTime(type,tkey){
        if(type == 0){
            var time = new Date(new Date().toLocaleDateString()).getTime()
            var key = Gm.userInfo.id + "commonRedShowKey"
            if(tkey){
                key = key + tkey
            }
             cc.sys.localStorage.setItem(key,time)
        }
        else if(type == 1){
            var time = new Date(new Date().toLocaleDateString()).getTime()
            var key = Gm.userInfo.id + "friendRedShowKey"
            cc.sys.localStorage.setItem(key,time)
        }
    },
    checkCommonRedNeedShow(tkey){
        var time = new Date(new Date().toLocaleDateString()).getTime()
        var key = Gm.userInfo.id + "commonRedShowKey"
        if(tkey){
            key = key + tkey
        }
        var timepre =  parseInt(cc.sys.localStorage.getItem(key) || "0")
        if(time == timepre){
            return false
        }
        return true
    },

    checkFriendRedNeedShow(){
        var time = new Date(new Date().toLocaleDateString()).getTime()
        var key = Gm.userInfo.id + "friendRedShowKey"
        var timepre =  parseInt(cc.sys.localStorage.getItem(key) || "0")
        if(time == timepre){
            return false
        }
        else{
            return true
        }
    },
    //普通是否有红点
    checkCommonOneRed(){
        //免费
        var data = this.getDataByField(1001)
        if(data && data.nextFreeTime == 0){
            return true
        }
        if(!this.checkCommonRedNeedShow("one")){
            return false
        }
        //有券
        var config = this.getConfigByFieId(1001)
        if(config){
              if(this.checkCanGet(config.oneCost)){
                  return true
              }
        }

        return false
    },
    //
    checkCommonTenRed(){
        if(!this.checkCommonRedNeedShow("ten")){
            return false
        }
        //有券
        var config = this.getConfigByFieId(1001)
        if(config){
              if(this.checkCanGet(config.tenCost)){
                  return true
              }
        }

        return false
    },
    //友情购买
    checkFriendOneRed(){
        if(!this.checkFriendRedNeedShow()){
            return false
        }
         if(this.cardList && this.cardList[1] && this.cardList[1][0].config ){
              var oneCost = this.cardList[1][0].config.oneCost
              if(this.checkCanGet(oneCost)){
                  return true
              }
        }
        return false
    },
    checkFriendTenRed(){
         if(!this.checkFriendRedNeedShow()){
            return false
        }
          if(this.cardList && this.cardList[1] && this.cardList[1][0].config ){
              var tenCost = this.cardList[1][0].config.tenCost
              if(this.checkCanGet(tenCost)){
                  return true
              }
        }
        return false
    },
    checkCanGet(costs){
        for(var i=0;i<costs.length;i++){
            if(costs[i].id != 1001 &&  costs[i].id != 1014){//钻石和免费钻石不检测
                var tcost = costs[i].num
                var myHave = Gm.userInfo.getCurrencyNum(costs[i].id) || 0
                if(tcost>myHave){
                    return false
                }
            }
        }
        return true
    },
    //活动是否开启
    activeIsOpen(){
        //判断是否开启
        var config = this.getConfigByFieId(5001)
        if ( !config  ||  (config && config.openMapId && Gm.userInfo.maxMapId < config.openMapId)){
            return false
        }
        //判断是否在时间内
        var config = Gm.config.getEventGroup(5001)
        if(!config){
           return false
        }
        else{
            var stime = Func.dealConfigTime(config.eventStart)
            var etime =  Func.dealConfigTime(config.eventEnd)
            var currentTime = Gm.userData.getTime_m()
            if(currentTime < stime  || currentTime > etime){
                return false
            }
        }
        return true
    },
    getWishNumber(){
        var data =  this.getDataByField(1001)
        if(data.wishTotal >= LotteryFunc.getWishTotalNumber()){
            return LotteryFunc.getWishTotalNumber()
        }
        return data.wishTotal
    },
    addWishNumber(num){
        var data =  this.getDataByField(1001)
        data.wishTotal = data.wishTotal + num
    },
    getWishOpenNumber(){
        var data =  this.getDataByField(1001)
        return data.totalCount
    },
    wishIsOpen(){
        var data =  this.getDataByField(1001)
        return data.totalCount >= LotteryFunc.getWishOpenNumber()
    },
    hasWishHero(){//有没有心愿单
        var data =  this.getDataByField(1001)
        for(var i=0;i<data.wishInfo.length;i++){
            if(data.wishInfo[i]!=0){
                return true
            }
        }
        return false
    },
    choukTZIsOpen(){
        var config = this.getConfigByFieId(1008)
        return config && config.openMapId <= Gm.userInfo.maxMapId
    },
    setTzHero(id){
        var data =  this.getDataByField(1008)
        data.singleHero =  parseInt(id)
    },
    getTzHero(){
        var data = this.getDataByField(1008)
        return data.singleHero
    },
    setTzJob(id){
        var data =  this.getDataByField(1008)
        data.equipJob =  parseInt(id)
    },
    getTzJob(){
         var data =  this.getDataByField(1008)
        return data.equipJob || 1
    },
    getLotteryThirdInfoData(){
        var data = {}
        var config = this.getConfigByFieId(1008)
        var total = 10000
        var heroPercent = 0
        var equipPercent = 0
        var otherPercent = 0
        for(var i=0;i< config.itemGroup.length;i++){
            if(config.itemGroup[i].type == 80000){
                heroPercent = config.itemGroup[i].weights/total
            }
            else if(config.itemGroup[i].type == 40000){
                equipPercent = config.itemGroup[i].weights/total
            }
            else if(config.itemGroup[i].type == 30000){
                otherPercent = config.itemGroup[i].weights/total
            }  
        }
        //英雄
        data.heroData = {heroId:this.getTzHero(),percent:heroPercent}
        //装备
        data.equipData = this.getEquipInfo(equipPercent)
        data.other = this.getTzOtherInfo(otherPercent)
        cc.log("getLotteryThirdInfoData=",data)
        return data
    },
    getEquipInfo(equipPercent){
        var type = this.getTzJob()
        var config = Gm.config.getPrizeConfig(40000+ parseInt(type))
        var data = {}
        data.percent = equipPercent
        data.type = type
        var total = 0
        data.itemInfo = []
        for(var i=0;i<config.itemInfo.length;i++){
            total = total + config.itemInfo[i].weights
        }

        var tempEquipArray = []
        for(var i=0;i<config.itemInfo.length;i++){
            var temp = {}
            var tconfig = Gm.config.getEquip(config.itemInfo[i].id)
            temp.name = tconfig.name
            temp.type = config.itemInfo[i].type
            temp.id = tconfig.id
            temp.num = config.itemInfo[i].num
            temp.quality = tconfig.equipClass
            temp.percent =   equipPercent * (config.itemInfo[i].weights/total)
            if(!tempEquipArray[temp.quality]){
                tempEquipArray[temp.quality] = []
            }
            tempEquipArray[temp.quality].push(temp)
        }

        for(var i in tempEquipArray){
            data.itemInfo.push(tempEquipArray[i])
        }
        return data
    },
    getTzOtherInfo(otherPercent){
        var data = {}
        data.percent = otherPercent
        data.itemInfo = []
        var config = Gm.config.getPrizeConfig(30000)
        var total = 0
        for(var i=0;i<config.itemInfo.length;i++){
            total = total + config.itemInfo[i].weights
        }
        for(var i=0;i<config.itemInfo.length;i++){
            var temp = {}
            var tconfig = Gm.config.getItem(config.itemInfo[i].id)
            temp.name = tconfig.name
            temp.type = config.itemInfo[i].type
            temp.id = config.itemInfo[i].id
            temp.num =  config.itemInfo[i].num
            temp.percent = otherPercent * ( config.itemInfo[i].weights/total)
            data.itemInfo.push(temp)
        }
        return data
    }
});
