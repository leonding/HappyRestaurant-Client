var BaseView = require("BaseView")
// HelpInfoBox
cc.Class({
    extends: BaseView,
    properties: {
        titleLab:cc.Label,
    },

    onLoad(){
        this._super()
        this.m_btnType = Gm.accountData.getBtnType()
    },

    enableUpdateView:function(destData){
        
    },

    onBindClick(){
      Gm.ui.create("AccountLoginView",{operType:1,btnType:this.m_btnType,title:5792})
    },

    onSwitchClick(){
        Gm.ui.create("AccountLoginView",{operType:2,btnType:this.m_btnType,title:5791})
    },
});

