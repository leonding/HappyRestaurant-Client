cc.Class({
    extends: require("BaseView"),

    properties: {
        FeelAddtionItem:cc.Prefab,
        scroll:cc.ScrollView,
        tipsNode:cc.Node,
    },
    onLoad(){
        this._super()
    },
    enableUpdateView:function(args){
        if (args){
            this.updateView()
        }
    },
    updateView(){
        this.vHeroData = Gm.villaData.getVillaHeroData(this.openData.baseId)
        this.feelConf = Gm.config.getHeroFeelByLv(this.openData.baseId,this.vHeroData.lv)

        var list = this.feelConf.Property
        this.tipsNode.active = list.length == 0
        for (var i = 0; i < list.length; i++) {
            cc.log(i)
            var item = cc.instantiate(this.FeelAddtionItem)
            item.active = true
            this.scroll.content.addChild(item)

            var sp = item.getComponent("FeelAddtionItem")
            sp.setData([list[i],list[i+1]],this)
            i++
        }
        
    },
});
