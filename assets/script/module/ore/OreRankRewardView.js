//OrerankRankView
var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        contentNode:cc.Node,
        m_oListScroll:cc.ScrollView,
        itemPerFab:cc.Node,
    },
    onLoad(){
        this.popupUIData = {title:Ls.get(7500024)}
        this._super()
    },
    enableUpdateView:function(args){
        if(args){
            var data = Gm.config.getOreAwardConfig()
            this.createContentNode(data)
        }
    },
    createContentNode(data){
        Gm.ui.simpleScroll(this.m_oListScroll,data,function(itemData,tmpIdx){
            var item = cc.instantiate(this.itemPerFab)
            item.active = true
            item.getComponent("OreRankRewardItem").setUI(itemData)
            this.m_oListScroll.content.addChild(item)
            return item
        }.bind(this))
        this.m_oListScroll.scrollToTop()
    },
});


