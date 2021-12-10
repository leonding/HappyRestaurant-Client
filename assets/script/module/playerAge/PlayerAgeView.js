var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
         m_oUIDatePickerPrefab:cc.Prefab,
         m_oTimeLabel:cc.Label,
         m_oMoney1Label:cc.Label,
         m_oMoney2Label:cc.Label,
         m_oMoney3Label:cc.Label,
    },
    onLoad(){
        this.popupUIData = {title:Ls.get(400)}
        this._super()
        this.popupUI.setWidth(this.tipsNode.width)
        this.setUI()
        this.m_oTimeLabel.string = Ls.get(403) + "   2020 10 20"
    },
    setUI(){
            var  str =  Gm.config.getConst("account_buy_jp")
            var array1 = str.split("|")
            var array2 = array1[0].split("_")
            var array3 = array1[1].split("_")
            var money1 = checkint(array2[1])
            var money2 = checkint(array3[1])

            this.m_oMoney1Label.string = cc.js.formatStr(Ls.get(407),money1)
            this.m_oMoney2Label.string = cc.js.formatStr(Ls.get(407),money2)
            this.m_oMoney3Label.string = Ls.get(408)
    },
    getToDay(){
        var myDate = new Date();
        var year = myDate.getFullYear();         // 获取完整的年份(4位,1970-????)
        var month = myDate.getMonth();      // 获取当前月份(0-11,0代表1月)
        var day = myDate.getDate();              // 获取当前日(1-31)
        return {year:year,month:month,day:day}
    },
    onInputClick(){
        var node = cc.instantiate(this.m_oUIDatePickerPrefab);
        node.parent = this.node
        var datePicker = node.getComponent("UIDatePicker")
        var date = this.getToDay()
        datePicker.setDate(date.year, date.month, date.day)
        var self = this
        datePicker.setPickDateCallback((year, month, day)=>{
            self.year = year
            self.month = month
            self.day = day
            self.updateDate(year,month,day)
        });
    },
    updateDate(year,month,day){
        this.m_oTimeLabel.string = year + " " + (month+1) + " " +day
    },
    cancelClick(){
        Gm.ui.removeByName("ActivityBuyView")
        Gm.ui.removeByName("PlayerAgeView")
    },
    checkDateIsCorrect(){
        if(!this.year){
            Gm.floating(Ls.get(414))
            return false
        }
        var date = new Date()
        var time1 = date.getTime()
        date.setFullYear(this.year)
        date.setMonth(this.month,1)
        date.setDate(this.day)
        var time2 = date.getTime()
        if(time1<time2){
            Gm.floating(Ls.get(424))
            return false
        }
        return true
    },
    okClick(){
        if(this.checkDateIsCorrect()){
            Gm.ui.create("AgeConfirmView",{year:this.year,month:this.month,day:this.day})
        }
    }
});

