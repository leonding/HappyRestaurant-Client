var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        vipExpLab:cc.Label,
        timeLab:cc.Label,
        awardNode:cc.Node,
        btnLab:cc.Label,
        tipsLab:cc.Label,
        m_oClock:cc.Node,
    },
    onLoad:function(){
        this._super()
        this.schedule(()=>{
            this.updateTime()
        },1)
    },
    register:function(){
        this.events[MSGCode.OP_PAY_PAYMENT_RESULT_S] = this.onPayResult.bind(this)
    },
    onPayResult(args){ 
        if (this.limitConf){
            if(args.result == 0){
                for (var i = 0; i < args.activityId.length; i++) {
                    var atyId = args.activityId[i]
                    if (this.openData.limitId == atyId){
                        this.onBack()
                    }
                }
            }
            
        }
    },
    setOpenData(args){
        this._super(args)
        this.limitData = Gm.activityData.getLimitById(this.openData.limitId)
        this.limitConf = Gm.config.getLimitGiftId(this.openData.limitId)

        var value = this.limitConf.conditionValue
        if (this.limitConf.condition == 4){
            value = Gm.config.getHeroType(value).childTypeName
        }else if(this.limitConf.condition == 2){
            value = Gm.config.getMapById(value).mapName
        }
        else if(this.limitConf.condition == 6){
            value = checkint(value) - 10000
        }
        else if(this.limitConf.condition == 7){
            value = checkint(value) - 20000
        }
        else if(this.limitConf.condition == 8){
            value = checkint(value) - 30000
        }else if (this.limitConf.condition == 10){
            // var mapConf = Gm.config.getMapById(value)
            // var chapterConf = Gm.config.getChapterById(mapConf.chapter)
            // value = chapterConf.chapterName
            value = ""
        }
        this.tipsLab.string = cc.js.formatStr(Ls.get(this.limitConf.condition + 9000000),value)
    },
    enableUpdateView(args){
        if (args){
            this.updateView()
            this.runClockAction()
        }
    },
    runClockAction(){
        var rotation =cc.repeatForever(cc.rotateBy(1.0,-360)) 
        this.m_oClock.runAction(rotation)
    },
    updateView(){
        var awardConf = Gm.config.getEventPayRewardId(this.openData.limitId)
        for (let index = 0; index < awardConf.reward.length; index++) {
            const v = awardConf.reward[index];
            var sp = Gm.ui.getNewItem(this.awardNode)
            sp.setData(v)
        }

        var vipExp = AtyFunc.getPrice(this.limitConf.id) * Gm.config.getConst("vip_conversion")/100

        this.vipExpLab.string = "VIP" + cc.js.formatStr(Ls.get(800154),"+",AtyFunc.getVipExp(this.limitConf.id))

        this.btnLab.string = AtyFunc.getPriceStr(this.limitConf.id)

        this.updateTime()
    },
    updateTime(){
        if (this.limitData){
            var time = Func.translateTime(this.limitData.endTime)
            if(time <= 0){
                this.onBack()
                return
            }
            this.timeLab.string = AtyFunc.timeToTSFMzh(time)
        }
    },
    onBtnClick(){
        cc.log(this.openData)
        AtyFunc.checkBuy(this.limitConf.id)
    },
    onBack(){
        Gm.activityData.limitGiftItem = null
        this._super()
    },
    
});

