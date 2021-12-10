var CoreLogic = require("CoreLogic")
cc.Class({
    extends: CoreLogic,
    properties: {
        
    },
    ctor:function(){

    },
    register:function(){
        this.events[MSGCode.OP_ACTIVITY_INFO_S] = this.onNetAtyInfo.bind(this)
        this.events[MSGCode.OP_ACTIVITY_BUY_VIPPACKET_S] = this.onNetBuyVipGift.bind(this)
        this.events[MSGCode.OP_ACTIVITY_REWARD_S] = this.onNetReward.bind(this)
        
        this.events[MSGCode.OP_PAY_PAYMENT_RESULT_S] = this.onPayResult.bind(this)
        this.events[MSGCode.OP_SYNC_LIMIT_GIFT_S] = this.onSYNCLimetGift.bind(this)
        this.events[MSGCode.OP_BUY_PASSMEDAL_EXP_S] = this.onNetBuyPassMedalExp.bind(this)
        
        //升级更新新手礼包截止时间（开启新的等级的新手礼包）
        this.events[MSGCode.OP_PUSH_REWARD_S]        = this.onNetPushReward.bind(this)
        this.events[Events.ENTER_MAIN]       = this.onEnterMain.bind(this)
    },
    onEnterMain(){
        if (Gm.userInfo.guideStep > 9 && Gm.activityData.data.passMedalResetTime && !Gm.activityData.isUnlockPassMedal()){
            var dateStr = Func.dateFtt("yyyy-MM-dd hh:mm",Gm.activityData.data.passMedalResetTime)
            dateStr = dateStr + "isOpenPass"
            var isOpen = cc.sys.localStorage.getItem(dateStr) || 0
            if (isOpen == 0){//每一轮打开一次
                cc.sys.localStorage.setItem(dateStr,1)
                Gm.ui.queuePush("PassMedalOpenView")
            }
        }
    },
    onNetAtyInfo:function(args){
        Gm.activityData.setData(args)
        if(args.payInfo){
            Gm.userInfo.payInfo = args.payInfo    
        }
        Gm.red.refreshEventState("activity")
    },
    onNetReward(args){
        if (args.result != 0 || args.firstPayId != 0){
            return
        }
        
        var conf = Gm.config.getEventPayRewardId(args.activityId)
        var dd = Gm.activityData.getAtyId(args.activityId)
        if (conf.childType == AtyFunc.TYPE_TXZ){ //通行证
            if (dd == null){
                Gm.activityData.pushAty({activityId:args.activityId,num:1,status:Gm.activityData.isUnlockPassMedal()?2:1})
            }else if (dd.status == 1){
                dd.status = 2
            }
        }else if (conf.childType == AtyFunc.TYPE_TIME_UP || conf.childType == AtyFunc.TYPE_TIME_CHAPTER){//成长基金、
            var item = Gm.activityData.getPlanAtyId(args.activityId)
            var state = 1
            if(Gm.activityData.isPlanGrow(conf.childType)){
                state = 2
            }
            if(item){
                item.state = state
            }
            else{
                Gm.activityData.pushPlanAty({activityId:args.activityId,state:state})
            }
        }else if(conf.childType == AtyFunc.TYPE_VIP){//VIP等级奖励
            Gm.activityData.pushAty({activityId:args.activityId})
        }else if (conf.childType == AtyFunc.TYPE_MONTH_CARD){ //月卡
            dd.status = 1
        }else if (args.activityId == AtyFunc.PAY_FIRST){ //首冲领奖
            //Gm.userInfo.payInfo.isFirstPay = 2
           // Gm.red.refreshEventState("firstPay")
            
            // Gm.ui.create("AwardShowView",Gm.config.getEventPayRewardId(AtyFunc.PAY_FIRST).reward)
            //Gm.send(Events.UPDATE_FIRST_PAY)
            return
        }
        if (this.isView()){
            this.updateView()
        }
        Gm.red.refreshEventState("activity")
        
    },
    onNetBuyVipGift:function(args){
       if (args.result == 0){
           Gm.activityData.data.vipPacketIds.push(args.vipPackageId)
           if (this.isView()){
               this.view.updateView7()
           }
           // var itemData = Gm.config.getVipPackage(args.vipPackageId)
           // Gm.ui.create("AwardShowView",itemData.itemPackage)
       }
    },
    onPayResult:function(args){
        if(args.activityId && args.activityId.length > 0){
            for (var i = 0; i < args.activityId.length; i++) {
                var atyId = args.activityId[i]
                var conf = Gm.config.getEventPayRewardId(atyId)
                
                var payData = Gm.config.getPayProductAtyId(atyId)
                Gm.userInfo.monthConsumeAdd(payData.cost)

                if (atyId == AtyFunc.PAY_TXZ){
                    Gm.activityData.data.isUnlockPassMedal = 1
                }else if (atyId == AtyFunc.PAY_CZJI){//102
                    Gm.activityData.setPlanGrow(102,true)
                }else if (atyId == AtyFunc.PAY_ZJLB){//103
                    Gm.activityData.setPlanGrow(103,true)
                }else if (conf.childType == AtyFunc.TYPE_MONTH_CARD){
                    var time = Gm.userData.getTime_m() + conf.validity*1000
                    cc.log("到期时间---",time)
                    var monthData = Gm.activityData.getAtyId(atyId)
                    if (monthData){
                        cc.log("过期后购买")
                        monthData.expireTime = time
                        monthData.status = 0
                    }else{
                        Gm.activityData.pushAty({activityId:atyId,expireTime:time,status:0})    
                    }
                }else{
                    Gm.activityData.pushAty({activityId:atyId})
                    if (Gm.config.getLimitGiftId(atyId)){
                        Gm.activityData.removeLimitGift(atyId)
                    }
                }
            }
            
            if (this.isView()){
                this.updateView()
            }
            Gm.red.refreshEventState("activity")
            Gm.red.refreshEventState("firstPay")
        }
    },
    onSYNCLimetGift(args){
        cc.error(args)
        Gm.activityData.addLimit(args.limitGift)
    },
    onNetPushReward(data){
        setTimeout(function(){
            Gm.activityData.checkTimeNoobGrow()
            Gm.activityData.checkShowRedItem()
        },1/60.0)
    },
    onNetBuyPassMedalExp(args){
        var conf = Gm.config.getEventPayRewardId(Gm.activityNet.buyPassId)
        Gm.userInfo.passMedal = conf.receiveCondition[0].num
        
    },
});

