var BaseView = require("BaseView")

cc.Class({
    extends: BaseView,

    properties: {
        m_oScrollView:cc.ScrollView,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._super()
        this.m_rewardData = Gm.config.getConst("bingo_right_reward")
        this.initView()
       
    },

    initView(){
        var itemArr = Func.itemSplit(this.m_rewardData)
        Gm.ui.simpleScroll(this.m_oScrollView,itemArr,function(tmpData,tmpIdx){
            let item = Gm.ui.getNewItem(this.m_oScrollView.content)
            item.setData(tmpData)
            return item
        }.bind(this))
    },

    start () {

    },

    // update (dt) {},
});
