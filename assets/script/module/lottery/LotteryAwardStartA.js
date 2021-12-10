var BaseView = require("BaseView")
// LotteryAwardNew
cc.Class({
    extends: BaseView,
    properties: {
        startAnimation:cc.Node,
    },
    onLoad:function(){
        this._super()
        this.startAnimation.scale = cc.fixBgScale
        this.skele = this.startAnimation.getComponent(sp.Skeleton)
        var self = this
        this.skele.setCompleteListener(function() {
            self.onComplete()
        })
        this.addStartAnimation(this.openData.list.length)
    },
    register:function(){
    },
    enableUpdateView(data){
        
    },
    addStartAnimation(num){
        var name = "LotteryAwardResult"
        if(num == 1){
            Gm.audio.playEffect("music/gacha/38_gacha2021_singl",this.onLoadEffect.bind(this))
        }
        else{
            Gm.audio.playEffect("music/gacha/39_gacha2021_ten",this.onLoadEffect.bind(this))
        }
        
        if(this.openData.fieldId != 1008){
            name = "LotteryAwardNew"
            this.skele.setAnimation(0,"gacha_" + num,false)
        }
        else{
            if(num == 1){
                this.skele.setAnimation(0,"gacha_" + 11,false)
            }
            else{
                 this.skele.setAnimation(0,"gacha_" + 12,false)
            }
        }
        var self = this
        Gm.ui.create(name,null,function(){
            self.lotteryScript = Gm.ui.getScript(name)
            if(self.isComp){
                self.lotteryScript.enableUpdateView(self.openData)
                self.onBack()
            }
        })
    },
    onLoadEffect(id){
        this.m_nBeginEffectId = id
    },
    onComplete(){
        Gm.audio.stopEffect(this.m_nBeginEffectId)
        var name = "LotteryAwardResult"
        if(this.openData.fieldId != 1008){
            name = "LotteryAwardNew"
        }
        this.isComp = true
        if(this.lotteryScript){
            this.lotteryScript.enableUpdateView(this.openData)
            this.onBack()
        }
    }
});

