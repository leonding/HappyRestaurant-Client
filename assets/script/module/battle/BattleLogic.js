var CoreLogic = require("CoreLogic")
cc.Class({
    extends: CoreLogic,
    properties: {
        
    },
    ctor:function(){

    },
    register:function(){
        this.events[Events.LOGIN_SUC]             = this.onLogicSuss.bind(this)
        this.events[MSGCode.OP_COLLECT_GJAWARD_S] = this.onNetCollectGj.bind(this)
        this.events[MSGCode.OP_PUSH_TROPHY_S]     = this.onNetPushTrophy.bind(this)
        this.events[MSGCode.OP_FIGHT_BOSS_S]      = this.onNetFightBoss.bind(this)
        this.events[MSGCode.OP_CHANGE_MAP_S]      = this.onNetChangeMap.bind(this)
        this.events[MSGCode.OP_PUSH_OFFLINE_S]    = this.onNetPushOffline.bind(this)
        this.events[MSGCode.OP_PUSH_BATTLE_INFO_S]= this.onNetBattleInfo.bind(this)
        this.events[MSGCode.OP_FAST_FIGHT_S]      = this.onQuickFight.bind(this)
        this.events[MSGCode.OP_SWEEPBOSS_S]       = this.onSweepBossRet.bind(this)
        this.events[MSGCode.OP_BUY_BOSS_FIGHT_COUNT_S] = this.onBuyBossFightCount.bind(this)
        this.events[MSGCode.OP_DROP_ADD_RET] = this.onDropAddRet.bind(this)

        this.events[MSGCode.OP_FIGHTSET_INFO_S] = this.onFightSetInfo.bind(this)
        this.events[MSGCode.OP_FIGHTINFO_SETUP_S] = this.onFightSetInfoSetup.bind(this)
    },
    onFightSetInfo(args){
        Gm.battleData.setFightSetInfo(args.value)
        Gm.ui.create("UserInfoView")
    },
    onFightSetInfoSetup(args){
        if (args.result == 0){
            Gm.battleData.setFightSetInfo(Gm.battleNet.nowFightSetinfo)
        }
    },
    onLogicSuss:function(){
        Gm.ui.removeByName("DropTipsView")
    },
    onNetCollectGj:function(args){
        Gm.userInfo.setLastGjTime(Gm.userData.getTime_m())
        if (Gm.ui.getLayerActive("DropTipsView")){
            Gm.ui.getScript("DropTipsView").clearDrop()
        }else{
            Gm.ui.create("DropTipsView",args)
        }
        Gm.red.refreshEventState("fight")
        Gm.send(Events.GJ_AWARD_UPDATE)
    },
    onNetPushTrophy:function(args){
        if (args.drop.treasure){
            for (let index = 0; index < args.drop.treasure.length; index++) {
                const v = args.drop.treasure[index];
                Gm.battleData.gjDrop.treasure.push(v)
            }
        }
        if (args.drop.treasure){
            for (let index = 0; index < args.drop.item.length; index++) {
                const v = args.drop.item[index];
                Gm.battleData.gjDrop.item.push(v)
            }
            Gm.send(Events.DROP_TIPS_UPDATE,{item:true})
        }
        Gm.red.refreshEventState("fight")
    },
    onNetFightBoss:function(args){
        Gm.heroData.setLineHero({type:ConstPb.lineHero.LINE_BOSS,hero:Gm.battleNet.teamHeros})
        Gm.red.refreshHero()
    },
    onNetChangeMap:function(args){
        Gm.userInfo.changeMapId(args.mapId)
        Gm.floating(Ls.get(4001))
    },
    onNetPushOffline:function(args){
        Gm.ui.insertPop("OfflineView",args,true)
        Gm.userInfo.setLastGjTime(Gm.userData.getTime_m())
        Gm.red.refreshEventState("fight")
    },
    //战斗数据
    onNetBattleInfo:function(args){
        cc.log(Ls.get(4002),args)
        if(args.battleInfo == null || (args.battleInfo && args.battleInfo.length == 0)){
            Gm.userInfo.changeMapId(args.mapId-1)
            Gm.userInfo.setMaxMapId(args.mapId)
            return
        }
        Gm.ui.create("BattleLoadView",args)
        if(args.battleInfo[0].type == ConstPb.battleType.BATTLE_PVE_BOSS){
            if (args.battleInfo[0].fightResult ==1 && args.mapId == Gm.userInfo.getMaxMapId()){
                Gm.userInfo.nextMapId()
            }
            if (args.battleInfo[0].fightResult ==1 && args.mapId == Gm.userInfo.getMaxMapId(true)){
                Gm.userInfo.eliteNextMapId()
            }
            if(args.battleInfo[0].fightResult == 1 && Gm.battleNet.isHireLineHero){
                //佣兵使用次数加1
                Gm.friendData.setHireCount(ConstPb.lineHero.LINE_BOSS)
            }
            
        }else{
            // Gm.red.m_bHasArena = true
            // Gm.red.refreshEventState("arena")
        }
    },
    onQuickFight:function(args){
        Gm.userInfo.fastFightTimes = args.fastFightTimes

        args.award.drop.item.unshift({itemType:10000,baseId:2010,itemCount:args.award.heroExp})
        args.award.drop.item.unshift({itemType:10000,baseId:1002,itemCount:args.award.silver})
        Gm.ui.create("AwardShowView",{list:args.award.drop.item})
        if (Gm.ui.getLayerActive("DropTipsView")){
            Gm.ui.getScript("DropTipsView").updateFast()
        }
        // var data = {btnNum:1}
        // data.msg = "快速战斗奖励,后续补界面"
        // Gm.box(data,function(btnType){
            
        // })
        // args.quick = true
        // Gm.ui.create("OfflineView",args)
    },
    onSweepBossRet:function(args){
        Gm.ui.create("BalanceView",{award:args.battleAward,type:ConstPb.battleType.BATTLE_PVE_BOSS})
    },
    onBuyBossFightCount:function(args){
        Gm.floating(Ls.get(4003))
        if (args.type == 1){
            Gm.userInfo.bossBuyCount = Gm.userInfo.bossBuyCount + args.currCount - Gm.userInfo.fightBossCount
            Gm.userInfo.fightBossCount = args.currCount
        }else{
            Gm.userInfo.eliteBossBuyCount = Gm.userInfo.eliteBossBuyCount + args.currCount - Gm.userInfo.fightEliteBossCount
            Gm.userInfo.fightEliteBossCount = args.currCount
        }
        
        var tmpName = "ChallengeView"
        var layer = Gm.ui.getLayer(tmpName)
        if(layer && layer.active){
            layer.getComponent(tmpName).updateNums()
        }
    },
    onDropAddRet:function(args){
        Gm.battleData.silver_drop_value = args.silver_drop_value
        Gm.battleData.experience_add_percent = args.experience_add_percent
    },
});

