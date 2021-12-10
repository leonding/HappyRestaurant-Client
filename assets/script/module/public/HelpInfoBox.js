var BaseView = require("BaseView")
// HelpInfoBox
cc.Class({
    extends: BaseView,
    properties: {
        m_oHelpList: cc.ScrollView,
        m_oShowText: cc.RichText,
    },
    enableUpdateView:function(destData){
        if (destData){
            var tmpStr = destData.content
            this.popupUI.setTitle(destData.title)
            this.m_oShowText.string = tmpStr
            this.m_oHelpList.content.height = this.m_oShowText._labelHeight
        }
    },
    onNoClick:function(){
        this.onBack()
    },
});

