var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
         m_oTimeLabel:cc.Label,
         m_oMoneyLabel:cc.Label,
         m_oDesLabel1:cc.Label,
         m_oAlertNode:cc.Node,
    },
    onLoad(){
        this.popupUIData = {title:409}
        this._super()
        this.popupUI.setWidth(this.tipsNode.width)
    },
    enableUpdateView:function(data){
        this.data = data
        this.setView()
    },
    setView(){
        this.m_oTimeLabel.string = this.data.year + "年" + (this.data.month +1) + "月" + this.data.day + "日"
        var age = Func.getAge(this.data)
        this.m_oMoneyLabel.string = this.getMonstrByAge(age)

        this.key = Gm.userInfo.isInputAge()
        this.m_oAlertNode.active = !this.key

        this.m_oDesLabel1.string = Ls.get(410)
    },
    getMonstrByAge(age){
        var money = AtyFunc.getMaxPayNumber(age)
        if(money == -1){
            return Ls.get(408)
        }
        return  cc.js.formatStr(Ls.get(411),money)
    },
    cancelClick(){
        Gm.ui.removeByName("AgeConfirmView")
    },
    okClick(){
        Gm.ui.removeByName("PlayerAgeView")
        Gm.ui.removeByName("AgeConfirmView")
        Gm.userInfo.setBirthDay(this.data)
        Gm.payNet.sendBornDate()
    }
});

