var MSGCode = require("MSGCode")
MSGCode.proto[999]  = "Dungeon.TeamBattleRecord" //客户端特殊
MSGCode.proto[MSGCode.OP_DUNGEON_INFO_C]  = "Dungeon.OPDungeonInfo"
MSGCode.proto[MSGCode.OP_DUNGEON_INFO_S]  = "Dungeon.OPDungeonInfoRet"
MSGCode.proto[MSGCode.OP_VIEW_TEAM_MODE_C]  = "Dungeon.OPViewTeamMode"
MSGCode.proto[MSGCode.OP_VIEW_TEAM_MODE_S]  = "Dungeon.OPViewTeamModeRet"
MSGCode.proto[MSGCode.OP_EDIT_DUNGEON_TEAM_C]  = "Dungeon.OPEditDungeonTeam"
MSGCode.proto[MSGCode.OP_EDIT_DUNGEON_TEAM_S]  = "Dungeon.OPEditDungeonTeamRet"
MSGCode.proto[MSGCode.OP_RECEIVE_DUNGEON_INVITE_S]  = "Dungeon.OPReceiveDungeonInviteRet"
MSGCode.proto[MSGCode.OP_REPLY_DUNGEON_INVITE_C]  = "Dungeon.OPReplyDungeonInvite"
MSGCode.proto[MSGCode.OP_DUNGEON_BATTLE_C]  = "Dungeon.OPDungeonBattle"
MSGCode.proto[MSGCode.OP_DUNGEON_BATTLE_S]  = "Dungeon.OPDungeonBattleRet"
MSGCode.proto[MSGCode.OP_DUNGEON_RECORD_C]  = "Dungeon.OPDungeonRecord"
MSGCode.proto[MSGCode.OP_DUNGEON_RECORD_S]  = "Dungeon.OPDungeonRecordRet"

MSGCode.proto[MSGCode.OP_DUNGEON_STAR_REWARD_C]  = "Dungeon.OPDungeonStarReward"
MSGCode.proto[MSGCode.OP_DUNGEON_STAR_REWARD_S]  = "Dungeon.OPDungeonStarRewardRet"

MSGCode.proto[MSGCode.OP_DUNGEON_BUY_FIGHT_C]  = "Dungeon.OPDungeonBuyFight"
MSGCode.proto[MSGCode.OP_DUNGEON_BUY_FIGHT_S]  = "Dungeon.OPDungeonBuyFightRet"

MSGCode.proto[MSGCode.OP_DUNGEON_SHENJI_RESET_C]  = "Dungeon.DungeonShenjiReset"
MSGCode.proto[MSGCode.OP_DUNGEON_SHENJI_RESET_S]  = "Dungeon.DungeonShenjiResetRet"

cc.Class({
    properties: {
        
    },
    reset(dungeonId){
        this.dungeonId = dungeonId
        Gm.sendCmdHttp(MSGCode.OP_DUNGEON_SHENJI_RESET_C,{dungeonId:dungeonId})
    },
    buyFight(dungeonId,count,mode){
        this.dungeonId = dungeonId
        this.count = count
        this.mode = mode
        Gm.sendCmdHttp(MSGCode.OP_DUNGEON_BUY_FIGHT_C,{dungeonId:dungeonId,count:count})
    },
    boxReward(dungeonId,star){
        this.boxRewardData = {dungeonId:dungeonId,star:star}
        Gm.sendCmdHttp(MSGCode.OP_DUNGEON_STAR_REWARD_C,this.boxRewardData)
    },
    info:function(id,type=1){
        this.infoId = id
        this.infoType = type
        Gm.sendCmdHttp(MSGCode.OP_DUNGEON_INFO_C,{dungeonId:id,type:type})
    },
    teamMode(id,mode){
        this.teamModeInfo = {dungeonId:id,mode:mode}
        Gm.sendCmdHttp(MSGCode.OP_VIEW_TEAM_MODE_C,this.teamModeInfo)
    },
    battle(id,mode,type,heros,allSweep=false){
        this.battleInfo = {dungeonId:id,mode:mode,type:type,heros:heros,allSweep:allSweep}
        Gm.sendCmdHttp(MSGCode.OP_DUNGEON_BATTLE_C,this.battleInfo)
    },
    edit(info){
        this.editInfo = info
        Gm.sendCmdHttp(MSGCode.OP_EDIT_DUNGEON_TEAM_C,this.editInfo)
    },
    invite(inviteId,dungeonId){
        var reply= 1
        Gm.sendCmdHttp(MSGCode.OP_REPLY_DUNGEON_INVITE_C,{sendInviteId:inviteId,dungeonId:dungeonId,reply:reply})
    },
    record(id){
        Gm.sendCmdHttp(MSGCode.OP_DUNGEON_RECORD_C,{dungeonId:id})
    },
});
