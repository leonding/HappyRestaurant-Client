var BaseView = require("SecondView")

// ArenaMain
cc.Class({
    extends: BaseView,

    properties: {
        m_oCellNode:cc.Node,
        m_oListScroll:cc.ScrollView,
    },
    enableUpdateView:function(args){
    	if (args){
            // console.log("args====:",args)
            Func.destroyChildren(this.m_oListScroll.content)
            for(var i = 0;i < 6;i++){
                var item = cc.instantiate(this.m_oCellNode)
                item.active = true
                this.m_oListScroll.content.addChild(item,i,i+"")
            }
        }
    },
    onCellClick:function(sender){
        Gm.ui.create("ArenaView",true)
    },
    onCloseClick:function(){
    	this.onBack()
    },
});

