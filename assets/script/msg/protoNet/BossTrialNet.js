var MSGCode = require("MSGCode")
MSGCode.proto[MSGCode.OP_SHOW_ZHENFA_BOSS_C]    = "ZhenFaBoss.ShowZhenFaBoss"
MSGCode.proto[MSGCode.OP_SHOW_ZHENFA_BOSS_S]    = "ZhenFaBoss.ShowZhenFaBossRet"
MSGCode.proto[MSGCode.OP_ENTER_ZHENFA_BOSS_C]    = "ZhenFaBoss.EnterZhenFaBoss"
MSGCode.proto[MSGCode.OP_ENTER_ZHENFA_BOSS_S]    = "ZhenFaBoss.EnterZhenFaBossRet"
MSGCode.proto[MSGCode.OP_BATTLE_ZHENFA_BOSS_C]    = "ZhenFaBoss.BattleZhenFaBoss"
MSGCode.proto[MSGCode.OP_BATTLE_ZHENFA_BOSS_S]    = "ZhenFaBoss.BattleZhenFaBossRet"
MSGCode.proto[MSGCode.OP_NEWJOIN_HERO_ZHENFA_BOSS_S]    = "ZhenFaBoss.NewJoinHeroZhenFaBossRet"
MSGCode.proto[MSGCode.OP_ZHENFA_BOSS_ENDTIME_S]    = "ZhenFaBoss.ZhenfaBossEndTimeRet"

cc.Class({
    properties: {
        
    },

    showZhenFa(){
        Gm.sendCmdHttp(MSGCode.OP_SHOW_ZHENFA_BOSS_C)
    },
    enterZhenFa(){
        if (Gm.bossTrialData.heros == null){
            Gm.sendCmdHttp(MSGCode.OP_ENTER_ZHENFA_BOSS_C)
        }else{
            Gm.bossTrialData.updateMaxLv()
        }
    },
    battle(mapId,list){
        if (list.length){
            Gm.heroData.setLineHero({type:ConstPb.lineHero.LINE_ZHENFA_BOSS,hero:list})    
        }
        Gm.sendCmdHttp(MSGCode.OP_BATTLE_ZHENFA_BOSS_C,{currentMapId:mapId,lineHero:list})
    },
    
});
