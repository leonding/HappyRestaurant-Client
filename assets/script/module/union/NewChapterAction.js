var BaseView = require("BaseView")
// NewChapterAction
cc.Class({
    extends: BaseView,
    properties: {
    	m_oAnimate:cc.Animation,
    },
    enableUpdateView:function(data){
        if (data){
            this.data = data
        }
    },
    onOut:function(){
        this.m_oAnimate.on('finished',function(name,sender){
            if(this.data && this.data.callback){
                this.data.callback()
            }
            this.onBack()
        }.bind(this))
        this.m_oAnimate.play("NewChapter_end")
    },
});

