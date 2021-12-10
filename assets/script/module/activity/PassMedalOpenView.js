var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        nodes:cc.Node,
    },
    enableUpdateView(){
        this._super()
        this.updateView()
    },
    updateView(){
        var rewards = Func.itemSplit(Gm.config.getConst("medal_open_notice_reward"))
        for (let index = 0; index < rewards.length; index++) {
            const v = rewards[index];
            var item = Gm.ui.getNewItem(this.nodes)
            item.setData(v)
        }
    },
    onClick(){
        Gm.ui.jump(200003)
        this.onBack()
    },
});

