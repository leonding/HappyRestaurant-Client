var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        itemNode:cc.Node,
        nameLab:cc.Label,
        descLab:cc.Label,
        HeroAccessItem:cc.Node,
        scrollView:cc.ScrollView,
    },
    onLoad(){
        this.popupUIData = {title:400038}
        this.itemBase = Gm.ui.getNewItem(this.itemNode)
        this._super()
    },
    enableUpdateView(args){
        if (args){
            this.updateView()
        }
    },
    updateView(){
        cc.log(this.openData)
        var list
        if (this.openData.itemType == ConstPb.itemType.HERO_CARD || this.openData.itemType == ConstPb.itemType.ROLE || this.openData.itemType == ConstPb.itemType.HERO_SKIN){
            var conf = Gm.config.getHero(this.openData.baseId)
            this.nameLab.string = conf.name
            this.descLab.string = conf.info
            list = conf.viewId
            this.itemBase.updateHero(this.openData)
        }else{
            var conf = Gm.config.getItem(this.openData.baseId)
            this.nameLab.string = conf.name
            this.descLab.string = conf.description
            list = conf.viewId
            this.itemBase.updateItem(this.openData)
            this.itemBase.setLabStr("x" + Func.transNumStr(Gm.userInfo.getCurrencyNum(this.openData.baseId)))
        }
        Func.destroyChildren(this.scrollView.content)
        for (let index = 0; index < list.length; index++) {
            var v = list[index]
            var item = cc.instantiate(this.HeroAccessItem)
            item.active = true
            var itemSp = item.getComponent("HeroAccessItem")
            if (v.id){
                itemSp.setData(v.id,this)    
            }
            this.scrollView.content.addChild(item)
        }
    },
});

