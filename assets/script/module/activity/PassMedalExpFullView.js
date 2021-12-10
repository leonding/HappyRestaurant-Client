var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        contentRich:cc.RichText,
        numRich:cc.RichText
    },
    onLoad(){
        this.popupUIData = {title:8009}
        this._super()
        // this.popupUI.setHeight(765)
    },
    enableUpdateView(){
        var allList = Gm.config.getEventPayReward(AtyFunc.TYPE_TXZ,Gm.activityData.data.passMeLv)
        this.maxExp = allList[allList.length-1].receiveCondition[0].num

        var overflowExpStr = cc.js.formatStr(Ls.get(5801),Gm.config.getConst("medal_sum_exp_max"))
        this.contentRich.string = overflowExpStr
        this.numRich.string = cc.js.formatStr(Ls.get(5802),Gm.userInfo.passMedal - this.maxExp)
    },
    onClick(){
        
        this.onBack()
    },
});

