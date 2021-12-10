var BaseView = require("BaseView")
// AwardBox
cc.Class({
    extends: BaseView,
    properties: {
        scrollView: {
            default: null,
            type: cc.ScrollView
        },

    },
    onLoad(){
        this.popupUIData = {title:70001}
        this._super()
    },
    enableUpdateView(args){
        if (args){
            this.setData(args)
        }
    },
    setData:function(data){
        // Gm.audio.playEffect("music/02_popup_open")
        Func.destroyChildren(this.scrollView.content)

        for(const i in data.award){
            var tmpData = data.award[i]

            var itemSp = Gm.ui.getNewItem(this.scrollView.content,null,122)
            itemSp.setData(tmpData)
        }
    },
    onNoClick:function(){
        this.onBack()
    },
});

