var BaseView = require("PageView")

// VillaRoomView
cc.Class({
    extends: BaseView,

    properties: {
        bgNode:cc.Node,
        VillaRoomItem:cc.Node,
    },
    onLoad () {
        this._super()
    },
    enableUpdateView:function(args){
        if (args){
            this.updateView()
        }
    },
    register:function(){
        // this.events[MSGCode.OP_VILLA_ACT_S] = this.onNetVillaAct.bind(this)
    },
    updateView(){
        var list = Gm.config.getHomesteadConfig()
        // list.push({img:"home_img_km",click:1,x:-88,y:150})
        // list.push({img:"home_img_ns",click:2,x:-67.558,y:-143.833})
        // list.push({img:"home_img_bx",click:3,x:243.164,y:176.294})

        for (var i = 0; i < list.length; i++) {
            var v = list[i]
            var item = cc.instantiate(this.VillaRoomItem)
            item.active = true
            this.bgNode.addChild(item)

            var sp = item.getComponent("VillaRoomItem")
            sp.setData(v,this)
        }
    },
});

