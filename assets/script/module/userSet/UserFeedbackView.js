var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        contentNode:cc.Node,
        inheritNode:cc.Node,
        timeNode:cc.Node,


        emailEdit:cc.EditBox,
        descEdit:cc.EditBox,
      
        //
        timeLab:cc.Label,
        m_oUIDatePickerPrefab:cc.Prefab,

        m_oListPanel:cc.Sprite,

    },
    onLoad:function(){
        this.contentNode.active = false
        this.popupUIData = {title:" "}
        var date = new Date();
        this.year = date.getFullYear()
        this.month = date.getMonth()
        this.day = date.getDate()
  
        this._super()
        this.popupUI.setHeight(880)
    },

    enableUpdateView(args){
        if (args){
            this.m_title = args.title
            this.popupUI.setData({title:args.title})
            this.updateTypeView()
            this.updateListPanel()
        }
    },
    updateTypeView(){
        if (this.openData.groupId != 6){//继承码问题
            this.inheritNode.parent = null
        }
        
        this.timeNode.active =  this.openData.groupId == 3 || this.openData.groupId == 4
        this.dropList = Gm.config.getBuyForm(this.openData.groupId)
        this.setBugFromConf(this.dropList[0])
        this.contentNode.active = true
    },
    setBugFromConf(conf){
        this.bugConf = conf
    },
    onTimeBtn(){
        cc.log("onTimeBtn")
        var node = cc.instantiate(this.m_oUIDatePickerPrefab);
        node.parent = this.node
        var datePicker = node.getComponent("UIDatePicker")
        datePicker.setDate(this.year, this.month, this.day)
        datePicker.setPickDateCallback((year, month, day)=>{
            this.year = year
            this.month = month
            this.day = day
            this.updateDate()
        });
    },

    updateDate () {
        var dateFormat = cc.js.formatStr("%s-%s-%s", this.year, this.month + 1, this.day)
        this.timeLab.string = dateFormat
    },

    getEditStr(edit){
        return edit.string.replace(/(^\s*)|(\s*$)/g, "")
    },

    //校验邮箱地址是否合法
    checkEmail(email){
        var format = /^[A-Za-z0-9+]+[A-Za-z0-9\.\_\-+]*@([A-Za-z0-9\-]+\.)+[A-Za-z0-9]+$/
        if(!email.match(format)){
            return false
        }
        return true
    },

    onToggle(sender,eventData){
        console.log("eventData ===>",eventData)
        this.isUseInheri  = eventData
    },

    onOkBtn(){
        cc.log("onOkBtn")
        console.log(this.popupUI.getHeight(),"xxxxx")
        var email1 = this.getEditStr(this.emailEdit) 

        if ( email1 == ""){
            Gm.floating(Ls.get(5344))
            return
        }
        
        if (this.getEditStr(this.descEdit) == ""){
            Gm.floating(Ls.get(5346))
            return
        }

        var data = {}
        data.mail = this.getEditStr(this.emailEdit)
        data.text = this.getEditStr(this.descEdit)
        
        data.pTId = this.bugConf.id
        if (this.openData.groupId == 6){//继承码
            //toggle
            data.code = this.isUseInheri || 1
        }else{
           data.timeStr = this.timeLab.string  //选填
        }
        
        var deviceInfo = Bridge.getDeviceInfo()
        var devObject = JSON.parse(deviceInfo)

        data.title = this.m_title 
        data.pId = Gm.userInfo.id
        data.name = Gm.userInfo.name
        data.osT =cc.sys.isNative ?  Bridge.isAndroid() ?  "android" : "ios" : "web"//系统类型 1IOS，2ANDROID
        data.osV =  cc.sys.isNative ? __getOSVersion() : "0.0.0"//系统版本
        data.telT = devObject.model//手机型号
        data.gV = Globalval.resVersion //版本号
        Gm.ui.create("FeedbackConfirmView",data)
        console.log(" data.osT", data.osT)
        console.log(" data.osV", data.osV)
        console.log(" data.telT", data.telT)
        console.log("  data.gV",  data.gV)
    },

    updateListPanel(){
        var layout = this.contentNode.getComponent(cc.Layout)
        layout.updateLayout()
        var height = this.contentNode.height
        this.m_oListPanel.node.height = height
    },
});

