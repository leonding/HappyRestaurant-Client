var BaseView = require("BaseView")

cc.Class({
    extends: BaseView,
    properties: {
        listItems:{
            default: [],
            type: require("MonthCardItem"),
        },
        jhSpr:cc.SpriteFrame,
        wjhSpr:cc.SpriteFrame
    },
    onLoad () {
        this._super()
    },
    onEnable(){
        this._super()
    },
    updateView(owner){
        owner.topGril.node.active = false
        var list = Gm.config.getEventPayReward(AtyFunc.TYPE_MONTH_CARD)
        for (let index = 0; index < list.length; index++) {
            const v = list[index];
            this.listItems[index].setData(v,this)
        }

        this.updateTime()
    },
    updateTime(){
        if (this.node.active ){
            for (let index = 0; index < this.listItems.length; index++) {
                const v = this.listItems[index];
                v.updateTime()
            }
        }
    },
    onItemClick:function(sender,value){
        var tmpValue = checkint(value)
        if (tmpValue == 0){
            Gm.ui.create("ItemTipsView",{data:{baseId:1014},itemType:ConstPb.itemType.TOOL,pos:sender.touch._point})
        }else if(tmpValue == 1){
            // Gm.ui.create("ItemTipsView",{data:{baseId:1002},itemType:ConstPb.itemType.TOOL,pos:sender.touch._point})
        }else if(tmpValue == 2){
            Gm.ui.create("ItemTipsView",{data:{baseId:1001},itemType:ConstPb.itemType.TOOL,pos:sender.touch._point})
        }
    },
});

