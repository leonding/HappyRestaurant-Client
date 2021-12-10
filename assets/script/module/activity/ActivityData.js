cc.Class({
    properties: {
    	
    },
    ctor:function(){
        this.clearData()
    },
    clearData:function(){
        this.data = {weekCardInfo:[]}
        this.planRewardInfo=[]//102 103 领取的奖励信息
    },
    setData:function(args){
        this.data = args
        for(let index in this.data.planInfo){
                if(this.data.planInfo[index].type == AtyFunc.TYPE_TIME_UP || this.data.planInfo[index].type == AtyFunc.TYPE_TIME_CHAPTER){
                    for(let id in this.data.planInfo[index].receiveId){//免费的
                        this.pushPlanAty({activityId:this.data.planInfo[index].receiveId[id],state:1})
                    }
                    for(let id in this.data.planInfo[index].payReceiveId){//付费的
                        var item = this.getPlanAtyId(this.data.planInfo[index].payReceiveId[id])
                        if(item){
                            item.state = 2
                        }
                        else{
                            this.pushPlanAty({activityId:this.data.planInfo[index].payReceiveId[id],state:2})
                        }
                    }
                }
                else{
                    for(let id in this.data.planInfo[index].receiveId){
                        this.pushAty({activityId:this.data.planInfo[index].receiveId[id]})
                    }
                }
        }
        this.checkShowRedItem()

        var eprconfigData = Gm.config.getEventPayRewardStartLevel(AtyFunc.TYPE_TIME_NOOB,Gm.userInfo.level)
        
        this.time_noob_level = 0
        if(eprconfigData && eprconfigData.length>0){
            this.time_noob_level = eprconfigData[0].startLevel
        }

        if(this.data.eventGiftExpire == 0 ){
            cc.sys.localStorage.setItem("limitDay",0)
        }
    },
    getHasVipPackage(packageId){
        return Func.indexOf(this.data.vipPacketIds,packageId) > -1
    },
    vipFlState(){
        if (this.data.isSignVip == 1){
            return 1
        }
        if (Gm.config.getVip().vip_reward_everyday.length == 0){
            return 2
        }
        return 0
    },
    isUnlockPassMedal(){
        return this.data.isUnlockPassMedal == 1
    },
    getAtyId(id){
        if (this.data){
            for (let index = 0; index < this.data.weekCardInfo.length; index++) {
                const v = this.data.weekCardInfo[index];
                if (v.activityId == id){
                    v.num = v.num || 1
                    return v
                }
            }
        }
    },
    getPlanAtyId(id){
          if (this.data){
            for (let index = 0; index < this.planRewardInfo.length; index++) {
                const v = this.planRewardInfo[index];
                if (v.activityId == id){
                    v.num = v.num || 1
                    return v
                }
            }
        }
    },
    isHasAty(id){
        if (this.getAtyId(id)){
            return true
        }
        return false
    },
    isHasFreePlanAty(id){
        var item = this.getPlanAtyId(id)
        if(item){
            return item.state == 1 || item.state == 2
        }
        return false
    },
    isHasPayPlanAty(id){
        var item = this.getPlanAtyId(id)
        if(item){
            return item.state == 2
        }
        return false
    },
    getGrowPlanInfo(type){
        for(let i in this.data.planInfo){
            if(this.data.planInfo[i].type == type){
                return this.data.planInfo[i]
            }
        }
        return null
    },
    isPlanGrow(type){//已经购买了
        if(type == AtyFunc.TYPE_TIME_NOOB){
            return false;
        }
        var data = this.getGrowPlanInfo(type)
        if(data){
            return data.expireTime == 0
        }
        return false
    },
    isPlanGrowPast(type){
        if (!this.isPlanGrow(type)){
            var data = this.getGrowPlanInfo(type)
            if ( data && Gm.userData.getTime_m() > data.expireTime){
                return true
            }
        }
        return false
    },
    setPlanGrow(type,key){
        var data = this.getGrowPlanInfo(type)
        if(data && key){
            data.expireTime = 0
        }
    },
    isAllReceive(type){//全部获取
        var list = Gm.config.getEventPayReward(type)
        if(list){
            for(let i=0;i<list.length;i++){
                if(!this.isHasAty(list[i].id)){
                    return false
                }
            }
        }
        return true
    },
    getEndTime(type){
        var data = this.getGrowPlanInfo(type)
        if(data){
            return data.expireTime
        }
        return null
    },
    pushAty(item){
        for(let key in this.data.weekCardInfo){
            if(this.data.weekCardInfo[key].activityId == item.activityId){
                this.data.weekCardInfo[key].num++
                return 
            }
        }
        this.data.weekCardInfo.push(item)
    },
    pushPlanAty(item){
        this.planRewardInfo.push(item)
    },
    getLimitByIndex(index){
        return this.data.limitGift[index]
    },
    isLimitEndTimeByIndex(index){
        var dd = null
        if(this.data && this.data.limitGift)
        {
            dd = this.data.limitGift[index]
        }
        if (dd){
            var time = Func.translateTime(dd.endTime)
            return time
        }
        return 0
    },
    removeLimitGift(id){
        Func.forRemove(this.data.limitGift,"limitId",id)
    },
    getLimitById(id){
        return Func.forBy(this.data.limitGift,"limitId",id)
    },
    addLimit(item){
        this.limitGiftItem = item
        if (!this.data.limitGift){
            this.data.limitGift = []
        }
        this.data.limitGift.push(item)
    },
    showLimitGift(){
        if (this.limitGiftItem){
            Gm.ui.create("LimitGiftView",{limitId:this.limitGiftItem.limitId})
        }
    },
    checkIsOpen(type){
        if(type == AtyFunc.TYPE_TIME_NOOB){
            var data = this.getGrowPlanInfo(type)
            if (data && Gm.userData.getTime_m() > data.expireTime){
                return false
            }
            return true
        }
        else if(type == AtyFunc.TYPE_TIME_UP || type == AtyFunc.TYPE_TIME_CHAPTER){
            var data = this.getGrowPlanInfo(type)
            return data!=null && !this.isAllReceive(type)
        }else if(type == AtyFunc.TYPE_TIME_LIMIT ){
            return this.checkisOpenLimitGift()
        }
    },

    checkisOpenLimitGift(){
        //检测情人节限时礼包
        return  (this.data.eventGiftExpire || 0) >= Gm.userData.getTime_m()
    },

    getLimitGiftTime(){
        //获取情人节礼包活动时间
        return this.data.eventGiftExpire || 0
    },

    //检查新手礼包是否升级到新的等级了
    checkTimeNoobGrow(){
        var type = AtyFunc.TYPE_TIME_NOOB
        var epconfigData = Gm.config.getEventPay(type);
        var eprconfigData = Gm.config.getEventPayRewardStartLevel(type,Gm.userInfo.level)
        if(eprconfigData && eprconfigData.length>0 && eprconfigData[0].startLevel == this.time_noob_level){//可以开启的等级不变 结束时间不变
        }
        else{//开启新的
            var planInfo = this.getGrowPlanInfo(type)
            if(planInfo){
                planInfo.expireTime = Gm.userData.getTime_m() + epconfigData.endTime *1000
                this.time_noob_level = Gm.userInfo.level
            }
        }
    },
    checkNeedOpenPlayInfo(){
        var isNeedOpen = this.data && this.data.planInfo && this.data.planInfo.length != 0 ? true : false
        if(this.data.planInfo && this.data.planInfo.length == 1 && this.data.planInfo[0].type == AtyFunc.TYPE_TIME_LIMIT){//情人节限时礼包不在这里检测 
            isNeedOpen = false
        }
        return isNeedOpen
    },
    clearPlayInfoData(type){
        for(var i in this.data.planInfo){
            if(this.data.planInfo[i].type == type){
                this.data.planInfo.splice(i,1)
            }
        }
    },
    //检查显示红点
    checkShowRedItem(){
        setTimeout(function(){
            Gm.red.timeNoobRuneRed()
        },0.1)
    },
    //等级
    checkTimeUpRedItem(){
        if(this.checkIsOpen(AtyFunc.TYPE_TIME_UP)){
            var list = Gm.config.getEventPayReward(AtyFunc.TYPE_TIME_UP)
            for(var i=0;i<list.length;i++){
                var ins = true
                if (list[i].receiveCondition[0].num > Gm.userInfo.level){//没有达到
                        ins = false 
                }
                else{//已经达到
                    //免费的已经领取
                    if(this.isHasFreePlanAty(list[i].id) &&  !this.isPlanGrow(AtyFunc.TYPE_TIME_UP)){
                            ins = false
                    }
                    else if(this.isHasPayPlanAty(list[i].id)){
                        ins = false
                    }
                }
                if(ins){
                    return ins
                }
            }
        }
        return false
    },
    //章节
    checkTimeChapterRedItem(){
        if(this.checkIsOpen(AtyFunc.TYPE_TIME_CHAPTER)){
            this.isPlanGrow(AtyFunc.TYPE_TIME_CHAPTER)
            var list = Gm.config.getEventPayReward(AtyFunc.TYPE_TIME_CHAPTER)
            for(var i=0;i<list.length;i++){
                var ins = true
                var needConfigData = Gm.config.getMapById(list[i].receiveCondition[0].num)
                var myConfigData = Gm.config.getMapById(Gm.userInfo.getMaxMapId())
                if (myConfigData.chapter-1 < needConfigData.chapter){
                    ins = false //没有达到
                }
                else{
                        //免费的已经领取
                    if(this.isHasFreePlanAty(list[i].id) &&  !this.isPlanGrow(AtyFunc.TYPE_TIME_CHAPTER)){
                            ins = false
                    }
                    else if(this.isHasPayPlanAty(list[i].id)){
                        ins = false
                    }
                }
                if(ins){
                    return ins
                }
            }
        }
        return false
    },
    isFirstOpenLimitPage(){
        var day = cc.sys.localStorage.getItem("limitDay") || -1
        var localTime = []
        if(day != -1){
            localTime = day.split('-')
        }else{
            localTime[0] = -1
        }

        var diffDay = Func.intervalTime(Gm.userData.getTime_m(),this.data.eventGiftExpire) 
        var time = diffDay.split('-')

        if(parseInt(day)  == -1 || parseInt(localTime[0])  > parseInt(time[0])){
            cc.sys.localStorage.setItem("limitDay",diffDay)
            return true 
        }else{
            return false
        }
    },
    openPage(){
        var diffDay = Func.intervalTime(Gm.userData.getTime_m(),this.data.eventGiftExpire) 
        cc.sys.localStorage.setItem("limitDay",diffDay)
    },

    //是否已经购买了情人节限时礼包的全部内容
    isBuyAllLimitPackage(){
        var isBuyAll = true 
        if(!this.checkisOpenLimitGift()){//活动结束
            return isBuyAll
        }
        var list = Gm.config.getEventPayReward(AtyFunc.TYPE_TIME_LIMIT)
        for(let key in list){
            if(!Gm.activityData.isHasAty(list[key].id)){//如果找到没有购买的礼包
                isBuyAll = false 
                break 
            }
        }
       
      return isBuyAll
    }
});
