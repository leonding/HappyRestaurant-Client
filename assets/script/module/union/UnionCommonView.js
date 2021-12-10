var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        minEditBox:{
            default:null,
            type:cc.EditBox
        },
        okBtn:cc.Node,
        okBtnLab:cc.Label,
    },
    onLoad:function(){
        this.popupUIData = {title:800051}
        this._super()
    },
    onEnable(){
        this._super()
    },
    enableUpdateView(args){
        if (args){
            this.data = args
            this.updateView()
        }
    },
    updateView(){
        this.okBtnLab.string = Ls.get(800050)
        this.minEditBox.node.active = true
        this.minEditBox.placeholder = Ls.get(800052)
    },
    onOkBtn(){
        Gm.unionNet.join(this.data.id,this.minEditBox.string)
        this.onBack()
    },
    getEditStr(edit){
        var msg = edit.string.replace(/(^\s*)|(\s*$)/g, "")
        if (msg == ""){
            Gm.floating(Ls.get(800067))
            return ""
        }
        return msg
    },
    onEditBegin(sender){
        // cc.log("onEditBegin")
    },
    onEditChange(sender){
        //cc.log("onEditChange")
    },
    onEditDidEnded(sender){
        //cc.log("onEditDidEnded")
    },
    onEditRenturn(sender){
        //cc.log("onEditRenturn")
    },
});

