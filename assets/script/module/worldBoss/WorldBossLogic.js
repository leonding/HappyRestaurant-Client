var CoreLogic = require("CoreLogic")
cc.Class({
    extends: CoreLogic,
    properties: {
        
    },
    ctor:function(){
        this.unlockMapId = 0
        this.init()
    },
    timeStart:function(){
        this.clearTime()
        this.interval = setInterval(function(){
            this.checkRed()
        }.bind(this),3000)
    },
    clearTime(){
        if (this.interval != null){
            clearInterval(this.interval)
            this.interval = null
        }
    },
    init(){
        this.totalScore = 0
        this.lastScore = 0
        this.rank = 0 
    },
    register:function(){
        this.events[Events.LOGIN_SUC]        = this.onLoginSuc.bind(this)
        this.events[MSGCode.OP_WORLD_INFO_S] = this.onNetBossInfo.bind(this)
        this.events[MSGCode.OP_WORLD_BATTLE_S] = this.onNetBossBattle.bind(this)
        this.events[MSGCode.OP_WORLD_RANK_S] = this.onNetBossRank.bind(this)
        // this.events[MSGCode.OP_PUSH_REWARD_S]        = this.onNetReward.bind(this)
        this.events[MSGCode.OP_WORLD_CLEARING_S]        = this.onNetClearing.bind(this)
    },
    onNetClearing(args){
        if (this.isView()){
            Gm.ui.create("WorldBossAwardView",args)
        }
        this.init()
    },
    onNetBossInfo(args){
        if (args.battleTime){
            Gm.worldBossData.setBattleTime(args.battleTime)
        }
        if (args.firstBattleTime){
            Gm.worldBossData.setFirstBattleTime(args.firstBattleTime)
        }

        
    },
    onNetBossRank(args){
        if (args.allianceRank){
            Gm.worldBossData.allianceRank = args.allianceRank
        }
        if (args.playerRank){
            Gm.worldBossData.playerRank = args.playerRank
        }

        this.totalScore = Gm.worldBossData.playerRank.score
        
        if (this.nowBattleData){
            this.nowBattleData.nowRank = Gm.worldBossData.getPlayerNowRank()
            this.nowBattleData  = null
        }
        if (this.isView()){
            this.view.updateNowToggle()
        }
    },
    onNetBossBattle:function(args){
        args.battleInfo.lastScore = this.lastScore

        args.battleInfo.lastRank = Gm.worldBossData.getPlayerNowRank()
        args.battleInfo.nowScore = args.totalScore - this.totalScore

        args.battleInfo.nowRank = args.battleInfo.lastRank//先给一个默认的排名（防止获取不到）

        this.totalScore = args.totalScore

        this.lastScore = args.battleInfo.nowScore

        args.battleInfo.fightResult = 1

        this.nowBattleData = args.battleInfo
        Gm.ui.create("BattleLoadView",{battleInfo:[args.battleInfo]})
        Gm.worldBossData.setBattleTime()
        var bossData = Gm.worldBossData.getNowShowData()
        if (bossData.startTime > Gm.worldBossData.getFirstBattleTime()){
             Gm.worldBossData.setFirstBattleTime()
        }

        // Gm.worldBossNet.bossRank(0)
    },
    onLoginSuc:function(){
        Gm.worldBossData.clearData()
        Gm.worldBossNet.info()

        this.world_boss_battle_time = Math.abs(Gm.config.getConst("world_boss_battle_time"))
        this.worldBoss = Gm.worldBossData.getNowShowData()
        this.timeStart()
    },
    checkRed(){
        if (this.unlockMapId == 0){
            this.unlockMapId = Gm.config.getViewByName("WorldBossView").openMapId
        }
        var isRed = false
        if (Gm.userInfo.maxMapId > this.unlockMapId && Gm.userData.getTime_m() >= this.worldBoss.startTime && this.worldBoss.closeTime > Gm.userData.getTime_m()){//进行中
            var fristTime = Gm.worldBossData.getFirstBattleTime()
            if (fristTime > this.worldBoss.startTime){//战斗持续时间
                var battleCloseTime = fristTime + checkint(this.world_boss_battle_time)
                if (Func.translateTime(battleCloseTime,true) >0){//还有剩余时间
                    isRed = true
                }else{//"结算"
                    isRed = false
                }
            }else{//"可挑战："
                isRed = true
            }
        }
        Gm.worldBossData.setRed(isRed)
    },
    onNetReward:function(args){
        var show = []
        if(args.attrInfos && args.attrInfos.length > 0 ){//属性更改
            for (let index = 0; index < args.attrInfos.length; index++) {
                const v = args.attrInfos[index];
                if(args.actionType == 1063){
                    show.push({itemType:ConstPb.itemType.TOOL,itemCount:v.count,baseId:v.attr || v.allianceAttr})
                }
            }
        }
        if (args.items && args.items.length > 0){//道具更改
            for (let index = 0; index < args.items.length; index++) {
                const v = args.items[index];
                show.push(v)
            }
        }
        if (args.actionType == 1063){
            if (Gm.worldBossData.closeAward){
                for (var i = 0; i < show.length; i++) {
                    var v = show[i]
                    var dd = Func.forBy(Gm.worldBossData.closeAward,"baseId",v.baseId)
                    if (dd){
                        dd.itemCount = dd.itemCount + v.itemCount
                    }else{
                        Gm.worldBossData.closeAward.push(v)
                    }
                }
            }else{
                Gm.worldBossData.closeAward = show    
            }
        }
    },
});

