var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        editbox:{
            default:null,
            type:cc.EditBox
        },
    },
    enableUpdateView:function(){
        // Gm.audio.playEffect("music/02_popup_open")

        this.editbox.maxLength = Gm.config.getConst("autograph_max_lenth")
    },
    onOkBtn(){
       var newName = this.editbox.string.replace(/(^\s*)|(\s*$)/g, "")
        if (newName == ""){
            this.editbox.string = ""
            return
        }
        Gm.playerNet.changeSign(newName)
    },
});

