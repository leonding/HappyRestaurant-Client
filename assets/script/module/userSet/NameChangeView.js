var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        // tipsLab:cc.Label,
        m_oLimitLab:cc.RichText,
        m_oOkBtn:cc.Node,
        m_oLostLab:cc.Label,
        editbox:{
            default:null,
            type:cc.EditBox
        },
    },
    onLoad:function(){
        this._super()
    },
    onEnable(){
       this._super()
       this.onUserInfoUpdate()
    },
    enableUpdateView:function(){
        // Gm.audio.playEffect("music/02_popup_open")
    },
    onUserInfoUpdate(){
        var cons = this.getNeedGolden()
        var lab = this.m_oOkBtn.getChildByName("label")
        var nod = this.m_oOkBtn.getChildByName("node")
        if (cons > 0){
            lab.active = false
            nod.active = true
            this.m_oLimitLab.string = cc.js.formatStr(Ls.get(5478),cons,Func.transNumStr(Gm.userInfo.getGolden()))
            this.m_oLostLab.string = "x"+cons
        }else{
            lab.active = true
            nod.active = false
            this.m_oLimitLab.string = Ls.get(5477)
        }
        // this.tipsLab.string = cc.js.formatStr(Ls.get(1000001),this.getNeedGolden())
    },
    getNeedGolden(){
        var cons = 0 
        if (Gm.userInfo.isChangeName >0){
            cons = Gm.config.getConst("rename_consume")
        }
        return cons
    },
    onOkBtn(){
       var newName = this.editbox.string.replace(/(^\s*)|(\s*$)/g, "")
       if (FilterWord.isCheck(newName)){
            return
        }
        var defaultCount = Gm.config.getConst("enter_name_max_word")
        if (newName.length > defaultCount){
            return
        }
        if (newName == ""){
            this.editbox.string = ""
            return
        }
        if(newName == Gm.userInfo.name){
            return
        }

        if (!Gm.userInfo.checkCurrencyNum({attrId:ConstPb.playerAttr.GOLD,num:this.getNeedGolden()})){
            return
        }
        Gm.playerNet.changeName(newName)

    },
   

});

