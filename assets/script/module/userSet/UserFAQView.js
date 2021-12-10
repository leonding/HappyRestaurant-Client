var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        
    },
    onLoad:function(){
        this.popupUIData = {title:2100}
        this._super()
    },
    enableUpdateView(args){
        if (args){
            
        }
    },
    onFaqBtn(){
        cc.log("onFaqBtn")
        Gm.ui.create("UserFAQView")
    },
    onBtn(sender,value){
        cc.log(sender)
        value = checkint(value)
        var str = sender.target.getChildByName("Background").getChildByName("Label").getComponent(cc.Label).string
        switch(value){
            case 1://继承码相关
                // Gm.ui.create("UserHelpView")
                Gm.ui.create("UserFeedbackView",{groupId:6,title:str})
                break
            case 2://付费
                break
            case 3://BUG提交
                Gm.ui.create("UserFeedbackView",{groupId:2,title:str})
                break
            case 4://提问
                break
            case 5://通报
                break
            case 6://意见建议
                break
        }
    },
});

