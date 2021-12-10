var MSGCode = require("MSGCode")

MSGCode.proto[MSGCode.OP_WORLD_INFO_C]             = "WorldBoss.OPWorldBossInfo"
MSGCode.proto[MSGCode.OP_WORLD_INFO_S]             = "WorldBoss.OPWorldBossInfoRet"

MSGCode.proto[MSGCode.OP_WORLD_BATTLE_C]      = "WorldBoss.OPWorldBossBattle"
MSGCode.proto[MSGCode.OP_WORLD_BATTLE_S]      = "WorldBoss.OPWorldBossBattleRet"

MSGCode.proto[MSGCode.OP_WORLD_RANK_C]             = "WorldBoss.OPWorldBossRankInfo"
MSGCode.proto[MSGCode.OP_WORLD_RANK_S]             = "WorldBoss.OPWorldBossRankInfoRet"

MSGCode.proto[MSGCode.OP_WORLD_CLEARING_S]         = "WorldBoss.OPWorldBossClearingRet"

cc.Class({
    properties: {
    },
    bossRank(rankType){
        Gm.sendCmdHttp(MSGCode.OP_WORLD_RANK_C,{rankType:rankType})
    },
    bossBattle(lineHero){
        Gm.sendCmdHttp(MSGCode.OP_WORLD_BATTLE_C,{lineHero:lineHero})
    },
    info(){
        Gm.sendCmdHttp(MSGCode.OP_WORLD_INFO_C)
    },
});
