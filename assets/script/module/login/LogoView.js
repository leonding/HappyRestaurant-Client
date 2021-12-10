var BaseView = require("BaseView")
// LogoView
cc.Class({
    extends: BaseView,

    properties: {
        m_oAnimate:cc.Animation,
    },
    enableUpdateView:function(data){
        if (data){
            this.m_bActionDone = false
            this.m_bLoadDone = false
            var tmpLoadMax = 0
            var tmpLoadNum = 0
            var array = Ls.get(320).split("|")
            for(var i = 0;i < array.length;i+=4){
                tmpLoadMax++
                Gm.load.loadSkeleton(array[i+1],function(sp,owner){
                    tmpLoadNum++
                    if (tmpLoadNum == tmpLoadMax){
                        owner.m_bLoadDone = true
                        owner.allDone()
                    }
                },this)
            }
            this.m_oAnimate.on('finished',function(name,sender){
                this.m_bActionDone = true
                this.allDone()
            }.bind(this))
            this.m_oAnimate.play("LogoView")
        }
    },
    allDone:function(){
        if (this.m_bActionDone && this.m_bLoadDone){
            Gm.ui.removeByName("LogoView")
            Gm.ui.create("UpdateView",1)
        }
    },
});

