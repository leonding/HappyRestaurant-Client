var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
   
    },

    register(){
    },

    onLoad(){
        this._super()
    },
    enableUpdateView(args){
        if (args){
            this.onUserInfoUpdate()
            this.updateView()
        }
    },

    onUserInfoUpdate(){

    },
    updateView(){

        
    },
    onOkBtn(){
        Gm.activityNet.anniversary(AtyFunc.ANNIVER_SKIN_TYPE)
    },

});

