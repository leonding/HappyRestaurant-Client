var BaseView = require("BaseView")
var TYPE_ZH = 0
var TYPE_ARENA = 1
var TYPE_TOWER = 2
cc.Class({
    extends: BaseView,
    properties: {
        bottomListNode:cc.Node,
        rankItem: cc.Node,
        selfRankItem:require("RankItem"),
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        selectType:0,
    },
    onLoad () {
        this._super()
        this.selectType = -1
        this.listBtns = []
        for (let index = 0; index < this.bottomListNode.children.length; index++) {
            const v = this.bottomListNode.children[index];
            this.listBtns.push(v)
        }
    },
    onEnable(){
        this._super()
    },
    updateView:function(){
        this.updateList()
    },
    enableUpdateView:function(args){
        if (args){
            this.setStarSelect(this.m_iDestPage || TYPE_ZH)
        }
    },
    register:function(){
        this.events[MSGCode.OP_RANK_INFO_S] = this.onRankInfo.bind(this)
    },
    onRankInfo(args){
        Gm.arenaData.setMainRank(args)
        this.updateList()
    },
    select:function(type){
        if(type == TYPE_ARENA && Func.isUnlock("ArenaView",true) == false){
            return
       }
        if (this.selectType != type){
            this.selectType = type
            Gm.audio.playEffect("music/06_page_tap")
            this.sendBi()
            for (const key in this.listBtns) {
                const v = this.listBtns[key];
                var isSelect = key == type
                v.getChildByName("selectSpr").active = isSelect
            }

            var serverType = this.pageToServerType()
            var rankData = Gm.arenaData.getMainRankByType(serverType)
            if (rankData && rankData.refreshTime > Gm.userData.getTime_m()){
                this.updateList()
            }else{
                Gm.arenaNet.sendRankInfo(serverType)
            }
        }
    },
    pageToServerType(){
        var toType = [2,1,5]//界面顺序对应pb类型
        var serverType = toType[this.selectType]
        return serverType
    },
    updateList:function(){
        var serverType = this.pageToServerType()
        var rankData = Gm.arenaData.getMainRankByType(serverType)
        Func.destroyChildren(this.scrollView.content)
        if (rankData){
            Gm.ui.simpleScroll(this.scrollView,rankData.rankInfo,function(itemData,tmpIdx){
                itemData.rankInfo.towerId = itemData.towerId
                var item = cc.instantiate(this.rankItem)
                item.active = true
                this.scrollView.content.addChild(item)
                var itemSp = item.getComponent("RankItem")
                // if (rankData.ownInfo.rank != 0 && index + 1 >= rankData.ownInfo.rank && itemData.rankInfo.playerId != Gm.userInfo.id ){
                //     addNum = 2
                // }
                itemSp.setData(itemData.rankInfo,tmpIdx,this,rankData.type)
                return item
            }.bind(this))

            var dd = {}

            dd.head = Gm.userInfo.head
            dd.name = Gm.userInfo.name
            dd.level = Gm.userInfo.level
            dd.fightValue = Gm.heroData.getFightAll()
            dd.arenaPoint = rankData.ownInfo.point
            dd.towerId = rankData.ownInfo.towerId
            if (Gm.unionData.isUnion() && Gm.unionData.info ){
                dd.allianceName = Gm.unionData.info.name
            }
            
            this.selfRankItem.setData(dd,rankData.ownInfo.rank,this,rankData.type)
            this.selfRankItem.node.active = true
        }
    },
    onRuleBtn:function(){
        console.log("onRuleBtn")
    },
    onTopBtnClick:function(sender,value){
        this.select(checkint(value))
    },
    
});

