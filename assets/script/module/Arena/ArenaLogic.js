var CoreLogic = require("CoreLogic")
cc.Class({
    extends: CoreLogic,
    properties: {
        
    },
    ctor:function(){

    },
    register:function(){
        this.events[Events.LOGIN_SUC]       = this.onLogicSuss.bind(this)
        this.events[MSGCode.OP_BATTLE_RECORD_VIEW_S] = this.onBattleRecordView.bind(this)
        this.events[MSGCode.OP_RANK_INFO_S] = this.onRankInfo.bind(this)
        this.events[MSGCode.OP_ARENA_EXCHANGE_S] = this.onArenaExchange.bind(this)
        this.events[MSGCode.OP_BATTLE_LOG_S] = this.onArenaBattleLog.bind(this)
        this.events[MSGCode.OP_ARENA_BATTLE_S] = this.onArenaBattle.bind(this)
        this.events[MSGCode.OP_ARENA_BUY_COUNT_S] = this.onArenaBuyCount.bind(this)
        this.events[MSGCode.OP_ARENA_REFRESH_S] = this.onArenaReFresh.bind(this)
        this.events[MSGCode.OP_ARENA_INFO_S] = this.onArenaInfo.bind(this)
    },
    onLogicSuss:function(){
        if (this.view){
            Gm.arenaNet.sendArenaInfo()
        }
    },
    onBattleRecordView:function(args){
        // console.log("回放数据",args)
        Gm.arenaData.pushBattle(Gm.arenaData.m_iDestRecordId,args)
        Gm.ui.create("BattleLoadView",Gm.arenaData.getBattle(Gm.arenaData.m_iDestRecordId))
        Gm.arenaData.m_iDestRecordId = null
    },
    onRankInfo:function(args){
        // if (args.type == ConstPb.rankType.RANK_ARENA){
        //     Gm.arenaData.setRankData(args.rankInfo)
        //     if (this.view){
        //         this.view.updateList()
        //     }
        // }else{
        // }
        // Gm.arenaData.setMainRank(args)
        // Gm.ui.create("RankView",args.type)
    },
    onArenaExchange:function(args){
        Gm.floating(Ls.get(2016))
        if (this.view){
            this.view.updateMidInfo()
        }
    },
    onArenaBattleLog:function(args){
        Gm.arenaData.setRecordData(args.logInfo)
        Gm.send(Events.ARENA_RECORD)
    },
    onArenaBattle:function(args){
        Gm.arenaData.setLocalBalance(args)
        Gm.heroData.setLineHero({type:ConstPb.lineHero.LINE_PVP,hero:Gm.arenaNet.teamHeros})
        if (this.view){
            this.view.onBack()
        }
        Gm.ui.removeByName("ArenaRecordView")
    },
    onArenaBuyCount:function(args){
        Gm.arenaData.hasBuyFightCount = Gm.arenaData.hasBuyFightCount + Gm.arenaData.m_iDestCount
        if (this.view){
            this.view.updateMidInfo()
        }
        Gm.floating(Ls.get(2017))
        Gm.arenaData.m_iDestCount = 0
    },
    onArenaReFresh:function(args){
    	Gm.arenaData.setFightData(args.arenaFightInfo)
    	if (this.view){
    		this.view.updateScroll()
    	}
    },
    onArenaInfo:function(args){
    	Gm.arenaData.setData(args)
    	if (this.view){
    		this.view.updateList()
    	}
    },
});

