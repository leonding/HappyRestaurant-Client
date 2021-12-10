var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        towerRankItem:require("TowerRankItem"),
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
    },
    onLoad:function(){
        this._super()
    },
    onEnable(){
        this._super()
        this.updateView()
    },
    enableUpdateView(args){
        if (args){
            this.conf = args
            this.updateView()
        }
    },
    updateView(){
        Func.destroyChildren(this.scrollView.content)

        var list = Gm.towerData.rankData.rankList
        var itemHeight = 0
        for (let index = 0; index < list.length; index++) {
            var itemData = list[index]
            itemData.rank = index +1
            var item = cc.instantiate(this.towerRankItem.node)
            item.active = true
            this.scrollView.content.addChild(item)
            itemHeight = item.height
            var itemSp = item.getComponent("TowerRankItem")
            itemSp.setData(itemData,this)
        }
        this.scrollView.content.height = list.length * itemHeight
        var data = {info:{}}
        data.info.playerId = Gm.userInfo.id
        data.info.level = Gm.userInfo.level
        data.info.name  = Gm.userInfo.name
        data.info.head = Gm.userInfo.head
        if(Gm.unionData.isUnion()){
            // data.info.allianceName = Gm.unionData.info.name
            // data.info.allianceId = Gm.unionData.info.allianceId
        }

        data.towerId = Gm.towerData.getId()
        data.rank = Gm.towerData.rankData.ownerRank || 9999
        data.time = Gm.towerData.data.towerTime

        this.towerRankItem.setData(data,this)
    },
});

