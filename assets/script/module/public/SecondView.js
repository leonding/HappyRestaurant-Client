var BaseView = require("BaseView")

// SecondView
cc.Class({
    extends: BaseView,

    properties: {
        m_bIsSec:true,
    },
    onEnable(){
        this._super()
        Gm.ui.insertSec(this.node._name)
    },
    onBack(){
        Gm.ui.removeSec(this.node._name)
        this._super()
    },
});

