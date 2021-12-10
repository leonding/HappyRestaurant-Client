var CoreLogic = require("CoreLogic")
cc.Class({
    extends: CoreLogic,
    properties: {
        
    },
    ctor:function(){
        
    },
    register:function(){
        this.events[Events.SOCKET_OPEN]        = this.onSocketOpen.bind(this)

        this.events[MSGCode.OP_ALLIANCE_LOGIN_INFO_S]   = this.onNetLoginInfo.bind(this)
        this.events[MSGCode.OP_ALLIANCE_LIST_S]   = this.onNetRelist.bind(this)

        this.events[MSGCode.OP_SYNC_ALLIANCE_INFO_S]   = this.onNetInfoSYNC.bind(this)
        this.events[MSGCode.OP_ALLIANCE_SHOW_S]   = this.onNetInfoShow.bind(this)
        this.events[MSGCode.OP_DISBAND_ALLIANCE_S]   = this.onNetDisband.bind(this)
        this.events[MSGCode.OP_SHOW_APPLY_LIST_S]   = this.onNetApplyList.bind(this)
        this.events[MSGCode.OP_REPLY_APPLY_S]   = this.onNetReplyApply.bind(this)

        this.events[MSGCode.OP_ALLIANCE_EXCHANGE_S]   = this.onNetExchange.bind(this)

        this.events[MSGCode.OP_ERROR_CODE_INFO_S] = this.onNetErrorCode.bind(this)

        this.events[MSGCode.OP_ALLIANCE_BOSS_OPEN_S] = this.onNetBossOpen.bind(this)
        this.events[MSGCode.OP_ALLIANCE_BOSS_BATTLE_S] = this.onNetBossBattle.bind(this)
        this.events[MSGCode.OP_ALLIANCE_BOSS_RANK_S] = this.onNetBossRank.bind(this)
        this.events[MSGCode.OP_ALLIANCE_BOSS_INFO_S] = this.onNetBossInfo.bind(this)

        this.events[MSGCode.OP_REFRESH_ONOFFLINE_S] = this.onNetOnOff.bind(this)

        //公会竞技登陆消息
        this.events[MSGCode.OP_ALLIANCE_ALLISLANDS_S] = this.onAllIslandsAllianceGVERet.bind(this)
        //进入某个岛屿信息
        this.events[MSGCode.OP_ALLIANCE_ENTRY_GVE_S] = this.onEntryAllianceGVERet.bind(this)
        //公会竞技显示怪物消息
        this.events[MSGCode.OP_ALLIANCE_SHOW_GVE_S] = this.onShowAllianceGVERet.bind(this)
        //公会竞技发起挑战
        this.events[MSGCode.OP_ALLIANCE_BATTLE_GVE_S] = this.onSportsBattle.bind(this)
        //工会竞技更新分数
        this.events[MSGCode.OP_ALLIANCE_LAST_AGGREGATE_ISLANDS_S] = this.onChangePoints.bind(this)
        //公会竞技复活所有英雄
        this.events[MSGCode.OP_ALLIANCE_REVIVE_HERO_S] = this.onSportsReviveAll.bind(this)
        //领取收益
        this.events[MSGCode.OP_ALLIANCE_REVIVE_RAWARD_S] = this.onSportsReward.bind(this)
        //打开竞技任务
        this.events[MSGCode.OP_ALLIANCE_SHOW_TASK_S] = this.onSportsTaskInfo.bind(this)
        //公会竞技领取奖励和任务更新
        this.events[MSGCode.OP_ALLIANCE_TASK_RECEIVE_S] = this.onSportTaskUpdate.bind(this)
        this.events[MSGCode.OP_TASK_RECEIVE_S]                   = this.onTaskReceive.bind(this)
        //公会竞技领取活跃度奖励
        this.events[MSGCode.OP_ALLIANCE_TASK_ACTIVE_S] = this.onSportActiveTaskUpdate.bind(this)
        //公会竞技贡献度广播
        this.events[MSGCode.OP_ALLIANCE_ACTIVITY_POINTS_S] = this.onAllianceActivityPointsRet.bind(this)
        //公会竞技复活所有的英雄
        //this.events[MSGCode.OP_ALLIANCE_ALL_HEROS_REVIVE_S] = this.onSportsReviveAll.bind(this)
        //工会竞技排行榜
        this.events[MSGCode.OP_ALLIANCE_SHOW_RANK_S] = this.onSportsRankInfo.bind(this)
    },
    onNetOnOff(args){
        if (args.module != 1){
            return
        }
        Gm.unionData.changeOffOn(args.friendInfo || [])
        Gm.ui.create("UnionInfoView")
    },
    onNetBossInfo(args){
        Gm.unionData.bossInfo = args.bossInfo
        if (Gm.unionNet.isOpenBossView){
            Gm.unionNet.isOpenBossView = false
            Gm.ui.create("UnionBossView")
        }
        Gm.red.refreshEventState("union")
    },
    onNetBossRank(args){
        Gm.unionData.bossRankData = args
        Gm.ui.create("UnionBossRankView")
    },
    onNetBossBattle:function(args){
        var bossConf = Gm.config.getUnionBoss(Gm.unionData.bossInfo.level)

        args.battleInfo.monsterGroupId = args.monsterGroupId
        args.battleInfo.source = args.source
        args.battleInfo.hurt = args.hurt

        Gm.unionNet.battleQueue.battleInfo.push(args.battleInfo)
        //最后一个消息体
        if (args.battleInfo.fightResult == 0 || args.monsterGroupId == bossConf.monsterGroup[bossConf.monsterGroup.length-1].id){
            //跳战斗
            Gm.ui.create("BattleLoadView",Gm.unionNet.battleQueue)

            Gm.unionNet.bossInfo()
        }
    },
    onNetBossOpen:function(args){
        Gm.unionData.bossInfo = args.bossInfo
        Gm.red.refreshEventState("union")
        Gm.send(MSGCode.P_WC_SYSTEM_MARQUEE_RES,{marqueeSYN:[{marqueeId:-1004,contentAlias:"1004"}]})
    },
    onSocketOpen:function(args){
        Gm.unionData.clearData()
    },
    onNetLoginInfo(args){
        Gm.unionData.id = args.allianceId
        Gm.unionData.isSign = args.isSign || false
        Gm.userInfo.devote = args.devote
        Gm.unionData.lastQuitTime = args.lastQuitTime
        Gm.red.refreshEventState("union")
        if (Gm.unionData.isUnion()){
            Gm.unionNet.show(Gm.unionData.id)
        }
    },
    onNetRelist(args){
        if (args.type == 1 || args.type == 2){
            Gm.unionData.reList = args.allianceInfos
            this.updateView()
        }else if (args.type == 3){
            Gm.unionData.rankList = args.allianceInfos
            Gm.ui.create("UnionRankView",true)
        }
    },
    onNetInfoSYNC(args){
        if(args.allianceInfo){
            Gm.unionData.setInfo(args.allianceInfo)
            Gm.unionData.reList = null
        }
        if (args.type == ConstPb.allianceReqType.CREATE ){
            Gm.ui.removeByName("UnionCreateView")
            if (!Gm.unionData.isSign ){
                Gm.unionNet.sign()
                return
            }
        }else if (args.type == ConstPb.allianceReqType.SIGN ){
            Gm.unionData.isSign = true
            if (Gm.unionData.isMgr()){
                Gm.unionNet.applyList()
            }
        }else if (args.type == ConstPb.allianceReqType.APPLY_JOIN ){
            if (Gm.unionData.reList){
                Gm.floating(Ls.get(800073))
                for (let index = 0; index < Gm.unionData.reList.length; index++) {
                    const v = Gm.unionData.reList[index];
                    if (v.allianceId == Gm.unionNet.joinId){
                        v.applyStatus = 0
                    }
                }
            }else{
                if (args.memberId){
                    return
                }
                if (!Gm.unionData.isSign ){
                    Gm.unionNet.sign()
                    return
                }
            }
        }else if (args.type == ConstPb.allianceReqType.OUT || args.type == ConstPb.allianceReqType.EDIT_KICK_OUT ){
            if (args.allianceInfo == null){
                Gm.unionData.setInfo(null)
                Gm.ui.removeByName("UnionInfoView")
                if (args.type == ConstPb.allianceReqType.EDIT_KICK_OUT){
                    Gm.floating(Ls.get(800074))    
                }else{
                    // Gm.userInfo.devote = 0 
                    Gm.unionData.lastQuitTime = Gm.userData.getTime_m()
                }
                Gm.unionData.cleanSportsData()
            }
            Gm.red.refreshEventState("union")
        }else if (args.type == ConstPb.allianceReqType.EDIT_SEC_LEADER){
            if (args.playerId == args.memberId){
                var member = Gm.unionData.getMember(args.memberId)
                member.arenaFightInfo.role = member.arenaFightInfo.role==ConstPb.allianceRole.ALLIANCE_ROLE_COMMON?ConstPb.allianceRole.ALLIANCE_ROLE_SECLEADER:ConstPb.allianceRole.ALLIANCE_ROLE_COMMON
            }
        }
        
        this.updateView()
    },
    onNetInfoShow(args){
        if (args.allianceInfo.allianceId == Gm.unionData.id){
            Gm.unionData.setInfo(args.allianceInfo)
            this.updateView()
            if (Gm.unionData.isMgr()){
                Gm.unionNet.applyList()
            }
            return
        }
    },
    onNetDisband(args){
        Gm.floating(Ls.get(800075))
        Gm.ui.removeByName("UnionMgrView")
        Gm.ui.removeByName("UnionInfoView")
        Gm.unionData.setInfo(null)
        this.updateView()
    },
    onNetApplyList(args){
        Gm.unionData.applyList = args.memberInfos
        Gm.red.refreshEventState("union")
    },
    onNetReplyApply(args){
        if (args.applyId == 0){
            Gm.unionData.applyList = []
        }else{
            for (let index = 0; index < Gm.unionData.applyList.length; index++) {
                const v = Gm.unionData.applyList[index];
                if (v.arenaFightInfo.playerId == args.applyId){
                    Gm.unionData.applyList.splice(index,1)
                    break
                }
            }
        }
        Gm.red.refreshEventState("union")
        this.updateView()
    },
    onNetExchange(args){
    },
    onNetErrorCode:function(args){
        if (args.errCode == -30037 && Gm.unionNet.replyId){
            Gm.send(MSGCode.OP_REPLY_APPLY_S,{applyId:Gm.unionNet.replyId})
        }
    },

    //进入工会竞技
    onAllIslandsAllianceGVERet(data){
        if(data){
            Gm.unionData.setSportsEndTime(data.endTime)
            Gm.unionData.setSportsMissionEndTime(data.endTime)
            Gm.unionData.setMaxOPenIslandId(data.IslandsLastOpen)
            Gm.unionData.setNextOpenTime(data.nextopentime || -1)
            Gm.unionData.setSportsHeroData(data.heroInfo)
            Gm.unionData.setReviceHeroHasFree(data.freeFuhuo)
            Gm.unionData.setBattleLimit(data.battle_limit)
            if(data.islandsInfos){
                for(var i=0;i<data.islandsInfos.length;i++){
                    for(var j=0;j<data.islandsInfos[i].boxsId.length;j++){
                        Gm.unionData.addAlreadyReciveRewardList(data.islandsInfos[i].islands,data.islandsInfos[i].boxsId[j])
                    }
                    if(data.islandsInfos[i].islands == data.IslandsLastOpen){
                         Gm.unionData.setCurrrentPoints(data.islandsInfos[i].points || 0)
                    }
                }
            }
        }
        this.onOpenUnionSportsView()
    },
    //进入岛屿
    onEntryAllianceGVERet(data){
        if(data){
            Gm.unionData.setIslandData(data.islands,data)
            var maxId = Gm.unionData.getMaxOpenIslandId()
            if(maxId == data.islands){
                Gm.unionData.setCurrrentPoints(data.points)
            }
            for(var i=0;i<data.allIslandsRecord.length;i++){
                for(var j=0;j<data.allIslandsRecord[i].isFirstRewardId.length;j++){
                    Gm.unionData.addAleardyPassId(data.allIslandsRecord[i].isFirstRewardId[j])
                }
            }
            //for(var i=0;i<data.allIslandsRecord.length;i++){
                if(data.boxsId){
                    Gm.unionData.setAlreadyReciveRewardList(data.islands,data.boxsId)
                }
            //}
            Gm.send(Events.SPORTS_TOWER_INFO)
        }
    },
    onShowAllianceGVERet(data){
        Gm.unionData.setMonsterData(data.modelId,data.heroInfo)
        Gm.send(Events.SPORTS_UPDATE_MONSTER)
    },
    onSportsBattle(data){
        //修改血量
        for(var i=0;i<data.finalStatus.length;i++){
            const v = data.finalStatus[i];
            var roleHero = Func.forBy(data.battleInfo.battleData.roleInfo,"pos",v.pos)

            var hpData = {}
            hpData.hp = v.hp
            hpData.mp = v.mp
            hpData.maxHp = roleHero.maxHp
            hpData.maxMp = roleHero.maxMp
            
            var tmpHero
            if (roleHero.pos < 0){//怪物
                tmpHero = Gm.unionData.getSportsMonsterByTowerId(data.stageId,roleHero.baseId)
            }else{//英雄
                tmpHero = Gm.unionData.getHeroById(roleHero.id)
            }
            if (tmpHero){
                Gm.unionData.saveEventHp(tmpHero,hpData)
            }
        }
        Gm.unionData.setBattleLimit(data.battle_limit)
        if(data.battleInfo.fightResult == 1){
            var eventGroupConf = Gm.config.getAllianceIslandsMonsterConfigById(data.stageId)
            if(eventGroupConf.group == Gm.unionData.getMaxOpenIslandId()){
                var array = eventGroupConf.scorShow.split("_")
                data.battleInfo.battleScore = {type:array[0],id:array[1],num:array[2]}
            }
            Gm.unionData.addAleardyPassId(data.stageId)
            Gm.unionData.reciveMonsterHp(data.stageId)
        }
        
        data.battleInfo.finalStatus = data.finalStatus
        //显示战斗界面
        Gm.ui.create("BattleLoadView",{battleInfo:[data.battleInfo],isRecord:true})

        //联盟竞技爬塔界面更新
        setTimeout(function(){
            Gm.send(Events.SPORTS_TOWER_UPDATE)
        },1000)
    },
    
    //更新分数
    onChangePoints(data){
        if(data){
            var id = Gm.unionData.getMaxOpenIslandId()
            if(data.islands < id){//小于的岛屿不需要处理

            }
            else if(data.islands == id){
                var config = Gm.config.getAllianceIslandsConfigById(id).scores
                var maxValue = config[config.length-1].num
                if(data.points >= maxValue){
                    var config = Gm.config.getAllianceIslandsConfig()
                    if(id+1>config.length){
                       Gm.unionData.setMaxOPenIslandId( id)
                      Gm.unionData.setCurrrentPoints(data.points)
                    }
                    else{
                        Gm.unionData.setMaxOPenIslandId( id+1)
                        Gm.unionData.setCurrrentPoints(0)
                        Gm.send(Events.SPORTS_SHOW_NEWCHAPTER)
                    }
                }
                else{
                    Gm.unionData.setCurrrentPoints(data.points)
                } 
            }
            else{
                  Gm.unionData.setMaxOPenIslandId(data.islands)
                  Gm.unionData.setCurrrentPoints(data.points)
            }
        }
        //联盟竞技爬塔界面更新 
        Gm.send(Events.SPORTS_TOWER_UPDATE)
    },
    //公会竞技复活英雄
    onSportsRevive(data){
        if(data && data.heroId){
            Gm.unionData.reviveHeroById(data.heroId)
            Gm.send(Events.SPORTS_HERO_REVIVE,data)
        }
    },
    //公会竞技复活所有的英雄
    onSportsReviveAll(data){
        if(data){
            Gm.unionData.reviveHeroInfo(data)
            Gm.unionData.setReviceHeroHasFree(data.freeFuhuo)
            Gm.send(Events.SPORTS_HERO_REVIVE_ALL)
        }
    },
    //领取收益
    onSportsReward(data){
        if(data && data.boxId){
            var config = Gm.config.getAllianceIslandReward(data.boxId)
            Gm.unionData.addAlreadyReciveRewardList(config.group,data.boxId)
            //Gm.receive(config.reword)
            Gm.send(Events.SPORTS_TOWER_UPDATE)
        }
    },
    //打开竞技任务
    onSportsTaskInfo(data){
        if(data){
            Gm.unionData.setSportsMissionPoints(data.activityPoints)
            Gm.unionData.setSportsMissionData(data)
            Gm.unionData.activeReceivedList = data.activeReceivedList
            Gm.unionData.setSportsMissionEndTime(data.endTime)
            Gm.send(Events.SPORTS_MISSION_UPDATE)
            Gm.red.refreshEventState("union")
        }
    },
    //更新竞技任务
    onTaskReceive(data){
        if(data && data.taskList && data.taskList[0]){
            var config = Gm.config.getTaskById(data.taskList[0].id)
            if(config.type == 6){
                this.onSportTaskUpdate(data)
            }
        }
    },
    onSportTaskUpdate(data){
        if(data){
            Gm.unionData.setSportsMissionPoints(data.activityPoints)
            Gm.unionData.updateSportsMissonData(data)
            Gm.send(Events.SPORTS_MISSION_UPDATE)
            Gm.red.refreshEventState("union")
        }
    },
    //领取活跃度奖励
    onSportActiveTaskUpdate(data){
        if (data.activeId){
            Gm.unionData.activeReceivedList.push(data.activeId)
            Gm.send(Events.SPORTS_MISSION_UPDATE)
            var tmpData = Gm.config.getAllianceTaskActiveConfigById(data.activeId)
            Gm.receive(tmpData.reward)
        }
    },
    onAllianceActivityPointsRet(data){
        if(data){
            Gm.unionData.setSportsMissionPoints(data.activityPoints)
            Gm.send(Events.SPORTS_MISSION_UPDATE)
        }
    },
    openUnionSportsView(){
        var config = Gm.config.getViewById(40002)
         if(!config.openMapId ||  config.openMapId <= Gm.userInfo.getMaxMapId()){
                var time = Gm.unionData.getSportsEndTime()
                if(time !=0 && time>Gm.userData.getTime_m()){//有数据是打开状态
                    Gm.ui.create("UnionSportsView")
                }
                else{
                    Gm.unionData.cleanSportsData()
                    Gm.red.refreshEventState("union")
                    Gm.unionNet.sportsInfo()
                }
        }
        else{
                Gm.floating(config.tips)
        }
    },
    onOpenUnionSportsView(){
        Gm.ui.create("UnionSportsView")
    },
    onSportsRankInfo(data){
        Gm.unionData.setSportsRankData(data)
        Gm.send(Events.SPORTS_RANK_INFO)
    },
    openSportsModelSelectView(){
        var maxOpenId = Gm.unionData.getMaxOpenIslandId()
        var config = Gm.config.getAllianceIslandsConfigById(maxOpenId)
        Gm.ui.create("SportsModelSelectView",{group:maxOpenId,name:config.name || ""})
    }
});

