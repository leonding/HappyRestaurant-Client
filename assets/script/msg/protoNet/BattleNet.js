var MSGCode = require("MSGCode")
MSGCode.proto[MSGCode.OP_COLLECT_GJAWARD_C]   = "Battle.OPCollectGJAward"
MSGCode.proto[MSGCode.OP_COLLECT_GJAWARD_S]   = "Battle.OPCollectGJAwardRet"
MSGCode.proto[MSGCode.OP_PUSH_TROPHY_S]       = "Battle.OPPushTrophyRet"
MSGCode.proto[MSGCode.OP_FIGHT_BOSS_C]        = "Battle.OPFightBoss"
MSGCode.proto[MSGCode.OP_FIGHT_BOSS_S]        = "Battle.OPFightBossRet"
MSGCode.proto[MSGCode.OP_CHANGE_MAP_C]        = "Battle.OPChangeMapId"
MSGCode.proto[MSGCode.OP_CHANGE_MAP_S]        = "Battle.OPChangeMapIdRet"
MSGCode.proto[MSGCode.OP_PUSH_OFFLINE_S]      = "Battle.OPPushOfflineRet"
MSGCode.proto[MSGCode.OP_PUSH_BATTLE_INFO_S]  = "Battle.OPBattleInfoSync"

MSGCode.proto[MSGCode.OP_FAST_FIGHT_C]        = "Battle.OPFastFight"
MSGCode.proto[MSGCode.OP_FAST_FIGHT_S]        = "Battle.OPFastFightRet"

MSGCode.proto[MSGCode.OP_SWEEPBOSS_C]  = "Battle.OPSweepBoss"
MSGCode.proto[MSGCode.OP_SWEEPBOSS_S]  = "Battle.OPSweepBossRet"

MSGCode.proto[MSGCode.OP_BUY_BOSS_FIGHT_COUNT_C]  = "Battle.OPBuyBossFightCount"
MSGCode.proto[MSGCode.OP_BUY_BOSS_FIGHT_COUNT_S]  = "Battle.OPBuyBossFightCountRet"

MSGCode.proto[MSGCode.OP_DROP_ADD_RET]  = "Battle.OPDropAddRet"

MSGCode.proto[MSGCode.OP_FIGHTSET_INFO_C]  = "Battle.OPFightSetInfo"
MSGCode.proto[MSGCode.OP_FIGHTSET_INFO_S]  = "Battle.OPFightSetInfoRet"
MSGCode.proto[MSGCode.OP_FIGHTINFO_SETUP_C]  = "Battle.OPFightInfoSetUp"
MSGCode.proto[MSGCode.OP_FIGHTINFO_SETUP_S]  = "Battle.OPFightInfoSetUpRet"

MSGCode.proto[MSGCode.OP_TOWER_INFO_S]  = "Battle.OPTowerInfo"
MSGCode.proto[MSGCode.OP_TOWER_Battle_C]  = "Battle.OPTowerBattle"
MSGCode.proto[MSGCode.OP_TOWER_Battle_S]  = "Battle.OPTowerBattleRet"
MSGCode.proto[MSGCode.OP_TOWER_LAST_CHALLENGE_C]  = "Battle.OPTowerLastChallengeInfo"
MSGCode.proto[MSGCode.OP_TOWER_LAST_CHALLENGE_S]  = "Battle.OPTowerLastChallengeInfoRet"
MSGCode.proto[MSGCode.OP_TOWER_BATTLE_INFO_C]  = "Battle.OPTowerBattleInfo"
MSGCode.proto[MSGCode.OP_TOWER_RNK_C]  = "Battle.OPTowerRank"
MSGCode.proto[MSGCode.OP_TOWER_RNK_S]  = "Battle.OPTowerRankRet"

MSGCode.proto[MSGCode.OP_TOWER_REWARD_C]  = "Battle.OPTowerReceive"
MSGCode.proto[MSGCode.OP_TOWER_REWARD_S]  = "Battle.OPTowerReceiveRet"
cc.Class({
    properties: {
        
    },
    towerReceive(rewardId){
        Gm.sendCmdHttp(MSGCode.OP_TOWER_REWARD_C,{rewardId:rewardId})
    },
    towerBattle(list,towerType,lineType){
        Gm.heroData.setLineHero({type:lineType,hero:this.getSaveLineList(list)})
        Gm.sendCmdHttp(MSGCode.OP_TOWER_Battle_C,{lineHero:list,type:towerType})
    },
    getSaveLineList(list){
        var saveList = []
        this.isHireLineHero = false
        for (let index = 0; index < list.length; index++) {
            const v = list[index];
            if (v == 0 || Gm.heroData.getHeroById(v)){
                saveList.push(v)
            }else{
                saveList.push(0)
                this.isHireLineHero = true
            }
        }
        return saveList
    },
    towerLast(towerId){
        this.towerId = towerId
        Gm.sendCmdHttp(MSGCode.OP_TOWER_LAST_CHALLENGE_C,{towerId:towerId})
    },
    towerRank(){
        Gm.sendCmdHttp(MSGCode.OP_TOWER_RNK_C)
    },
    towerBattleInfo(towerId,challengeId){
        Gm.sendCmdHttp(MSGCode.OP_TOWER_BATTLE_INFO_C,{towerId:towerId,challengeId:challengeId})
    },
    getFightSetInfo(){
        Gm.sendCmdHttp(MSGCode.OP_FIGHTSET_INFO_C)
    },
    setFightSetInfo(list){
        this.nowFightSetinfo = list
        Gm.sendCmdHttp(MSGCode.OP_FIGHTINFO_SETUP_C,{value:list})
    },
    gjAward:function(){
        if (!Gm.userInfo.isLogin()){
            return
        }
        Gm.sendCmdHttp(MSGCode.OP_COLLECT_GJAWARD_C)
    },
    fightBoss:function(heros,mapId){
        this.teamHeros = this.getSaveLineList(heros)
        Gm.sendCmdHttp(MSGCode.OP_FIGHT_BOSS_C,{lineHero:heros,mapId:mapId ||0})
    },
    changeMap:function(mapId){
        Gm.sendCmdHttp(MSGCode.OP_CHANGE_MAP_C,{mapId:mapId})
    },
    quickFight:function(){
        Gm.sendCmdHttp(MSGCode.OP_FAST_FIGHT_C)
    },
    sendSweepBoss:function(mapId){
        Gm.sendCmdHttp(MSGCode.OP_SWEEPBOSS_C,{mapId:mapId})
    },
    sendBuyBossFightCount:function(count,mapType){
        Gm.sendCmdHttp(MSGCode.OP_BUY_BOSS_FIGHT_COUNT_C,{count:count,type:mapType})
    },
    
});
