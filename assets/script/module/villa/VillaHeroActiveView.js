cc.Class({
    extends: require("BaseView"),

    properties: {
        VillaHeroActiveItem:cc.Node,
        scroll:cc.ScrollView,
    },
    onLoad(){
        this._super()
    },
    enableUpdateView:function(args){
        cc.log(args)
        if (args){
            this.updateView()
        }
    },
    updateView(){
        var confList = Gm.config.getHeroCollect()

        var hasList = Gm.villaData.getAllQuality()
        for (var i = 0; i < confList.length; i++) {
            var v = confList[i]
            var item = cc.instantiate(this.VillaHeroActiveItem)
            item.active = true
            this.scroll.content.addChild(item)

            var hasNum = hasList[v.quality] || 0
            var str = ""
            for (var j = 0; j < v.Property.length; j++) {
                var baseName = EquipFunc.getBaseIdToName(v.Property[j].id)
                var baseNum = EquipFunc.getBaseIdToNum(v.Property[j].id,v.Property[j].num)
                var color = "ffffff"
                if (hasNum >= v.num){
                    color = "00ff00"
                }
                baseNum = cc.js.formatStr("<color=#%s>+%s</color>",color,baseNum)
                str = str + cc.js.formatStr("<color=#ffffff>%s</color>%s ",baseName,baseNum)
            }
            
            var lab = item.getChildByName("rich").getComponent(cc.RichText)

            var newStr = cc.js.formatStr(Ls.get(5834),Gm.config.getHeroType(v.quality).childTypeName,v.num,str)
            lab.string = cc.js.formatStr("<outline color='#000000' width=3>%s</outline>",newStr)

            var heroConf = Gm.config.getHeroByQuality(v.quality)
            var itemNodes = item.getChildByName("itemNodes")
            for (var j = 1; j <= v.num; j++) {
                var item = Gm.ui.getNewItem(itemNodes)
                var iconStr = ""
                if (j > hasNum){
                    item.setDefaultBottomFrame("share_img_huise","share_img_zhez")
                    iconStr = "nshj_tx_huise"
                }else{
                    iconStr = "nshj_tx_" + heroConf.bottom_frame
                    item.setDefaultBottomFrame(heroConf.bottom_frame,heroConf.bottom_floor )
                }
                item.setTips(false)
                item.setData()
                item.data = {qualityId:1}
                item.itemType = ConstPb.itemType.ROLE
                item.loadIcon("img/nshj/" +iconStr)

                // var nn = new cc.Node()
                // var sprite = nn.addComponent(cc.Sprite)
                // itemNodes.addChild(nn)
                // Gm.load.loadSpriteFrame("img/nshj/hj_sj_pz_" +v,function(sp,icon){
                //     icon.spriteFrame = sp
                // },sprite)
            }
        }
    },
});
