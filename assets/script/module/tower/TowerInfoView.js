var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        TowerInfoItem:cc.Node,
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        itemNodes:cc.Node,
    },
    onLoad:function(){
        this.popupUIData = {title:1736}
        this._super()
    },
    onEnable(){
        this._super()
    },
    enableUpdateView(args){
        if (args){
            this.data = args
            this.updateView()
        }
    },
    updateView(){
        Func.destroyChildren(this.itemNodes)

        Func.destroyChildren(this.scrollView.content)
        var list = this.data.info
        for (let index = 0; index < list.length; index++) {
            var itemData = list[index]
            var item = cc.instantiate(this.TowerInfoItem)
            item.active = true
            this.scrollView.content.addChild(item)
            item.getComponent("TowerInfoItem").setData(itemData,this)
        }

        this.conf = Gm.config.getTower(this.data.towerId)
        for (let index = 0; index < this.conf.reward.length; index++) {
            var itemData = this.conf.reward[index]
            var item = Gm.ui.getNewItem(this.itemNodes)
            item.node.scale = 0.85
            item.setData(itemData)
        }
    },
    // onOkBtn(){
    //     if (this.isNextId()){
    //         TowerFunc.showFightTeam(this.conf.id)
    //         // Gm.ui.create("FightTeamView",{type:ConstPb.lineHero.LINE_TOWER,towerId:this.conf.id})
    //     }
    //     this.onBack()
    // },
    // isNextId(){
    //     return this.conf.id == Gm.towerData.getId(this.conf.group)+1
    // }
    
});

