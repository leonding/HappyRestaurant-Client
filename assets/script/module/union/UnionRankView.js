var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        UnionRankItem:cc.Node,
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
    updateView(){
        Func.destroyChildren(this.scrollView.content)
        var list = Gm.unionData.rankList
        for (let index = 0; index < list.length; index++) {
            const itemData = list[index];
            var item = cc.instantiate(this.UnionRankItem)
            item.active = true
            this.scrollView.content.addChild(item)
            var itemSp = item.getComponent("UnionRankItem")
            itemSp.updateData(itemData,this,index+1)
        }
        this.scrollView.scrollToTop()
    },
});

