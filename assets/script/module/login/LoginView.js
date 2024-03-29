var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,

    properties: {
        editbox:{
            default:null,
            type:cc.EditBox
        },
        currServerLabel:cc.Label,

        serverNode:cc.Node,

        versionLab:cc.Label,
        lastNode:cc.Node,
        bgBtn:cc.Button,
        loginBtn:cc.Button,
        m_oBaseFont:cc.Font,

        m_oBaseNode:cc.Node,
        itemBase:cc.Prefab,

        basePopupUI:cc.Prefab,
        profilePictureItem:cc.Prefab,
        newBasePopupUI:cc.Prefab,
    },
    onLoad () {
        this._super()
        this.editbox.node.active = !cc.sys.isNative
        Gm.ui.setFont(this.m_oBaseFont)

        cc.log("创建登录============================",Ls.get(327))

    },

    register:function(){
        this.events[Events.MSG_TIMEOUT] = this.onMsgTimeout.bind(this);
    },

    enableUpdateView:function(data){
        if (data){
            this.loginBtn.interactable = true
            this.bgBtn.interactable = true
       
            this.editbox.string = cc.sys.localStorage.getItem("loginName") || ""
       
            this.logic.downloadNotice()

            // this.node.on(cc.Node.EventType.TOUCH_END,function  (event) {
            //     var tmpX = event.touch._point.x - cc.winSize.width/2
            //     var tmpY = event.touch._point.y - cc.winSize.height/2
            //     Gm.ui.zoomCamera({x:tmpX,y:tmpY},2,30,3000,function(){
            //         console.log("?????")
            //     })
            // })
            if (data == 2){
                this.checkNetwork()
            }
        }
    },
    checkNetwork(){
        if (cc.sys.getNetworkType() == cc.sys.NetworkType.NONE){
            Gm.box({msg:Ls.get(9015),btnNum:1,isNetwork:true},()=>{
                this.checkNetwork()
            })
            return
        }

        Gm.box({msg:Ls.get(1000071),isNetwork:true},(btnType)=>{
            if (btnType == 1){
                this.onLogin()
            }
        })
    },

    onBgClick(){
        if(cc.sys.isNative){
            
            this.onLogin()
            return
        }
    },
    onLogin:function(){     
        if(cc.sys.isNative){
            // Gm.loginData.setLoginName(Bridge.getOpenUDID())
            this.logic.onLogin()
            return
        }
        if (this.editbox.string == ""){
            Gm.floating(Ls.get(90009))
            return
        }
        Gm.loginData.setLoginName(this.editbox.string)
        cc.sys.localStorage.setItem("loginName",this.editbox.string)

        this.logic.onLogin()
    },
    
    onMsgTimeout(){
        this.loginBtn.interactable = true;
    },
});

