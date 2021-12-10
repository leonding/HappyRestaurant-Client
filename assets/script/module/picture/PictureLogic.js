var CoreLogic = require("CoreLogic")
cc.Class({
    extends: CoreLogic,
    properties: {
        
    },
    ctor:function(){

    },
    register:function(){
        this.events[Events.LOGIN_SUC] = this.onLogicSuss.bind(this)
        this.events[MSGCode.OP_ENTER_PIC_S] = this.onEnterPic.bind(this)
        this.events[MSGCode.OP_CHANGE_PIC_S] = this.onChangeMapPic.bind(this)
        this.events[MSGCode.OP_RESET_PIC_S] = this.onResetPic.bind(this)
        this.events[MSGCode.OP_GET_EVNET_PIC_S] = this.onGetEventData.bind(this)
        this.events[MSGCode.OP_REVIVEALL_PIC_S] = this.onReviveAll.bind(this)
        this.events[MSGCode.OP_TRIGGER_EVENT_PIC_S] = this.onTrigger.bind(this)

        this.events[MSGCode.OP_CHESSSKILL_VIEW_S] = this.onChess.bind(this)

        this.events[MSGCode.OP_HERO_QUALITY_S] = this.onHeroRiseQuality.bind(this)
    },
    onLogicSuss(){
        Gm.pictureData.clearData()
        Gm.gamePlayNet.openChess(0,false)
    },
    onEnterPic(args){
        Gm.pictureData.setData(args)

        if (this.isView()){
            this.view.onUpdateView()
        }
    },
    onChangeMapPic(args){
        args.heroInfo = Gm.pictureData.getData(args.treasure).heroInfo
        this.onEnterPic(args)
    },
    onResetPic(args){
        var newData = Gm.pictureData.getData(args.treasure)
        var heroInfo = []
        for (let index = 0; index < newData.heroInfo.length; index++) {
            const v = newData.heroInfo[index];
            if (Gm.heroData.getHeroById(v.heroId) || Func.indexOf(args.giveHeroList,v.heroId) >= 0){
                v.hp = v.maxHp
                v.mp = 0
                heroInfo.push(v)
            }
        }
        args.heroInfo = heroInfo

        var chessList = Gm.pictureData.getChessList(args.treasure)
        
        var conf = Gm.config.getPicturePuzzle(args.currentMapId)
        chessList[conf.type] = []
        this.onEnterPic(args)
    },
    onGetEventData(args){
        Gm.pictureData.setEventData(args)
        PictureFunc.showEventType(args.currentMapId,args.stageId,args.treasure)
    },
    onReviveAll(args){
        Gm.pictureData.reviveHeroinfo(args.treasure)
    }, 
    onTrigger(args){
        var sendData = Gm.gamePlayNet.triggerData
        var data = Gm.pictureData.getFloorInfoByStageId(sendData.stageId,args.treasure)
        
        var isComplete = false
        if (args.battleInfo){
            args.battleInfo.currentMapId = sendData.nowId
            args.battleInfo.stageId = sendData.stageId
            args.battleInfo.finalStatus = args.finalStatus
            args.battleInfo.chessInfo = args.chessInfo
            args.battleInfo.treasure = args.treasure

            var eventData = Gm.pictureData.getEventDataByStageId(sendData.stageId,args.treasure)

            for (let index = 0; index < args.finalStatus.length; index++) {
                const v = args.finalStatus[index];
                var roleHero = Func.forBy(args.battleInfo.battleData.roleInfo,"pos",v.pos)

                var hpData = {}
                hpData.hp = v.hp
                hpData.mp = v.mp
                hpData.maxHp = roleHero.maxHp
                hpData.maxMp = roleHero.maxMp
                
                var tmpHero
                if (roleHero.pos < 0){
                    tmpHero = Func.forBy(eventData,"monsterId",roleHero.baseId)
                }else{
                    tmpHero = Gm.pictureData.getHero(roleHero.id,args.treasure)
                }
                if (tmpHero){
                    Gm.pictureData.saveEventHp(tmpHero,hpData)
                }
            }

            if (args.battleInfo.fightResult == 1){
                if(data.isReward == 0){
                    var list = [] //奖励
                    var mapConf = Gm.config.getPicturePuzzle(sendData.nowId)

                    var eventId
                    if(mapConf.eventGroup[sendData.stageId]){
                        eventId = mapConf.eventGroup[sendData.stageId].id
                    }else{
                        eventId = mapConf.endEvent
                    }
                    var eventGroupConf = Gm.config.getPictureEventGroup(eventId)
                    for (let j = 0; j < eventGroupConf.eventReward.length; j++) {
                        const vj = eventGroupConf.eventReward[j];
                        list.push({itemType:vj.type,baseId:vj.id,itemCount:vj.num})
                    }
                    args.battleInfo.award = {drop:{item:list}}
                }
                isComplete = true
            }

            Gm.ui.create("BattleLoadView",{battleInfo:[args.battleInfo]})
            if (args.battleInfo.fightResult == 1){
                isComplete = true
            }
        }
        var conf = Gm.config.getPictureEvent(data.eventId)
        if(args.heroInfo && (conf.type == 2 || conf.type == 3 || conf.type == 4)){
            isComplete = true
            
            if(conf.type == 3){//恢复
                Gm.floating(2330) 
            }else if (conf.type == 4){//复活
                var str = 2331
                if (Gm.pictureData.getDeadNum(args.treasure) == 0){
                    str = 2332
                }
                Gm.floating(str)
            }
            for (let index = 0; index < args.heroInfo.length; index++) {
                const v = args.heroInfo[index];
                if (conf.type == 2){//酒馆
                    v.baseId = 0
                    Gm.pictureData.addHeroinfo(v,args.treasure)
                }else{
                    var heroData = Gm.pictureData.getHero(v.heroId,args.treasure)
                    heroData.hp = v.hp
                    if (v.mp){
                        heroData.mp = v.mp
                    }
                }
            }
        }
        if (isComplete){
            data.isFinish = 1
            data.isReward = 1
        }
        if (this.isView()){
            this.view.updateView()
        }
    },
    onChess(args){
        Gm.pictureData.setChessData(args)
        Gm.red.refreshEventState(args.treasure?"miJing":"picture")
    },
    onHeroRiseQuality(args){
        for (var a = 0; a < args.infos.length; a++) {
            var newData = args.infos[a]
            Gm.pictureData.changeHeroQualityId(newData)
        }
    }
});
