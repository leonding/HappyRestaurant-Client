var BaseView = require("BaseView")
// MessageBox
cc.Class({
    extends: BaseView,
    properties: {
        titleLab:cc.Label,
        m_oContentLab:cc.RichText,
        okBtn:cc.Node,
        cancelBtn1:cc.Node,
        cancelBtn2:cc.Node,
        okLabel:cc.Label,
        cancelLabel:cc.Label,
        toggle:cc.Toggle,
    },
    enableUpdateView(args){
        if (args){
            this.setData(args)
        }
    },
    setData:function(data){
        // data.ok = "ok"
        // data.cancel = "cancel"
        // data.btnNum = 1
        // data.title = "确认窗口"
        // data.msg = "内容"
        this.onlyBtn = data.onlyBtn

        var popupData = {title:data.title || Ls.get(70007)}
        if (data.isNetwork){
            popupData.isClose = false
        }
        this.popupUI.setData(popupData)

        var tmpStr = data.msg || ""
        this.m_oContentLab.string = cc.js.formatStr("<color=#000000>%s</c>",tmpStr)

        this.toggle.node.active = data.showToggle || false

        this.okLabel.string = data.ok || Ls.get(70008)
        this.cancelLabel.string = data.cancel || Ls.get(70009)

        this.node.getChildByName("m_oBaseNode").off(cc.Node.EventType.TOUCH_START)

        var btnNum = data.btnNum || 2
        this.okBtn.active = true
        this.cancelBtn1.active = (btnNum == 2)
        this.cancelBtn2.active = (btnNum == 2)
        this.node.getChildByName("m_oBaseNode").off(cc.Node.EventType.TOUCH_START)
        if (btnNum == 0){
            this.okBtn.active = false
        }
        if (this.okBtn.active && this.cancelBtn1.active){
            this.okBtn.x = 149.3
            this.cancelBtn1.x = -149.3
        }else if (this.okBtn.active){
            this.okBtn.x = 0
        }
        this.callback = data.callback || function(){}

        this.isUpdateOpen = data.isUpdateOpen
        this.isNetwork = data.isNetwork
        this.btnType = 0
    },
    onOkClick:function(){
        this.btnType = 1
        this.onBack(true)
    },
    onNoClick:function(event,value){
        if (this.onlyBtn && !checkint(value)){
            this.onBack(true)
        }else{
            this.btnType = 2
            this.onBack(true)
        }
    },
    onBack(isClick){
        if (isClick == null && this.isNetwork){
            return
        }
        if (this.isUpdateOpen){
            this.onCloseActionComplete()
            return
        }
        this._super()
    },
    onCloseActionComplete(){
        this._super()
        this.callfunc(this.btnType,this.toggle.isChecked)
    },
    callfunc(arg1,arg2){
        if (this.callback){
            this.callback(arg1,arg2)
        }
        this.callback = null
    },
});

