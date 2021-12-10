var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        itemNodes: cc.Node,
        descLab:cc.Label
    },
    onLoad(){
        this.popupUIData = {title:5807}
        this._super()
    },
    enableUpdateView(){
        this._super()
        this.updateView()
    },
    updateView(){
        this.descLab.string = cc.js.formatStr(Ls.get(5804),Gm.activityData.data.passMeLv)
        Func.destroyChildren(this.itemNodes)
        var rewards = Func.itemSplit(Gm.config.getConst("medal_reward_lv_" + (Gm.activityData.data.passMeLv)))
        for (let index = 0; index < rewards.length; index++) {
            const v = rewards[index];
            var item = Gm.ui.getNewItem(this.itemNodes,null,105)
            item.setData(v)
        }
    },
    onClick(){
        this.onBack()
    },
});

