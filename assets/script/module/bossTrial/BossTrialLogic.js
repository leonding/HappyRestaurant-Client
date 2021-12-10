var CoreLogic = require("CoreLogic")
cc.Class({
    extends: CoreLogic,
    properties: {
        
    },
    ctor:function(){

    },
    register:function(){
        this.events[Events.LOGIN_SUC]        = this.onLoginSuc.bind(this)
        this.events[MSGCode.OP_SHOW_ZHENFA_BOSS_S] = this.onNetShowInfo.bind(this)
        this.events[MSGCode.OP_ENTER_ZHENFA_BOSS_S] = this.onNetGetHeroInfo.bind(this)
        this.events[MSGCode.OP_BATTLE_ZHENFA_BOSS_S] = this.onNetBattle.bind(this)
        this.events[MSGCode.OP_NEWJOIN_HERO_ZHENFA_BOSS_S] = this.onNetAddHero.bind(this)
        
        this.events[Events.ENTER_NEW_DAY] = this.onNewDay.bind(this)

        this.events[MSGCode.OP_SKILL_SET_S] = this.onSkillSet.bind(this)
        this.events[MSGCode.OP_ZHENFA_BOSS_ENDTIME_S] = this.onNetEndTime.bind(this)
    },
    onNewDay(){
       
    },
    onLoginSuc:function(args){
        Gm.bossTrialData.clearData()
        // Gm.bossTrialNet.showZhenFa()
    },
    onNetShowInfo:function(args){
        Gm.bossTrialData.setData(args)
        Gm.red.refreshEventState("bossTrial")
    },
    onNetGetHeroInfo:function(args){
        Gm.bossTrialData.initHero(args.newJoinHeroInfo)
    },
    onNetAddHero:function(args){
        Gm.bossTrialData.initHero(args.heroInfo)
    },
    onNetBattle:function(args){
        if (args.battleInfo.fightResult == 1){
            if (args.currentMapId > Gm.bossTrialData.saveMapId){
                Gm.bossTrialData.saveMapId = args.currentMapId    
            }
        }
        Gm.ui.create("BattleLoadView",{battleInfo:[args.battleInfo]})
        Gm.bossTrialData.redClick(args.currentMapId)
    },
    onSkillSet:function(args){
        var tmpHero = Gm.bossTrialData.getHeroByHeroId(args.heroId)
        if (tmpHero == null){
            return
        }
        if (tmpHero){
            tmpHero.setData({skillList:args.skillList})
        }
        var tmpView = Gm.ui.getScript("SkillSetView")
        if (tmpView){
            tmpView.updateTops()
            tmpView.updateList()
        }
        Gm.send(Events.UPDATE_HERO,{heroId:args.heroId,isSkill:true})
    },
    onNetEndTime(args){
        Gm.bossTrialData.setEndTime(args.endtime)
        if (args.endtime > Gm.userData.getTime_m()){
            Gm.bossTrialNet.showZhenFa()
        }
    },
});
