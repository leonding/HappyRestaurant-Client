var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
    },
    onLoad(){
        this.popupUIData = {title:8009}
        this._super()
        this.popupUI.setWidth(this.tipsNode.width)
    },
    cancelClick(){
        Gm.ui.removeByName("AgeAlertView")
    },
    okClick(){
        Gm.ui.removeByName("AgeAlertView")
    }
});

