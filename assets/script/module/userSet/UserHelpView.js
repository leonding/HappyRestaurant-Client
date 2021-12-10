var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        m_oAgeBtn:cc.Node,
    },
    onLoad:function(){
        this.popupUIData = {title:1730}
        this._super()

        this.data = Gm.config.getTerms()
    },
    onEnable(){
       this._super()
       if(Bridge.isHk()){
            this.m_oAgeBtn.active = !Bridge.isHk()
       }
     
    },
    onBtn(sender,value){
        value = checkint(value)
        cc.log(value)
        // var content = this.data[value]
        if(value == 5){
            if(Gm.userInfo.isInputAge()){
                Gm.ui.create("AgeConfirmView",Gm.userInfo.getBirthDay())
            }
            else{
                 Gm.ui.create("PlayerAgeView")
            }
        }
        else{
            Gm.ui.create("UserTermsView",{list:this.data,id:value})
        }
        
        this.onBack()
    },
});

