var MSGCode = require("MSGCode")

MSGCode.proto[MSGCode.OP_ALLIANCE_LOGIN_INFO_S]        = "Alliance.OPAllianceLoginInfoRet"
MSGCode.proto[MSGCode.OP_RECOMMEND_LIST_C]        = "Alliance.OPRecommendList"
MSGCode.proto[MSGCode.OP_ALLIANCE_SEARCH_C]        = "Alliance.OPAllianceSearch"
MSGCode.proto[MSGCode.OP_ALLIANCE_RANK_C]        = "Alliance.OPAllianceRank"
MSGCode.proto[MSGCode.OP_ALLIANCE_LIST_S]           = "Alliance.OPAllianceListRet"
MSGCode.proto[MSGCode.OP_ALLIANCE_CREATE_C]        = "Alliance.OPAllianceCreate"
MSGCode.proto[MSGCode.OP_ALLIANCE_APPLY_JOIN_C]        = "Alliance.OPAllianceApplyJoin"

MSGCode.proto[MSGCode.OP_SYNC_ALLIANCE_INFO_S]        = "Alliance.OPSyncAllianceInfoRet"
MSGCode.proto[MSGCode.OP_ALLIANCE_SHOW_C]        = "Alliance.OPAllianceShow"
MSGCode.proto[MSGCode.OP_ALLIANCE_SHOW_S]        = "Alliance.OPAllianceShowRet"
MSGCode.proto[MSGCode.OP_ALLIANCE_OUT_C]        = "Alliance.OPAllianceOut"
MSGCode.proto[MSGCode.OP_ALLIANCE_SIGN_C]        = "Alliance.OPAllianceSign"
MSGCode.proto[MSGCode.OP_MANAGER_EDIT_C]        = "Alliance.OPManagerEdit"

MSGCode.proto[MSGCode.OP_DISBAND_ALLIANCE_C]        = "Alliance.OPDisbandAlliance"
MSGCode.proto[MSGCode.OP_DISBAND_ALLIANCE_S]        = "Alliance.OPDisbandAllianceRet"

MSGCode.proto[MSGCode.OP_SHOW_APPLY_LIST_C]        = "Alliance.OPShowApplyList"
MSGCode.proto[MSGCode.OP_SHOW_APPLY_LIST_S]        = "Alliance.OPShowApplyListRet"

MSGCode.proto[MSGCode.OP_REPLY_APPLY_C]        = "Alliance.OPReplyApply"
MSGCode.proto[MSGCode.OP_REPLY_APPLY_S]        = "Alliance.OPReplyApplyRet"

MSGCode.proto[MSGCode.OP_ALLIANCE_EXCHANGE_C]      = "Alliance.OPAllianceExchange"
MSGCode.proto[MSGCode.OP_ALLIANCE_EXCHANGE_S]        = "Alliance.OPAllianceExchangeRet"

MSGCode.proto[MSGCode.OP_ALLIANCE_BOSS_AUTO_C]      = "Alliance.OPAllianceBossAutoSet"
MSGCode.proto[MSGCode.OP_ALLIANCE_BOSS_AUTO_S]        = "Alliance.OPAllianceBossAutoSetRet"
MSGCode.proto[MSGCode.OP_ALLIANCE_BOSS_OPEN_C]      = "Alliance.OPAllianceBossOpen"
MSGCode.proto[MSGCode.OP_ALLIANCE_BOSS_OPEN_S]        = "Alliance.OPAllianceBossOpenRet"

MSGCode.proto[MSGCode.OP_ALLIANCE_BOSS_INFO_C]        = "Alliance.OPAllianceBossInfo"
MSGCode.proto[MSGCode.OP_ALLIANCE_BOSS_INFO_S]        = "Alliance.OPAllianceBossInfoRet"

MSGCode.proto[MSGCode.OP_ALLIANCE_BOSS_BATTLE_C]      = "Alliance.OPAllianceBossBattle"
MSGCode.proto[MSGCode.OP_ALLIANCE_BOSS_BATTLE_S]      = "Alliance.OPAllianceBossBattleRet"

MSGCode.proto[MSGCode.OP_ALLIANCE_BOSS_RANK_C]      = "Alliance.OPAllianceBossRankInfo"
MSGCode.proto[MSGCode.OP_ALLIANCE_BOSS_RANK_S]      = "Alliance.OPAllianceBossRankInfoRet"

MSGCode.proto[MSGCode.OP_ALLIANCE_BOSS_INSPIRE_C]      = "Alliance.OPAllianceBossInspire"
MSGCode.proto[MSGCode.OP_ALLIANCE_BOSS_INSPIRE_S]      = "Alliance.OPAllianceBossInspireRet"


//岛屿总览(进入联盟竞技界面)
MSGCode.proto[MSGCode.OP_ALLIANCE_ALLISLANDS_C]   =  "Alliance.AllIslandsAllianceGVE"
MSGCode.proto[MSGCode.OP_ALLIANCE_ALLISLANDS_S]    = "Alliance.AllIslandsAllianceGVERet"

//进入到岛屿请求数据
MSGCode.proto[MSGCode.OP_ALLIANCE_ENTRY_GVE_C]  = "Alliance.EntryAllianceGVE" 
MSGCode.proto[MSGCode.OP_ALLIANCE_ENTRY_GVE_S]  = "Alliance.EntryAllianceGVERet"

//展示挑战地图的怪物
MSGCode.proto[MSGCode.OP_ALLIANCE_SHOW_GVE_C] = "Alliance.ShowAllianceGVE"
MSGCode.proto[MSGCode.OP_ALLIANCE_SHOW_GVE_S] = "Alliance.ShowAllianceGVERet"

//发起挑战和返回
MSGCode.proto[MSGCode.OP_ALLIANCE_BATTLE_GVE_C] = "Alliance.BattleAllianceGVE"
MSGCode.proto[MSGCode.OP_ALLIANCE_BATTLE_GVE_S] = "Alliance.BattleAllianceGVERet"

//更新联盟竞技解锁状态（服务器主动推送）
MSGCode.proto[MSGCode.OP_ALLIANCE_LAST_AGGREGATE_ISLANDS_S] = "Alliance.AllianceGVEChangePointslandsRet"
//更新联盟竞技的积分
//MSGCode.proto[MSGCode.OP_ALLIANCE_CHANGEPOINT_S]  = "Alliance.AllianceGVEChangePointslandsRet"

//公会竞技复活和返回
MSGCode.proto[MSGCode.OP_ALLIANCE_REVIVE_HERO_C] = "Alliance.AllianceGVEReviveHero"
MSGCode.proto[MSGCode.OP_ALLIANCE_REVIVE_HERO_S] = "Alliance.AllianceGVEReviveHeroRet"

//公会竞技复活全部和返回
MSGCode.proto[MSGCode.OP_ALLIANCE_ALL_HEROS_REVIVE_C] = "Alliance.AllianceGVEALlHerosRevive"
MSGCode.proto[MSGCode.OP_ALLIANCE_ALL_HEROS_REVIVE_S] = "Alliance.AllianceGVEALlHerosReviveRet"

//领取收益和返回
MSGCode.proto[MSGCode.OP_ALLIANCE_REVIVE_RAWARD_C] = "Alliance.GetAllianceGVEReward"
MSGCode.proto[MSGCode.OP_ALLIANCE_REVIVE_RAWARD_S] = "Alliance.GetAllianceGVERewardRet"

//公会竞技排行榜
MSGCode.proto[MSGCode.OP_ALLIANCE_SHOW_RANK_C]  = "Alliance.ShowAllianceGVERank"
MSGCode.proto[MSGCode.OP_ALLIANCE_SHOW_RANK_S]  = "Alliance.ShowAllianceGVERankRet"

//打开竞技任务和返回
MSGCode.proto[MSGCode.OP_ALLIANCE_SHOW_TASK_C] =  "Alliance.ShowAllianceGVETask"
MSGCode.proto[MSGCode.OP_ALLIANCE_SHOW_TASK_S] =  "Alliance.ShowAllianceGVETaskRet"
MSGCode.proto[MSGCode.OP_ALLIANCE_ACTIVITY_POINTS_S] = "Alliance.AllianceActivityPointsRet"

//公会竞技领取奖励和更新
MSGCode.proto[MSGCode.OP_ALLIANCE_TASK_RECEIVE_C] = "Alliance.AllianceGVETaskReceive"
MSGCode.proto[MSGCode.OP_ALLIANCE_TASK_RECEIVE_S] = "Alliance.AllianceTaskReceiveRet"

//公会竞技领取活跃度奖励
MSGCode.proto[MSGCode.OP_ALLIANCE_TASK_ACTIVE_C] = "Alliance.AllianceTaskActiveReceive"
MSGCode.proto[MSGCode.OP_ALLIANCE_TASK_ACTIVE_S] = "Alliance.AllianceTaskActiveReceiveRet"

//工会竞技更新怪物  
MSGCode.proto[MSGCode.OP_ALLIANCE_ONE_ISLANDS_C] = "Alliance.AllianceGVEGetOneIslandsInfo"
MSGCode.proto[MSGCode.OP_ALLIANCE_ONE_ISLANDS_S] = "Alliance.AllianceGVEGetOneIslandsInfoRet"

cc.Class({
    properties: {
    },
    bossInspire(){
        Gm.sendCmdHttp(MSGCode.OP_ALLIANCE_BOSS_INSPIRE_C)
    },
    bossRank(){
        Gm.sendCmdHttp(MSGCode.OP_ALLIANCE_BOSS_RANK_C)
    },
    bossInfo(isShow){
        if (!Gm.unionData.isUnion()){
            Gm.floating(1721)
            return
        }
        this.isOpenBossView = isShow
        Gm.sendCmdHttp(MSGCode.OP_ALLIANCE_BOSS_INFO_C)
    },
    bossBattle(list){
        this.battleQueue = {battleInfo:[]}
        Gm.heroData.setLineHero({type:ConstPb.lineHero.ALLIANCE_BOSS,hero:list})
        Gm.sendCmdHttp(MSGCode.OP_ALLIANCE_BOSS_BATTLE_C,{lineHero:list})
    },
    bossOpen(){
        Gm.sendCmdHttp(MSGCode.OP_ALLIANCE_BOSS_OPEN_C)
    },
    bossAuto(auto){
        Gm.sendCmdHttp(MSGCode.OP_ALLIANCE_BOSS_AUTO_C,{autoBattle:auto})
    },
    exchange(id,num){
        Gm.sendCmdHttp(MSGCode.OP_ALLIANCE_EXCHANGE_C,{itemId:id,count:num})
    },
    replyApply(id,ac){
        this.replyId = id
        Gm.sendCmdHttp(MSGCode.OP_REPLY_APPLY_C,{applyId:id,action:ac})
    },
    applyList(){
        Gm.sendCmdHttp(MSGCode.OP_SHOW_APPLY_LIST_C)
    },
    disband(){
        Gm.sendCmdHttp(MSGCode.OP_DISBAND_ALLIANCE_C)
    },
    mgrEdit(data){
        Gm.sendCmdHttp(MSGCode.OP_MANAGER_EDIT_C,data)
    },
    recommendList:function() {
        Gm.sendCmdHttp(MSGCode.OP_RECOMMEND_LIST_C)
    },
    search:function(content) {
        Gm.sendCmdHttp(MSGCode.OP_ALLIANCE_SEARCH_C,{content:content})
    },
    rank:function() {
        Gm.sendCmdHttp(MSGCode.OP_ALLIANCE_RANK_C)
    },
    create(name,notice,headIcon=0){
        Gm.sendCmdHttp(MSGCode.OP_ALLIANCE_CREATE_C,{name:name,notice:notice,headIcon:headIcon})
    },
    join(id,msg){
        this.joinId = id
        Gm.sendCmdHttp(MSGCode.OP_ALLIANCE_APPLY_JOIN_C,{allianceId:id,message:msg})
    },
    show(id){
        Gm.sendCmdHttp(MSGCode.OP_ALLIANCE_SHOW_C,{allianceId:id})
    },
    out(id){
        Gm.sendCmdHttp(MSGCode.OP_ALLIANCE_OUT_C,{})
    },
    sign(){
        Gm.sendCmdHttp(MSGCode.OP_ALLIANCE_SIGN_C)
        
    },

    //打开联盟竞技界面
    sportsInfo(){
        Gm.sendCmdHttp(MSGCode.OP_ALLIANCE_ALLISLANDS_C)
    },
    //进入岛屿界面
    enterIslandInfo(islands){
         Gm.sendCmdHttp(MSGCode.OP_ALLIANCE_ENTRY_GVE_C,{playerId:Gm.userInfo.id,islands:islands})
    },
    //展示挑战地图的怪物
    showGVE(id){
        Gm.sendCmdHttp(MSGCode.OP_ALLIANCE_SHOW_GVE_C,{playerId:Gm.userInfo.id,modelId:id})
    },
    //发起挑战
    battleGVE(id,heros){
        Gm.sendCmdHttp(MSGCode.OP_ALLIANCE_BATTLE_GVE_C,{playerId:Gm.userInfo.id,model_id:id,lineHero:heros})
    },
    //复活英雄
    reviveHero(){
        Gm.sendCmdHttp(MSGCode.OP_ALLIANCE_REVIVE_HERO_C,{playerId:Gm.userInfo.id})
    },
    reviveAllHero(){
        Gm.sendCmdHttp(MSGCode.OP_ALLIANCE_ALL_HEROS_REVIVE_C,{playerId:Gm.userInfo.id})
    },
    //领取挂机奖励
    getReward(boxId){
        Gm.sendCmdHttp(MSGCode.OP_ALLIANCE_REVIVE_RAWARD_C,{playerId:Gm.userInfo.id,boxId:boxId})
    },
    //获取排行榜信息
    sportsRankInfo(){
        Gm.sendCmdHttp(MSGCode.OP_ALLIANCE_SHOW_RANK_C,{playerId:Gm.userInfo.id})
    },
    //打开竞技界面
    sportsTaskInfo(){
        Gm.sendCmdHttp(MSGCode.OP_ALLIANCE_SHOW_TASK_C,{playerId:Gm.userInfo.id})
    },
    //公会竞技任务领取奖励
    sportsTaskReward(id){
        this.m_iGetId = id
        Gm.sendCmdHttp(MSGCode.OP_ALLIANCE_TASK_RECEIVE_C,{playerId:Gm.userInfo.id,taskId:id})
    },
    //公会竞技活跃度任务领取奖励
    sportsTaskActiveReward(id){
        Gm.sendCmdHttp(MSGCode.OP_ALLIANCE_TASK_ACTIVE_C,{playerId:Gm.userInfo.id,activeId:id})
    },
    //更新怪物数据
    updataMonster(group){
         Gm.sendCmdHttp(MSGCode.OP_ALLIANCE_ONE_ISLANDS_C,{playerId:Gm.userInfo.id,islandsId:group})
    }
});
