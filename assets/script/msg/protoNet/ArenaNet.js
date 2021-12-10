var MSGCode = require("MSGCode")
MSGCode.proto[MSGCode.OP_BATTLE_RECORD_VIEW_C]  = "Arena.OPBattleRecordView"
MSGCode.proto[MSGCode.OP_BATTLE_RECORD_VIEW_S]  = "Arena.OPBattleRecordViewRet"

MSGCode.proto[MSGCode.OP_RANK_INFO_C]  = "Arena.OPRankInfo"
MSGCode.proto[MSGCode.OP_RANK_INFO_S]  = "Arena.OPRankInfoRet"

MSGCode.proto[MSGCode.OP_ARENA_EXCHANGE_C]  = "Arena.OPArenaExchange"
MSGCode.proto[MSGCode.OP_ARENA_EXCHANGE_S]  = "Arena.OPArenaExchangeRet"

MSGCode.proto[MSGCode.OP_BATTLE_LOG_C]  = "Arena.OPBattleLog"
MSGCode.proto[MSGCode.OP_BATTLE_LOG_S]  = "Arena.OPBattleLogRet"

MSGCode.proto[MSGCode.OP_ARENA_BATTLE_C]  = "Arena.OPArenaBattle"
MSGCode.proto[MSGCode.OP_ARENA_BATTLE_S]  = "Arena.OPArenaBattleRet"

MSGCode.proto[MSGCode.OP_ARENA_BUY_COUNT_C]  = "Arena.OPArenaBuyCount"
MSGCode.proto[MSGCode.OP_ARENA_BUY_COUNT_S]  = "Arena.OPArenaBuyCountRet"

MSGCode.proto[MSGCode.OP_ARENA_REFRESH_C]  = "Arena.OPArenaRefresh"
MSGCode.proto[MSGCode.OP_ARENA_REFRESH_S]  = "Arena.OPArenaRefreshRet"

MSGCode.proto[MSGCode.OP_ARENA_INFO_C]  = "Arena.OPArenaInfo"
MSGCode.proto[MSGCode.OP_ARENA_INFO_S]  = "Arena.OPArenaInfoRet"

cc.Class({
    properties: {
        
    },
    sendbattleRecordView:function(battleType,recordId){
        var tmpLog = Gm.arenaData.getBattle(recordId)
        Gm.arenaData.m_iDestRecordId = recordId
        if (tmpLog){
            Gm.send(MSGCode.OP_BATTLE_RECORD_VIEW_S,tmpLog)
        }else{
            Gm.sendCmdHttp(MSGCode.OP_BATTLE_RECORD_VIEW_C,{playerId:Gm.userInfo.id,battleType:battleType,recordId:recordId})
        }
    },
    sendArenaInfo:function(){
        Gm.sendCmdHttp(MSGCode.OP_ARENA_INFO_C,{playerId:Gm.userInfo.id})
    },
    sendArenaRefresh:function(){
        Gm.sendCmdHttp(MSGCode.OP_ARENA_REFRESH_C,{playerId:Gm.userInfo.id})
    },
    sendArenaBuyCount:function(count){
        Gm.arenaData.m_iDestCount = count
        Gm.sendCmdHttp(MSGCode.OP_ARENA_BUY_COUNT_C,{playerId:Gm.userInfo.id,count:count})
    },
    sendArenaBattle:function(isRobot,targetId,lineHero){
        this.teamHeros = lineHero
        Gm.arenaData.setLocalPerson(isRobot,targetId)
        Gm.sendCmdHttp(MSGCode.OP_ARENA_BATTLE_C,{playerId:Gm.userInfo.id,isRobot:isRobot,targetId:targetId,lineHero:lineHero})
    },
    sendArenaBattleLog:function(battleType){
        Gm.sendCmdHttp(MSGCode.OP_BATTLE_LOG_C,{playerId:Gm.userInfo.id,battleType:battleType})
    },
    sendArenaExchange:function(itemId,count){
        Gm.sendCmdHttp(MSGCode.OP_ARENA_EXCHANGE_C,{playerId:Gm.userInfo.id,itemId:itemId,count:count})
    },
    sendRankInfo:function(type){
        Gm.sendCmdHttp(MSGCode.OP_RANK_INFO_C,{playerId:Gm.userInfo.id,type:type})
    },
});
