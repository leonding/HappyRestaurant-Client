var BaseView = require("BaseView")
// ReceiveAward
cc.Class({
    extends: BaseView,
    properties: {
        scrollView: {
            default: null,
            type: cc.ScrollView
        },
    },
    setData:function(data){
        Gm.audio.playEffect("music/02_popup_open")
        Func.destroyChildren(this.scrollView.content)
        for(const i in data.award){
            var tmpData = data.award[i]

            var itemSp = Gm.ui.getNewItem(this.scrollView.content)
            itemSp.updateItem(tmpData)
        }
    },
    onNoClick:function(){
        this.onBack()
    },
});

