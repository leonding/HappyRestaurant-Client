var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        headNode:cc.Node,
        nameEditBox:cc.EditBox,
        priceLab:cc.Label,
        signEditBox:cc.EditBox,
    },
    onLoad:function(){
        this.popupUIData = {title:800047}
        this._super()
    },
    onEnable(){
        this._super()
    },
    enableUpdateView(args){
        if (args){
            this.updateView()
        }
    },
    updateView(){
        this.nameEditBox.placeholder = Ls.get(800049)
        this.nameEditBox.maxLength = 8
        this.priceLab.string = "x" +Gm.config.getConst("alliance_create_cost_gold")

        this.signEditBox.placeholder = Ls.get(800167)
        this.signEditBox.maxLength = Gm.config.getConst("alliance_notice_max")

        Func.newHead2(Gm.config.getConst("alliance_head"),this.headNode)
    },
    onOkBtn(){
        var sendGsg = this.getEditStr(this.nameEditBox)
        if (sendGsg !=""){
            if (!isNaN(Number(sendGsg))){
                Gm.floating(Ls.get(800063))
                return
            }
            if (Gm.userInfo.checkCurrencyNum({attrId:ConstPb.playerAttr.GOLD,num:Gm.config.getConst("alliance_create_cost_gold")})){
                Gm.box({msg:Ls.get(800065),btnNum:2},(btn)=>{
                    if (btn == 1){
                        Gm.unionNet.create(sendGsg,this.signEditBox.string.replace(/(^\s*)|(\s*$)/g, ""))
                    }
                })
            }
            
        }
    },
    getEditStr(edit){
        var msg = edit.string.replace(/(^\s*)|(\s*$)/g, "")
        if (FilterWord.isCheck(msg)){
            return
        }
        if (msg == ""){
            Gm.floating(Ls.get(800067))
            return ""
        }
        return msg
    },
    onHeadChangeBtn(){

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

