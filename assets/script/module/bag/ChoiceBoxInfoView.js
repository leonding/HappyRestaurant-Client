var BaseView = require("BaseView")
const max_num = 100
// MessageBox
cc.Class({
    extends: BaseView,
    properties: {
        itemIcon:cc.Node,
        boxSctrollView:cc.ScrollView,
        itemInfo:cc.Label,
    },
    onLoad:function(){
        this._super()
        this.itemBase = Gm.ui.getNewItem(this.itemIcon)
    },
    onEnable:function(){
        this._super()
    },

    enableUpdateView:function(args){
        if (args){
            this.itemData = args
            this.updateNode()
        }
    },
    updateNode:function(){
        this.conf = this.itemBase.updateItem(this.itemData)
        this.popupUI.setTitle(this.conf.name)
        this.itemInfo.string = this.conf.description
        if(this.conf.type  == ConstPb.propsType.CHOICE_BOX){
            this.updateBoxNode()
        }
    },

    updateBoxNode(){
        this.m_boxItems = []
        this.m_currentSelectIndex = -1
        var tmpAry = Func.itemSplit(this.conf.containItem)
        for (var i = 0; i < tmpAry.length; i++) {
            var v = tmpAry[i]
            var sp = Gm.ui.getNewItem( this.boxSctrollView.content)
            sp.setData(v)
            sp.setTips(false)
        }
    },

});

