var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        descLab:cc.RichText,
        accountLab:cc.Label,
        passwordLab:{
            default:null,
            type:cc.EditBox
        },
        accountEdit:{
            default:null,
            type:cc.EditBox
        },
        copyBtn:cc.Node,
    },
    onLoad:function(){
        this.popupUIData = {title:1725}
        this._super()
    },
    onEnable(){
       this._super()
    },
    enableUpdateView(args){
        if (args){
            this.argsType = args
            this.accountEdit.node.parent.active = args == 2
            this.accountLab.node.parent.active = args == 1
            this.copyBtn.active = args == 1

            if (args == 1){
                this.accountLab.string = Gm.userInfo.extendCode || ""
            }else{
                
            }
            this.descLab.string = Ls.get(Gm.config.getConst("game_inheritance_text" + args))
            this.scrollView.content.height = this.descLab._labelHeight
        }
    },
    onCopyBtn(){
        Bridge.copyStr(Gm.userInfo.extendCode)
    },
    onCancelBtn(){
    },
    onOkBtn(){
        if (this.argsType == 1){
            cc.log(this.passwordLab.string.length)
            if(this.passwordLab.string.length < 4){
                Gm.floating(Ls.get(1000008))
                return
            }
            Gm.playerNet.setExtend(this.passwordLab.string)
            var str = Ls.get(1000009)
            Gm.box({msg:cc.js.formatStr(str,Gm.userInfo.extendCode,this.passwordLab.string),btnNum:1})
        }else {
            if(this.accountEdit.string==""){
                return
            }

            var self = this
            var data = {}
            data.url = Globalval.getBind()
            data.type = "POST"
            data.sendData = {}
            data.sendData.deviceId = Gm.loginData.getDeviceId()
            data.sendData.extendCode = this.accountEdit.string
            data.sendData.pass = this.passwordLab.string
            data.handler = function(args){
                Gm.removeLoading()
                if (args){
                    if (args.result == 0){
                        Gm.floating(Ls.get(1000010))    
                        Gm.loginData.setCanExtendBind(0)
                        var loginView = Gm.ui.getScript("LoginView")
                        if (loginView){
                            loginView.updateBindBtn()
                        }
                        self.onBack()
                    }else{
                        Gm.floating(Ls.get(1000011))    
                    }
                }else{
                    Gm.floating(Ls.get(1000012))
                }
            }
            Gm.loading(Ls.get(1000013))
            Gm.sendHttp(data)
        }
    },
});

