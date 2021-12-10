var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,

    properties: {
        loginNode:cc.Node,

        loginNameEdit:cc.EditBox,
        loginPasswoldEdit:cc.EditBox,
        loginToggle:cc.Toggle,

        boxNode:cc.Node,
        descLab:cc.Label,
        timeLab:cc.Label,
        btnLab1:cc.Label,
        btnLab2:cc.Label,
        closeBtn:cc.Node,
    },
    onLoad () {
        this._super()
    },
    enableUpdateView:function(data){
        if (data){
            this.loginNode.active = this.openData.type == 1
            this.boxNode.active = this.openData.type == 2

            this["updateNode" + this.openData.type]()
        }
    },
    updateNode1(){
        var nameStr = cc.sys.localStorage.getItem("newLoginName") || ""
        var wordStr = cc.sys.localStorage.getItem("newLoginWord") || ""

        this.loginNameEdit.string = nameStr
        this.loginPasswoldEdit.string = wordStr
    },
    updateNode2(){
        var data = this.openData
        var msg = data.msg
        this.descLab.string = Ls.get(msg)

        var btnNum = data.btnNum

        this.btnLab1.string = data.ok || ""
        this.btnLab2.string = data.cancel || ""

        var btnNum = data.btnNum || 2
        this.btnLab1.node.parent.active = data.ok != null
        this.btnLab2.node.parent.active = data.cancel != null

        if (data.boxType == 3){
            this.closeBtn.active = true
            this.updateTime()
            this.schedule(()=>{
                this.updateTime()
            },1)
        }
        if (data.boxType == 4){
            this.closeBtn.active = true
        }
    },
    updateTime(){
        var str = Func.timeToTSFM(Math.floor(Gm.userInfo.todayOnline/1000))
        this.timeLab.string = "累计时间：" + str
    },
    onBtn1Click(){
        if (this.openData.boxType == 1){
            if (this.openData.func){
                this.openData.func(1)
            }
            this.onBack()
        }
    },
    onBtn2Click(){

    },
    onClose(){
        if (this.openData.func){
            this.openData.func(0)
        }
        this.onBack()
    },
    onYkLoginClick(){
        var ykName = cc.sys.localStorage.getItem("youKeLoginName") || ""
        var ykPass = cc.sys.localStorage.getItem("youKeLoginWord") || ""
        if (ykName == ""){
            ykName = Func.random(10000000000,99999999999)
            var ykPass = ""
            for (var i = 0; i < 11; i++) {
                var aa = ""
                if (Func.random(1,9)%2 == 0 ){
                    aa = Func.random(0,9)
                }else{
                    aa = Func.randomAbc()
                }
                ykPass = ykPass + aa
            }
            cc.sys.localStorage.setItem("youKeLoginName",ykName)
            cc.sys.localStorage.setItem("youKeLoginWord",ykPass)
        }

        this.onLogin(ykName.toString(),ykPass)
    },
    onLoginClick(){
        var nameStr = this.loginNameEdit.string.replace(/(^\s*)|(\s*$)/g, "")
        var passStr = this.loginPasswoldEdit.string.replace(/(^\s*)|(\s*$)/g, "")

        if (nameStr == ""){
            Gm.floating("您输入的账号不正确")
            return
        }
        if (passStr == ""){
            Gm.floating("您输入的密码不正确")
            return
        }
        // cc.log(nameStr,passStr)
        var item = Gm.config.UserAuthenticateConfig(checkint(nameStr),passStr)
        if(item == null){
            Gm.floating("账号密码错误")
            return
        }

        this.onLogin(nameStr,passStr)
    },
    onLogin(nameStr,passStr){
        if(Gm.getLogic("LoginLogic").checkTermsAgreement()){ 
            return 
        }
        Gm.loginData.setLoginName(nameStr)

        var serverItem = Gm.config.serverById(Bridge.REVIEW_CONST)
        Gm.getLogic("LoginLogic").onLogin(serverItem,{deviceId:nameStr,pass:passStr})

        cc.sys.localStorage.setItem("newLoginName",nameStr)
        cc.sys.localStorage.setItem("newLoginWord",passStr)

        this.onBack()
    },
    onLoginToggle(){
        var flag = this.loginToggle.isChecked?cc.EditBox.InputFlag.PASSWORD:cc.EditBox.InputFlag.DEFAULT
        this.loginPasswoldEdit.inputFlag = flag
    },
    
});

