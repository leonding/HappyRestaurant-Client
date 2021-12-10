var CoreLogic = require("CoreLogic")
cc.Class({
    extends: CoreLogic,
    properties: {
        
    },
    ctor:function(){

    },
    register:function(){
        this.events[Events.LOGIN_SUC]        = this.onLoginSuc.bind(this)
        this.events[MSGCode.OP_TOWER_INFO_S] = this.onNetTowerInfo.bind(this)
        this.events[MSGCode.OP_TOWER_Battle_S] = this.onNetTowerBattle.bind(this)
        this.events[MSGCode.OP_TOWER_LAST_CHALLENGE_S] = this.onNetTowerLast.bind(this)
        this.events[MSGCode.OP_TOWER_RNK_S] = this.onNetTowerRank.bind(this)

        this.events[MSGCode.OP_TOWER_REWARD_S] = this.onNetTowerReward.bind(this)
        
        this.events[Events.ENTER_NEW_DAY] = this.onNetTowerReward.bind(this)
    },
    onNewDay(){
        cc.log("wwwwwwwwwww")
        Gm.towerData.rewardIds = []
        var nowData = Gm.towerData.getTowerByType(0)
        Gm.towerData.addRewardId(TowerFunc.getTowerBoxId(nowData.num))
        Gm.red.refreshEventState("towerBox")
    },
    onLoginSuc:function(args){
        Gm.towerData.clearData()
    },
    onNetTowerInfo:function(args){
        Gm.towerData.setData(args.towerData,args.rewardIds)
        Gm.red.refreshEventState("tower")
        Gm.red.refreshEventState("towerBox")
    },
    onNetTowerBattle:function(args){
        if(args.battleInfo.type == ConstPb.battleType.BATTLE_TOWER && args.battleInfo.fightResult ==1  ){
            if (Gm.battleNet.isHireLineHero){
                //佣兵使用次数加1
                Gm.friendData.setHireCount(ConstPb.lineHero.LINE_TOWER)
            }
            if (args.challengeId ==null){
                var conf = Gm.config.getTower(args.towerId)
                var list = []
                for (let index = 0; index < conf.reward.length; index++) {
                    const v = conf.reward[index];
                    list.push({itemType:v.type,baseId:v.id,itemCount:v.num})
                }
                args.battleInfo.award = {drop:{item:list}}

                var nowData = Gm.towerData.getTowerByType(TowerFunc.towerIdToType(args.towerId))
                nowData.layer = nowData.layer + 1
                
                var dd = Gm.towerData.enterNextTower(TowerFunc.towerIdToType(args.towerId) )
                if (dd.towerType == 0 && dd.num%10 ==0){
                    var idConf = Gm.config.getTower( TowerFunc.getTowerBoxId(dd.towerId))
                    if (idConf && idConf.scheduledReward.length > 0){
                        Gm.towerData.addRewardId(dd.num)
                        Gm.red.refreshEventState("towerBox")
                        args.battleInfo.openTowerBox = true
                    }
                }
                Gm.send(Events.TOWER_UPDATE)
            }
        }
        args.battleInfo.towerId = args.towerId
        args.battleInfo.atkHead = Gm.battleNet.towerAtkHead
        Gm.battleNet.towerAtkHead = null
        Gm.ui.create("BattleLoadView",{battleInfo:[args.battleInfo],isRecord:true})
    },
    onNetTowerLast:function(args){
        // if (args.info.length == 0){
        //     Gm.floating("暂无数据")
        //     return
        // }
        Gm.ui.create("TowerInfoView",args)
    },
    onNetTowerRank:function(args){
        if(args.rankList.length == 0){
            Gm.floating(Ls.get(5341))
            return
        }
        Gm.towerData.rankData = args
        Gm.ui.create("TowerRankView")
    },
    onNetTowerReward(args){
        Gm.towerData.removeRewardId(args.rewardId)
        Gm.red.refreshEventState("towerBox")
    }
    
});
