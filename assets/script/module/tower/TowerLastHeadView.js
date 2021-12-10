var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        headItem:cc.Node,
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
    },
    enableUpdateView(args){
        if (args){
            this.data = args
            this.updateView()
        }
    },
    updateView(){
        Func.destroyChildren(this.scrollView.content)

        var list = this.data.info
        var itemHeight = 0
        for (let index = 0; index < list.length; index++) {
            var itemData = list[index]
            var item = cc.instantiate(this.headItem)
            item.active = true
            this.scrollView.content.addChild(item)
            itemHeight = item.height
            Func.newHead2(itemData.info.head,item.getChildByName("head"))
            item.getChildByName("New Label").getComponent(cc.Label).string = itemData.info.name
            item.info = itemData.info
        }
        this.scrollView.content.height = 15+(itemHeight+50) + Math.ceil(list.length/4)
    },
    onItemClick(sender){
        var info = sender.currentTarget.info
        if (info.playerId != Gm.userInfo.id){
            Gm.battleNet.towerBattleInfo(this.data.towerId,info.playerId)
        }
    },
});

