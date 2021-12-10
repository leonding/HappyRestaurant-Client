var MSGCode = require("MSGCode")
//同盟争霸 进入页面
MSGCode.proto[MSGCode.OP_SHOW_ALLIANCE_WAR_PVP_C]        = "AllianceWar.ShowAllianceWarPvp"
MSGCode.proto[MSGCode.OP_SHOW_ALLIANCE_WAR_PVP_S]        = "AllianceWar.ShowAllianceWarPvpRet"

//全部地图的缩略信息)
MSGCode.proto[MSGCode.OP_SHOW_ALLIANCE_WAR_C]        = "AllianceWar.ShowAllianceWar"
MSGCode.proto[MSGCode.OP_SHOW_ALLIANCE_WAR_S]        = "AllianceWar.ShowAllianceWarRet"

//鼓舞
MSGCode.proto[MSGCode.OP_ADD_ENCOURAGE_C] = "AllianceWar.AddEncourage"
MSGCode.proto[MSGCode.OP_ADD_ENCOURAGE_S] = "AllianceWar.AddEncourageRet"

//服务器有数据变化
MSGCode.proto[MSGCode.OP_SHOW_ALLIANCE_WAR_CHANGE_STATE_C]        = "AllianceWar.ShowAllianceWarChangeState"
MSGCode.proto[MSGCode.OP_SHOW_ALLIANCE_WAR_CHANGE_STATE_S]        = "AllianceWar.ShowAllianceWarChangeStateRet"

//同盟争霸--对某一个城宣战
MSGCode.proto[MSGCode.OP_DECLARE_WAR_C]        = "AllianceWar.DeclareWar"
MSGCode.proto[MSGCode.OP_DECLARE_WAR_S]        = "AllianceWar.DeclareWarRet"

//城市情报
MSGCode.proto[MSGCode.OP_SHOW_CASTLE_MAP_INFO_C] = "AllianceWar.ShowCastleMapInfo"
MSGCode.proto[MSGCode.OP_SHOW_CASTLE_MAP_INFO_S] = "AllianceWar.ShowCastleMapInfoRet"

//同盟争霸--展示清剿的地图怪物
MSGCode.proto[MSGCode.OP_SHOW_ALLIANCE_WAR_MAP_C]        = "AllianceWar.ShowAllianceWarMap"
MSGCode.proto[MSGCode.OP_SHOW_ALLIANCE_WAR_MAP_S]        = "AllianceWar.ShowAllianceWarMapRet"

//同盟争霸--发起挑战
MSGCode.proto[MSGCode.OP_BATTLE_ALLIANCE_WAR_C]        = "AllianceWar.BattleAllianceWar"
MSGCode.proto[MSGCode.OP_BATTLE_ALLIANCE_WAR_S]        = "AllianceWar.BattleAllianceWarRet"

//同盟争霸--展示所有队伍(个人)
MSGCode.proto[MSGCode.OP_SHOW_ALL_MYSELFARMYS_C]        = "AllianceWar.ShowAllMyselfArmys"
MSGCode.proto[MSGCode.OP_SHOW_ALL_MYSELFARMYS_S]        = "AllianceWar.ShowAllMyselfArmysRet"

//同盟争霸--队伍设置(个人)
MSGCode.proto[MSGCode.OP_JOIN_TEAM_INFO_C]   = "AllianceWar.CreateMyArmys"
MSGCode.proto[MSGCode.OP_JOIN_TEAM_INFO_S]   = "AllianceWar.CreateMyArmysRet"

//同盟争霸--城堡军队情况(进攻)
MSGCode.proto[MSGCode.OP_SHOW_MAP_ARMYS_ATK_C ] = "AllianceWar.ShowMapArmysAtk"
MSGCode.proto[MSGCode.OP_SHOW_MAP_ARMYS_ATK_S ] = "AllianceWar.ShowMapArmysAtkRet"

//同盟争霸--城堡军队情况(防守)
MSGCode.proto[MSGCode.OP_SHOW_MAP_ARMYS_DEF_C] = "AllianceWar.ShowMapArmysDef"
MSGCode.proto[MSGCode.OP_SHOW_MAP_ARMYS_DEF_S] = "AllianceWar.ShowMapArmysDefRet"

//同盟争霸--城堡军队派遣(个人操作)
MSGCode.proto[MSGCode.OP_JOIN_MAP_ARMYS_INFO_C] = "AllianceWar.JoinMapArmysInfos"
MSGCode.proto[MSGCode.OP_JOIN_MAP_ARMYS_INFO_S] = "AllianceWar.JoinMapArmysInfosRet"

//同盟争霸--城堡军队找回
MSGCode.proto[MSGCode.OP_RECALL_MAP_ARMYS_C] = "AllianceWar.RecallMapArmysInfos"
MSGCode.proto[MSGCode.OP_RECALL_MAP_ARMYS_S] = "AllianceWar.RecallMapArmysInfosRet"

//同盟争霸--更改防守顺序(会长)
MSGCode.proto[MSGCode.OP_UPDATE_DEF_POSTION_LEADER_C] = "AllianceWar.UpdateDefPostionLeader"
MSGCode.proto[MSGCode.OP_UPDATE_DEF_POSTION_LEADER_S] = "AllianceWar.UpdateDefPostionLeaderRet"

//同盟争霸--更改出战顺序(会长)
MSGCode.proto[MSGCode.OP_UPDATE_ATK_POSTION_LEADER_C] = "AllianceWar.UpdateAtkPostionLeader"
MSGCode.proto[MSGCode.OP_UPDATE_ATK_POSTION_LEADER_S] = "AllianceWar.UpdateAtkPostionLeaderRet"

//同盟争霸--加固城堡(个人操作)
MSGCode.proto[MSGCode.OP_BUILD_FOR_CASTLE_C] = "AllianceWar.BuildForCastle"
MSGCode.proto[MSGCode.OP_BUILD_FOR_CASTLE_S] = "AllianceWar.BuildForCastleRet"

//同盟争霸--摧毁城堡(个人操作)
MSGCode.proto[MSGCode.OP_DESTROY_FOR_CASTLE_C] = "AllianceWar.DestroyForCastle"
MSGCode.proto[MSGCode.OP_DESTROY_FOR_CASTLE_S] = "AllianceWar.DestroyForCastleRet"

//同盟争霸--加固/摧毁城堡全部记录(个人操作)
MSGCode.proto[MSGCode.OP_BUILD_OR_DESTROY_LOG_C] = "AllianceWar.BuildOrDestroyLog"
MSGCode.proto[MSGCode.OP_BUILD_OR_DESTROY_LOG_S] = "AllianceWar.BuildOrDestroyLogRet"

//同盟争霸--联盟战况
MSGCode.proto[MSGCode.OP_LAST_NEW_BATTLE_INFO_C] = "AllianceWar.ShowLastNewBattleInfo"
MSGCode.proto[MSGCode.OP_LAST_NEW_BATTLE_INFO_S] = "AllianceWar.ShowLastNewBattleInfoRet"

//同盟争霸--某张地图战况
MSGCode.proto[MSGCode.OP_ATK_MAP_BATTLE_INFO_C] = "AllianceWar.AtkMapBattleInfo"
MSGCode.proto[MSGCode.OP_ATK_MAP_BATTLE_INFO_S] = "AllianceWar.AtkMapBattleInfoRet"

//同盟争霸--联盟进展
MSGCode.proto[MSGCode.OP_SHOW_MAP_BORDER_C]   =  "AllianceWar.ShowMapBorder"
MSGCode.proto[MSGCode.OP_SHOW_MAP_BORDER_S]   =  "AllianceWar.ShowMapBorderRet"

//同盟争霸--联盟进展详细
MSGCode.proto[MSGCode.OP_SHOW_BORDER_LOG_C] = "AllianceWar.ShowBorderLog"
MSGCode.proto[MSGCode.OP_SHOW_BORDER_LOG_S] = "AllianceWar.ShowBorderLogRet"

//同盟争霸--展示战斗过程
MSGCode.proto[MSGCode.OP_SHOW_BATTLE_INFO_VCR_C] = "AllianceWar.ShowBattleInfoVCR"
MSGCode.proto[MSGCode.OP_SHOW_BATTLE_INFO_VCR_S] = "AllianceWar.ShowBattleInfoVCRRet"

//同盟争霸--个人排行榜
MSGCode.proto[MSGCode.OP_SHOW_PRANK_C] = "AllianceWar.ShowPrank"
MSGCode.proto[MSGCode.OP_SHOW_PRANK_S] = "AllianceWar.ShowPrankRet"

//同盟争霸--公会排行榜
MSGCode.proto[MSGCode.OP_SHOW_ALLIANCE_RANK_C] = "AllianceWar.ShowAllianceRank"
MSGCode.proto[MSGCode.OP_SHOW_ALLIANCE_RANK_S] = "AllianceWar.ShowAllianceRankRet"

//同盟争霸---每日奖励
MSGCode.proto[MSGCode.OP_ALLIANCE_WAR_DAY_S] = "AllianceWar.AllianceWarDayMyRet"
//同盟争霸结束奖励
MSGCode.proto[MSGCode.OP_ALLIANCE_WAR_END_S]  = "AllianceWar.AllianceWarEndRet"

cc.Class({
    properties: {
    },
    //同盟争霸 进入页面
    sendAllianceWarPvp(){
        Gm.sendCmdHttp(MSGCode.OP_SHOW_ALLIANCE_WAR_PVP_C)
    },
    //全部地图的缩略信息)
    sendAllianceWar(room_id){
        this.room_id = room_id
        Gm.sendCmdHttp(MSGCode.OP_SHOW_ALLIANCE_WAR_C,{room_id:room_id})
    },
    //发送鼓舞信息
    sendInspireOpt(){
        Gm.sendCmdHttp(MSGCode.OP_ADD_ENCOURAGE_C)
    },
    //暂弃
    getAllianceWarChangeState(){
        Gm.sendCmdHttp(MSGCode.OP_SHOW_ALLIANCE_WAR_CHANGE_STATE_C)
    },
    //同盟争霸--对某一个城宣战
    sendDeclareWar(mapId){
        Gm.sendCmdHttp(MSGCode.OP_DECLARE_WAR_C,{mapId:mapId})
    },
    //同盟争霸--城市情报
    sendCastleMapInfo(mapId){
        var roomId = Gm.getLogic("HegemonyLogic").getCurrentRoomId()
        Gm.sendCmdHttp(MSGCode.OP_SHOW_CASTLE_MAP_INFO_C,{roomId:roomId,mapId:mapId})
    },
    //同盟争霸--展示清剿的地图怪物
    sendAllianceWarMap(mapId,position){
        Gm.sendCmdHttp(MSGCode.OP_SHOW_ALLIANCE_WAR_MAP_C,{playerId:Gm.userInfo.id,mapId:mapId,position:position})
    },
    //发起清剿
    sendBattleAllianceWar(mapId,lineHero,position){
         Gm.sendCmdHttp(MSGCode.OP_BATTLE_ALLIANCE_WAR_C,{
             playerId:Gm.userInfo.id,
             mapId:mapId,
             lineHero:lineHero,
             position:position
         })
    },
     //同盟争霸--展示所有队伍(个人)
    sendAllMyselfArmys(){
        Gm.sendCmdHttp(MSGCode.OP_SHOW_ALL_MYSELFARMYS_C)
    },
    //同盟争霸--队伍设置(个人)
    sendJoinTeamInfos(position,heroids){
        Gm.sendCmdHttp(MSGCode.OP_JOIN_TEAM_INFO_C,{position:position,heroids:heroids})
    },
    //同盟争霸--城堡军队情况(进攻)
    sendMapArmysAtk(mapId){
        Gm.sendCmdHttp(MSGCode.OP_SHOW_MAP_ARMYS_ATK_C,{roomId:Gm.getLogic("HegemonyLogic").getCurrentRoomId(),mapId:mapId})
    },
    //同盟争霸--城堡军队情况(防守)
    sendMapArmysDef(mapId){
        Gm.sendCmdHttp(MSGCode.OP_SHOW_MAP_ARMYS_DEF_C,{roomId:Gm.getLogic("HegemonyLogic").getCurrentRoomId(),mapId:mapId})
    },
    //同盟争霸--城堡军队派遣(个人操作)
    sendJoinMapArmysInfos(mapId,from_position){
        Gm.sendCmdHttp(MSGCode.OP_JOIN_MAP_ARMYS_INFO_C,{
            from_position:from_position,
            mapId:mapId
        })
    },
    //同盟争霸--城堡军队召回
    sendRecallMapArmysInfos(from_position){
        Gm.sendCmdHttp(MSGCode.OP_RECALL_MAP_ARMYS_C,{from_position:from_position})
    },
    //同盟争霸--更改防守顺序(会长)
    updateDefPostionLeader(mapId,postions){
        Gm.sendCmdHttp(MSGCode.OP_UPDATE_DEF_POSTION_LEADER_C,{mapId:mapId,postions:postions})
    },
    //同盟争霸--更改出战顺序(会长)
    updateAtkPostionLeader(mapId,postions){
        Gm.sendCmdHttp(MSGCode.OP_UPDATE_ATK_POSTION_LEADER_C,{mapId:mapId,postions:postions})
    },
    //同盟争霸--加固城堡(个人操作)
    sendBuildForCastle(mapId,build_points){
        this.buildMapId = mapId
        Gm.sendCmdHttp(MSGCode.OP_BUILD_FOR_CASTLE_C,{mapId:mapId,build_points:build_points})
    },
    //同盟争霸--摧毁城堡(个人操作)
    sendDestroyBuildForCastle(mapId,build_points){
        this.buildMapId = mapId
        Gm.sendCmdHttp(MSGCode.OP_DESTROY_FOR_CASTLE_C,{mapId:mapId,build_points:build_points})
    },
    //同盟争霸--加固/摧毁城堡全部记录(个人操作)
    sendBuildOrDestroyLog(mapId){
        this.buildMapId = mapId
        Gm.sendCmdHttp(MSGCode.OP_BUILD_OR_DESTROY_LOG_C,{mapId:mapId})
    },
    //同盟争霸--某张地图战况
    sendAtkMapBattleInfo(mapId){
        var roomId = Gm.getLogic("HegemonyLogic").getCurrentRoomId()
        this.atkMapBattleRoomId = roomId
        Gm.sendCmdHttp(MSGCode.OP_ATK_MAP_BATTLE_INFO_C,{mapId:mapId,roomId:roomId})
    },
    //同盟争霸--展示战斗过程
    getBattleInfoVCR(battleInfoId){
        this.battleInfoId = battleInfoId
        Gm.sendCmdHttp(MSGCode.OP_SHOW_BATTLE_INFO_VCR_C,{battleInfoId:battleInfoId})
    },
    //同盟争霸--联盟战况
    sendLastNewBattleInfo(){
        var roomId = Gm.getLogic("HegemonyLogic").getCurrentRoomId()
        Gm.sendCmdHttp(MSGCode.OP_LAST_NEW_BATTLE_INFO_C,{roomId:roomId})
    },
    //同盟进展
    sendMapBorder(){
        var roomId = Gm.getLogic("HegemonyLogic").getCurrentRoomId()
        Gm.sendCmdHttp(MSGCode.OP_SHOW_MAP_BORDER_C,{roomId:roomId})
    },
    //同盟进展详细
    sendShowBorderLog(){
        var roomId = Gm.getLogic("HegemonyLogic").getCurrentRoomId()
        Gm.sendCmdHttp(MSGCode.OP_SHOW_BORDER_LOG_C,{roomId:roomId})
    },
    //同盟争霸--个人排行榜
    getPrank(){
        Gm.sendCmdHttp(MSGCode.OP_SHOW_PRANK_C)
    },
    //同盟争霸--公会排行榜
    getAllianceRank(){
        Gm.sendCmdHttp(MSGCode.OP_SHOW_ALLIANCE_RANK_C)
    },
    addClearNum(mapId,num){
        // var roomId = Gm.getLogic("HegemonyLogic").getCurrentRoomId()
        // Gm.sendCmdHttp(,{roomId:roomId,mapId:mapId,num:num})
    },
});