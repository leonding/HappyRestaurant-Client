var BaseView = require("BaseView")
// SportsRewardAction
cc.Class({
    extends: BaseView,
    properties: {
    	m_oAnimate:cc.Animation,
    },
    onLoad:function(){
        this._super()
    },
    enableUpdateView:function(data){
        if (data){
            this.data = data
            this.m_oAnimate.on('finished',function(name,sender){
                if(this.data && this.data.callback){
                    this.data.callback()
                }
                this.onBack()
            }.bind(this))
        }
    },
});

