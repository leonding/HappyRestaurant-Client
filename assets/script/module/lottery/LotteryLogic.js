var CoreLogic = require("CoreLogic")
cc.Class({
    extends: CoreLogic,
    properties: {
        
    },
    ctor:function(){

    },
    register:function(){
        this.events[Events.LOGIN_SUC]             = this.onLogicSuss.bind(this)
        this.events[MSGCode.OP_DRAW_CARD_INFO_S]  = this.onDrawCardInfo.bind(this)
        this.events[MSGCode.OP_DRAW_CARD_S]       = this.onDrawCard.bind(this)
        this.events[MSGCode.OP_USE_OFFER_S]       = this.onUseOffer.bind(this)
        this.events[MSGCode.OP_DRAW_EXCHANGE_S]   = this.onDrawExchange.bind(this)
        this.events[MSGCode.OP_DRAW_OPEN_BOX_S]   = this.onDrawOpenBox.bind(this)
        this.events[MSGCode.OP_PUSH_REWARD_S]     = this.onNetReward.bind(this)
        this.events[MSGCode.OP_PUSH_CONSUMEITEM_S]  = this.onUserInfoUpdate.bind(this)//用户信息变更
        this.events[MSGCode.OP_COLLECT_FRIENDPOINT_S] = this.onCollectFriendPoints.bind(this)
        this.events[MSGCode.OP_SELECT_SINGLE_HERO_S] = this.onSelectSingleHero.bind(this)
    },
    onDrawOpenBox:function(args){
        var tmpItem = Gm.config.getDrawBoxRewardBy2(args.mode,args.rewardBoxId).reward
        Gm.lotteryData.setBoxShow(tmpItem)
        for(const i in Gm.lotteryData.cardList){
            for(const j in Gm.lotteryData.cardList[i]){
                if (Gm.lotteryData.cardList[i][j].data.fieldId == Gm.cardNet.m_iDrawField){
                    Gm.lotteryData.cardList[i][j].data.boxSumCount = args.boxSumCount
                    break
                }
            }
        }
        if (this.view){
            this.view.updateInfo()
        }
    },
    onLogicSuss:function(){
        Gm.lotteryData.clearData()
    },
    onDrawCardInfo:function(args){
    	Gm.lotteryData.setData(args)
        if (this.view){
            this.view.updateInfo()
        }

        setTimeout(() => {//背包数据可能还没有回来
            Gm.red.refreshEventLotteryState()
        }, 1000);
        
        this.checkNextFreeTime()
    },
    onDrawCard:function(args){
        Gm.lotteryData.setOne(Gm.cardNet.m_iDrawField,args)
        if (args.items){
            var tmpData = []
            var tmpHas = " "
            for(const i in args.items){
                // if (args.items[i].itemType == ConstPb.itemType.HERO_CHIP){
                //     Gm.lotteryData.setOffer(Gm.cardNet.m_iDrawActivity,0)
                // }
                // if (args.items[i].baseId == 1008){
                //     tmpHas = Ls.get(20015)
                // }
            }
            //心愿单
            if(Gm.cardNet.m_iDrawField == 1001){
                var lotteryInfo = Gm.lotteryData.getDataByField(Gm.cardNet.m_iDrawField)
                for(const i in args.items){
                    for(const j in lotteryInfo.wishInfo){
                        if(lotteryInfo.wishInfo[j] && args.items[i].baseId == lotteryInfo.wishInfo[j].baseId){
                            lotteryInfo.wishInfo[j].status = 1
                        }
                    }
                }
                lotteryInfo.wishTotal   = args.info.wishTotal
                lotteryInfo.totalCount = args.info.totalCount
            }
            Gm.lotteryData.pauseUnlock = true

            var data = {fieldId:Gm.cardNet.m_iDrawField,list:args.items,tips:tmpHas}
            var name = "LotteryAwardStartA"
            var lotteryMain = Gm.ui.getLayer("LotteryMain")
            if(lotteryMain && lotteryMain.active){
                if (Gm.ui.isExist(name)){
                    var tmpNode = Gm.ui.getLayer(name)
                    var viewSp = tmpNode.getComponent(name)
                    if(viewSp){
                        viewSp.enableUpdateView(data)
                    }
                }else{
                    Gm.ui.create(name,data)
                }
                Gm.ui.removeByName("LotteryAwardResult")
            }
        }
        if (this.view){
            this.view.updateInfo()
        }

        Gm.red.refreshEventLotteryState()
        this.checkNextFreeTime()
    },
    onUseOffer:function(args){
        Gm.ui.removeByName("SecondUsed")
        Gm.floating(Ls.get(20016))
        Gm.lotteryData.setOffer(Gm.cardNet.m_iOfferActivity,Gm.cardNet.m_iOfferItem)
        if (this.view){
            this.view.updateInfo()
        }
    },
    onDrawExchange:function(args){
        var tmpName = "LotteryExchange"
        var layer = Gm.ui.getLayer(tmpName)
        if(layer && layer.active){
            layer.getComponent(tmpName).updateNums()
        }
        Gm.floating(Ls.get(20017))
    },
    checkUnLockHeroId:function(heroid){
        var heroidIndex = Gm.lotteryData.getLocalUnLockHeroId(heroid)
        if(heroidIndex == -1){
            Gm.lotteryData.setLocalUnLockHeroId(heroid)
        }
        return heroidIndex
    },
    checkDuplicateUnLockHero:function(id, heroid){
        var bExist = Gm.lotteryData.getUnLockHeroIdFromExtraId(id, heroid)
        if(!bExist){
            this.setUnLockHeroId(id, heroid)
        }
        return bExist
    },
    setUnLockHeroId:function(id, heroid){
        Gm.lotteryData.setUnLockHeroId(id, heroid)
    },
    setNoMoreRemindsToday:function(isOpen){
        if(isOpen){
            Gm.lotteryData.m_nMaxMilliSecToday = new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1
            cc.sys.localStorage.setItem("max_millisec_today" + Gm.userInfo.id,Gm.lotteryData.m_nMaxMilliSecToday)
        }else{
            Gm.lotteryData.m_nMaxMilliSecToday = 0
            cc.sys.localStorage.setItem("max_millisec_today" + Gm.userInfo.id ,0)
        }
    },
    checkNoMoreRemindsToday:function(){
        var curMilliSec = new Date().getTime()
        var max_millisec_today = Number(cc.sys.localStorage.getItem("max_millisec_today"+ Gm.userInfo.id))
        if(Gm.lotteryData.m_nMaxMilliSecToday == 0 && max_millisec_today > 0){
            Gm.lotteryData.m_nMaxMilliSecToday = max_millisec_today
        }
        return curMilliSec > Gm.lotteryData.m_nMaxMilliSecToday
    },
    onNetReward:function(args){
        if(args.actionType == 1020){//抽卡 
            if(args.items[0].itemType == ConstPb.itemType.HERO_CARD){
                Gm.lotteryData.m_rewardItems = Func.copyObj(args.items)
            }
        }
        //获得抽奖券 或者友情
        if(args && args.items){
            for(var i=0;i<args.items.length;i++){
                if(args.items[i] && (args.items[i].baseId == 200102 || args.items[i].baseId ==200103 || args.items[i].baseId ==1012)){
                    Gm.red.refreshEventLotteryState()
                    break;
                }
            }
        }
        if(args && args.attrInfos){
            for(var i=0;i<args.attrInfos.length;i++){
                if(args.attrInfos[i].attr ==1012){
                    Gm.red.refreshEventLotteryState()
                    break;
                }
            }
        }
    },
    getLotteryItems(){
        return Gm.lotteryData.m_rewardItems
    },
    onUserInfoUpdate(data){
        if(data && data.consumeAttrInfo){
            for(var i=0;i<data.consumeAttrInfo.length;i++){
                if(data.consumeAttrInfo[i].attr ==1012){
                    Gm.red.refreshEventLotteryState()
                    break
                }
            }
        }
    },
    //获得红心
    onCollectFriendPoints(){
        setTimeout(() => {
             Gm.red.refreshEventLotteryState()
        }, 1000);
    },
    //检查下一次免费的时间
    checkNextFreeTime(){
        if(this.nextFreeTimerId){
            clearTimeout(this.nextFreeTimerId)
        }
        var data = Gm.lotteryData.getDataByField(1001)
        if(data && data.nextFreeTime == 0 ){
        }
        else{
            var time = (data.nextFreeTime - (Gm.userData.getTime_m() -data.nowTime))
            if(time >0 && time < 60*60*1000 ){
                this.nextFreeTimerId = setTimeout(function(){
                        data.nextFreeTime = 0
                        Gm.red.refreshEventLotteryState()
                }, time + 1200);
            }
        }
    },
    onSelectSingleHero(data){
        if(data){
            if(data.heroBaseId){
                Gm.lotteryData.setTzHero(data.heroBaseId)
            }
            if(data.equipJob){
                Gm.lotteryData.setTzJob(data.equipJob)
            }
        }
    },
});

