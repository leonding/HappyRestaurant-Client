var BaseView = require("BaseView")
// BossTrialHeroView
cc.Class({
    extends: BaseView,
    properties: {
        BossTrialHeroItem:cc.Node,
        scrollView: {
            default: null,
            type: cc.ScrollView
        },
    },
    onLoad(){
        this.popupUIData = {title:7900002}
        this._super()
    },
    enableUpdateView(args){
        if (args){
            this.updateView()
        }
    },
    updateView:function(data){
        Func.destroyChildren(this.scrollView.content)

        var list = Gm.config.getZhenFaBossHeroById()
        list.sort(function(a,b){
            return a.id - b.id
        })

        this.maxQuality = Gm.bossTrialData.getMaxQuality()

        for (var i = 0; i < list.length; i++) {
            var v = list[i]
            for (var j = 0; j < v.hero.length; j++) {
                var baseId = v.hero[j].id

                var item = cc.instantiate(this.BossTrialHeroItem)
                item.active = true
                this.scrollView.content.addChild(item)
                var sp = item.getComponent("BossTrialHeroItem")
                sp.setData(baseId,v,this)
            }
        }
    },
    onNoClick:function(){
        this.onBack()
    },
});

