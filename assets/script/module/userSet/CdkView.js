var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        editbox:{
            default:null,
            type:cc.EditBox
        },
    },
    onLoad:function(){
        this.popupUIData = {title:1726}
        this._super()
    },
   
    enableUpdateView:function(){
        this.editbox.maxLength = Gm.config.getConst("cdkLimitLength")
    },
    onOkBtn(){
       var newName = this.editbox.string.replace(/(^\s*)|(\s*$)/g, "")
        if( /[^0-9a-zA-Z_]/g.test(newName)) {
            Gm.floating(Ls.get(5343))
            return
        } 
        if (newName == ""){
            this.editbox.string = ""
            return
        }
        Gm.playerNet.cdk(newName)
    },
   

});

