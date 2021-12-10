//OreUnionRoomList
var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        OreUnionRoomListItem:cc.Node,
        contentNode:cc.Node,
    },
    onLoad(){
        this.popupUIData = {title:Ls.get(7500009),bgSpritePath:"img/shuijing/crystal_pattern_1"}
        this._super()
    },
    register:function(){
         //this.events[Events.ORE_BATTLELOG_INFO] = this.onCreateContentNode.bind(this)
    },
    enableUpdateView:function(args){
        if(args){
            this.data = args
            this.setUI()
        }
    },
    setUI(){
        this.createCell()
    },
    createCell(){
        this.itemJs = []
        for(var i=0;i<this.data.length;i++){
            var item = cc.instantiate(this.OreUnionRoomListItem)
            item.active = true
            var itemJs = item.getComponent("OreUnionRoomListItem")
            itemJs.setUI(this.data[i])
            this.itemJs.push(itemJs)
            this.contentNode.addChild(item)
        }
    }
});


