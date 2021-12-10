var BaseView = require("BaseView")

cc.Class({
    extends: BaseView,
    properties: {
        scrollItem:cc.Node,
        scrollView: cc.ScrollView,
    },
    enableUpdateView(args){
        if (args){
            for (let index = 0; index < args.length; index++) {
                const v = args[index];
                var item = this.getPoolItem()
                item.active = true
                this.scrollView.content.addChild(item)

                var listStr = []

                listStr.push(EquipFunc.getBaseIdToName(v.attrId))
                listStr.push(EquipFunc.getBaseIdToNum(v.attrId,v.lastValue))
                listStr.push(EquipFunc.getBaseIdToNum(v.attrId,v.nowValue))
                for (var i = 0; i < listStr.length; i++) {
                    item.getChildByName("lab" + (i+1)).getComponent(cc.Label).string = listStr[i]
                }
            }
        }
    },
    getBasePoolItem(){
        return this.scrollItem
    },
    
});

