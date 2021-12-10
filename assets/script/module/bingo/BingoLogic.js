var CoreLogic = require("CoreLogic")
const SUCCESS = 1
cc.Class({
    extends: CoreLogic,
    properties: {
        
    },
    ctor:function(){
 
    },
    register:function(){
        this.events[MSGCode.OP_BINGO_FLIP_S]  = this.onNetOpenCardRet.bind(this)
        this.events[MSGCode.OP_BINGO_SITE_REWARD_S]  = this.onNetBingoSiteRewardRet.bind(this)
        this.events[MSGCode.OP_RECEIVE_BINGO_REWARD_S]  = this.onNetReceiveRewardRet.bind(this)
        this.events[MSGCode.OP_BUY_BINGO_ITEM_S]  = this.onNetBuyBingoItemRet.bind(this)
        this.events[MSGCode.OP_PLAYER_LOGIN_S]  = this.onNetLogin.bind(this)
        this.events[Events.LOGIN_NEW_DAY]  = this.onLoginNewDay.bind(this)
    },

    onLoginNewDay(args){
        Gm.bingoData.setEnterNewDay(args)
    },

    onNetBuyBingoItemRet(args){
        var count = Gm.bingoData.getBuyBingoCount()
        Gm.bingoData.setBuyBingoCount(count + args.count)
        this.view.addBingoItemCount(args.count)
        this.view.updateBingoTicketCount()
        args.baseId = ConstPb.propsToolType.TOOL_BINGO_TICKET
        args.itemType = ConstPb.propsToolType.TOOL
        this.view.receiveOpenSuccessReward(args)
    },

    onNetOpenCardRet(args){
        this.view.onSetHead(args)
        this.view.updateBingoTicketCount()
        var len = args.heroQualityId.length
        if(len == 2 && args.heroQualityId[1] == args.heroQualityId[0]){
            for(let key in args.heroQualityId){
                let heroId = args.heroQualityId[key]
                let cardIdx = this.view.m_openedCard[key].idx
                Gm.bingoData.pushRightOpenCardIndex(cardIdx,heroId)
            }
        }

    },
    onNetReceiveRewardRet(){
        this.view.updateRewardCount()
        Gm.bingoData.setCurrentSelectReward(undefined)
        this.view.resetCard()
    },

    onNetLogin(args){
        Gm.bingoData.clearData()
    },

    onNetBingoSiteRewardRet(args){
        //设置当前轮次
        Gm.bingoData.setCurrentTurn(args.turn)
        //保存玩家当前选择奖励的次数
        Gm.bingoData.setSelectCount(args.selectReward)
        Gm.bingoData.setRightOpenCardIndex(args.bingoSite)
        Gm.bingoData.setRewardIndex()
        Gm.bingoData.setCurrentSelectReward(args.currTurnReward)
        Gm.bingoData.setBuyBingoCount(args.hasBuyCount)
        
        //
    },
    //进入新一天    
    onNewDay(){
        Gm.red.refreshEventState("bingo")
    },
});
