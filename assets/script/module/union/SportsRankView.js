var BaseView = require("BaseView")
var TYPE_ZH = 0
var TYPE_RANA = 0 //竞技排行榜
var TYPE_REWARD = 1 //奖励
cc.Class({
    extends: BaseView,
    properties: {
        bottomListNode:cc.Node,
        rankItem: cc.Node,
        rewardItem:{
            default:null,
            type:cc.Prefab,
        },
        selfRankItem:require("SportsRankItem"),
        rankScrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        rewardScrollView:{
            default:null,
            type:cc.ScrollView
        },
        selectType:0,
        m_tFrame:{
            default: [],
            type: cc.SpriteFrame,
        },
        desLabel:cc.Label,
    },
    onLoad () {
        this._super()
        this.selectType = -1
        this.listBtns = []
        for (let index = 0; index < this.bottomListNode.children.length; index++) {
            const v = this.bottomListNode.children[index];
            this.listBtns.push(v)
        }
        this.desLabel.string = cc.js.formatStr(Ls.get(5449),Gm.config.getConst("allianceact_rank_min_score"))
    },
    onEnable(){
        this._super()
    },
    updateView:function(){
        this.updateList()
    },
    enableUpdateView:function(args){
        if (args){
            this.select(this.m_iDestPage || TYPE_ZH)
        }
    },
    register:function(){
        this.events[Events.SPORTS_RANK_INFO] = this.onRankInfo.bind(this)
    },
    onRankInfo(args){
        this.updateList()
    },
    select:function(type){
        if (this.selectType != type){
            this.selectType = type
            Gm.audio.playEffect("music/06_page_tap")
            this.sendBi()
            for (const key in this.listBtns) {
                const v = this.listBtns[key];
                var isSelect = key == type
                v.getChildByName("selectSpr").active = isSelect
            }
            Gm.unionNet.sportsRankInfo()
        }
    },
    updateList:function(){
        if(this.selectType == TYPE_RANA){
            this.updateRankList()
        }
        else if(this.selectType == TYPE_REWARD){
            this.updateRewardList()
        }
    },
    updateRankList()
    {
        
        this.rankScrollView.node.active = true
        this.rewardScrollView.node.active = false
        var rankData = Gm.unionData.getSportsRankData()
        if(!rankData || !rankData.allianceGVERankInfo || !rankData.myself){
            return
        }
        rankData.myself.rank = 0
        Func.destroyChildren(this.rankScrollView.content)
        for (let index = 0; index < rankData.allianceGVERankInfo.length; index++) {
            const itemData = rankData.allianceGVERankInfo[index];
            var item = cc.instantiate(this.rankItem)
            item.active = true
            this.rankScrollView.content.addChild(item)
            var itemSp = item.getComponent("SportsRankItem")
            var addNum = 1
            itemSp.setData(itemData,index+addNum,this)
            if(itemData.playerId == rankData.myself.playerId){
                rankData.myself.rank = index+addNum
            }
        }

        var dd = {}

        dd.headId = rankData.myself.headId
        dd.name = rankData.myself.name
        dd.level = Gm.userInfo.level
        dd.score = rankData.myself.score
        dd.alliancename = rankData.myself.alliancename
        
        this.selfRankItem.setData(dd,rankData.myself.rank,this)
        this.selfRankItem.node.active = true
    },
    updateRewardList()
    {
        this.rankScrollView.node.active = false
        this.rewardScrollView.node.active = true
        var rewardData = Gm.config.getAllianceRankRewardConfig()
        Func.destroyChildren(this.rewardScrollView.content)
        for (let index = 0; index < rewardData.length; index++) {
            const itemData = rewardData[index];
            var item = cc.instantiate(this.rewardItem)
            item.active = true
            this.rewardScrollView.content.addChild(item)
            var tmpSpt = item.getComponent("ArenaAwardCell")
            tmpSpt.setOwner(this,itemData,index+1)
            tmpSpt.updateList(1)
        }
    },
    onRuleBtn:function(){
        console.log("onRuleBtn")
    },
    onTopBtnClick:function(sender,value){
        this.select(checkint(value))
    },
    getFrame:function(destValue){
        return this.m_tFrame[destValue]
    },
});

