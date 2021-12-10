var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        signEditBox:cc.EditBox,
        lab:cc.Label,
    },
    onLoad:function(){
        this._super()
    },
    onEnable(){
        if (this.openData.isEmail){
            this.popupUI.setData( {title:Ls.get(800168)})
        }else{
            this.popupUI.setData( {title:Ls.get(800167)})
        }
        this._super()
    },
    enableUpdateView(args){
        if (args){
            this.updateView()
        }
    },
    updateView(){
        this.signEditBox.maxLength = Gm.config.getConst("alliance_notice_max")
        if (this.openData.isEmail){
            this.signEditBox.placeholder = Ls.get(800062)
        }else{
            this.signEditBox.placeholder = Ls.get(800059)
        }
        this.onEditChange()
    },
    onOkBtn(){
        var sendGsg = this.signEditBox.string.replace(/(^\s*)|(\s*$)/g, "")
        sendGsg = FilterWord.runFilterWord(sendGsg)
        if (sendGsg !=""){
            if(this.openData.isEmail){
                var dd = {}
                dd.manager = ConstPb.allianceRoleManager.EMAIL_SET
                dd.email = sendGsg
                Gm.unionNet.mgrEdit(dd)
            }else{
                var dd = {}
                dd.manager = ConstPb.allianceRoleManager.NOTICE_SET
                dd.notice = sendGsg
                Gm.unionNet.mgrEdit(dd)
            }

            this.onBack()
        }
    },
    onEditChange(){
        this.lab.string = cc.js.formatStr(Ls.get(800169),Gm.config.getConst("alliance_notice_max")-this.signEditBox.string.length)
    },
    onEditBegin(sender){
        // cc.log("onEditBegin")
    },
   
    onEditDidEnded(sender){
        //cc.log("onEditDidEnded")
    },
    onEditRenturn(sender){
        //cc.log("onEditRenturn")
    },
});

