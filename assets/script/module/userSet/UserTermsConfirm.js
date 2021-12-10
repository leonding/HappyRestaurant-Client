var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {       
        m_oOkBtn:cc.Button,
        m_oLabel1:cc.Label,
        m_oLabel2:cc.Label,
    },
    ctor:function(){
        this.m_nAgree = 0
    },
    onLoad:function(){
        this.popupUIData = {title:"1000072",isClose:false}
        this._super()
        this.popupUI.setHeight(770)

        this.m_oLabel1.string = "      "+Ls.get(1000073)
        this.m_oLabel2.string = "      "+Ls.get(1000074)
    },
    onEnable(){
       this._super()
    },
    register:function(){
       
    },
    // enable
    updateView(){
     
    },
    enableUpdateView(args){
        // this.m_oOkBtn.interactable = false
        this._setOkBtnEnable(false)
    },
    useTermsClick(sender, value){
        var data = Gm.config.getTerms()
        Gm.ui.create("UserTermsView",{list:data,id:value})
    },
    privateTermsClick(sender, value){
        var data = Gm.config.getTerms()
        Gm.ui.create("UserTermsView",{list:data,id:value})
    },
    onAgreeClick(sender,value){
        this.m_nAgree = Number(sender.isChecked)
        // this.m_oOkBtn.interactable = sender.isChecked
        // if(sender.isChecked){
            // Gm.load.loadSpriteFrame("img/button/button_btn_lan",function(sp,node){
            //     // if (icon && icon.node){
            //         node.getComponent(cc.Sprite).spriteFrame = sp
            //     // }
            // },this.m_oOkBtn)
        // }else{
            // Gm.load.loadSpriteFrame("img/button/button_btn_hui1",function(sp,node){
            //     // if (icon && icon.node){
            //         node.getComponent(cc.Sprite).spriteFrame = sp
            //     // }
            // },this.m_oOkBtn)
        // }
        this._setOkBtnEnable(this.m_nAgree)
    },

    _setOkBtnEnable(isEnable){
        let str = isEnable ? cc.Material.BUILTIN_NAME.SPRITE : cc.Material.BUILTIN_NAME.GRAY_SPRITE
        var material = cc.Material.createWithBuiltin(str, 0)
        // material = cc.MaterialVariant.create(material, this.m_oOkBtn.getComponent(cc.Sprite))
        if(isEnable){
            material.define("USE_TEXTURE", true, 0)
        }
        var spr = this.m_oOkBtn.node.getChildByName("button_btn_lan")
        spr.getComponent(cc.Sprite).setMaterial(0, material)
    },

    onCancelClick(){
        this.onBack()
    },
    onConfirmClick(){
        if(this.m_nAgree){
            Gm.getLogic("LoginLogic").termsAgree = this.m_nAgree
            cc.sys.localStorage.setItem("termsAgree",this.m_nAgree)
            this.onBack()
        }else{
            var data = {btnNums:1,msg:Ls.get(1000079)}
            Gm.box(data)
        }
    },
    onBack(){
        this._super()
    },

});

