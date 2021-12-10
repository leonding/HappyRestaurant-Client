
var CoreLogic = require("CoreLogic")
cc.Class({
    extends: CoreLogic,
    properties: {
        
    },
    ctor:function(){
        this.noticeData = null
        this.isNoticeFlag = true

        // this.termsAgree = cc.sys.localStorage.getItem("termsAgree")
    },
    register:function(){
        // this.events[Events.SOCKET_OPEN] = this.onSocketOpen.bind(this)
        // this.events[Events.SOCKET_CLOSE] = this.onSocketClose.bind(this)
        this.events[MSGCode.OP_PLAYER_LOGIN_S] = this.onNetPlayerLogin.bind(this)
        this.events[MSGCode.OP_ACCOUNT_LOGOUT_SYN] = this.onNetLogout.bind(this)

        // this.events[MSGCode.OP_SET_EXTEND_PASS_S] = this.onNetSetExtend.bind(this)
    },
    addTimeout(){
        if (!Bridge.isReview()){
            return
        }

        if (Gm.userInfo.authenticate < 2){
            return
        }

        var isVacation = false

        var nowDay = checkint(Func.dateFtt("yyyyMMdd",Gm.userData.getTime_m()))

        var user_nonage_holidays = Gm.config.getConst("user_nonage_holidays")
        var list = user_nonage_holidays.split("|")
        for (var i = 0; i < list.length; i++) {
            var day = list[i]
            if (checkint(day) == nowDay){
                isVacation = true
            }
        }

        var constKey = isVacation?"user_nonage_holiday_max_time":"user_nonage_usually_max_time"
        var tisKey = isVacation?6000005:6000004

        // Gm.userInfo.setOnlineTime(58*60*1000)

        var time = Gm.config.getConst(constKey)
        time = time-(30*60*1000)

        time = time - Gm.userInfo.todayOnline

        this.removeTimeOut()
        this.timeOut = setTimeout(()=>{
            Gm.ui.create("PlateNumberBox",{type:2,boxType:3,msg:tisKey})
        },time)
    },
    removeTimeOut(){
        if( this.timeOut !=null){
            clearTimeout(this.timeOut)
            this.timeOut = null
        }
    },
    onNetSetExtend(args){
    },
    onNetLogout:function(args){
        Gm.netLogic.clearData()
        this.removeTimeOut()
        var userNum = 0
        if (args.result == -60026){
            Gm.ui.removeByName("CreateRole")
            Gm.ui.create("PlateNumberBox",{type:2,boxType:1,msg:6000011,ok:"进入游戏",cancel:"立即认证",msg:6000011,func:(btnType)=>{
                if (btnType == 1){
                    Gm.loginData.setIgnore(true)
                    Gm.send(Events.MSG_CONNECT,{host:Gm.loginData.ip,port:Gm.loginData.port})
                }
            }})
            return
        }else if (args.result == -60017){//游客时长限定
            var dd = {type:2,boxType:1,cancel:"立即认证",msg:6000011}
            var isLogin = Gm.ui.getLayerActive("LoginView")
            if (!isLogin){
                dd.ok = "退出游戏"
                dd.func = (btnType)=>{
                    if (btnType == 1){
                        Gm.ui.removeAllView()
                        Gm.ui.create("LoginView",1)
                    }
                }
            }
            Gm.ui.create("PlateNumberBox",dd)
            return
        }else if (args.result == -60018){
            userNum = 6000003
        }else if (args.result == -60019){
            userNum = 6000005
        }else if (args.result == -60020){
            userNum = 6000004
        }

        if (userNum > 0){
            Gm.ui.create("PlateNumberBox",{type:2,boxType:4,msg:userNum,func:(btnType)=>{
                Gm.ui.removeAllView()
                Gm.ui.create("LoginView",1)
            }})
            return
        }
        var dd = {}
        dd.btnNum = 1
        dd.msg = args.content || Gm.config.getErr(args.result)
        Gm.box(dd,function(){
            Gm.ui.removeAllView()
            if (cc.sys.isNative){
                Gm.ui.create("UpdateView",1)
            }else{
                Gm.ui.create("LoginView",1)
            }
        })
    },
    // onSocketOpen:function(){
    //     Gm.playerNet.login(Gm.loginData.getLoginData())
    //     if (this.view){
    //         this.view.loginBtn.interactable = false
    //     }
    // },
    onSocketClose(){
        this.removeTimeOut()
        Gm.userInfo.id = 0
        if (this.view){
            this.view.loginBtn.interactable = true
        }
        if (this.changeServer){
            Gm.netLogic.clearData()
            Gm.ui.removeAllView()
            Gm.ui.create("LoginView",1)
            Gm.getLogic("LoginLogic").onAutoLogin(this.changeServer)
            this.changeServer = null
        }
    },
    setChangeServerData(data){
        this.changeServer = data
        Gm.send(Events.MSG_CLOSE,{quit:true})
    },
    onNetPlayerLogin:function(args){
        this.isNoticeFlag = false
        if (args.result == 0 ){//登录成功
            Gm.ui.removeAllView()
            Gm.userInfo.clearData()
            Gm.userInfo.setData(args.playerInfo)
            // Gm.userData.setLoginTime(args.playerInfo.loginTime)

            Gm.send(Events.LOGIN_SUC)

            // if (cc.sys.isNative && (cc.sys.platform == cc.sys.IPHONE || cc.sys.platform == cc.sys.IPAD || cc.sys.platform == cc.sys.ANDROID)){
            //     Gm.ui.create("UpdateView",2)
            // }else{
                Gm.ui.create("MainView")
            // }
            this.addTimeout()

        }else if (args.result == -60015){
            this.onNetLogout(args)
            return
        }

        Gm.ui.removeByName("LoginView")
    },
    onNetErrorCode:function(args){
       Gm.floating(Gm.config.getErr(args.errCode))
       Gm.removeLoading()
    },
    onLogin:function(){
        Gm.playerNet.login(Gm.loginData.getLoginData())
        if(this.view){
            this.view.loginBtn.interactable = false;
        }
    },
    downloadNotice(){
        if (cc.sys.localStorage.getItem("isNoticeTest") != 1){
            this.openNotice()
            cc.sys.localStorage.setItem("isNoticeTest",1)
            return
        }
        if(this.noticeData){
            this.noticeComplete()
            return
        }
        if (Globalval.staticUrl){
            Gm.loading(Ls.get(10003))
            Gm.http.downloadFile(Globalval.staticUrl + "AnnouncementConfig.txt",(data)=>{
                Gm.removeLoading()
                if (data){
                    this.noticeData = data[0].description
                }
                this.noticeComplete()
            })
        }
    },
    noticeComplete(){
        this.openNotice()
        //ServerListStatusConfig.txt
    },
    downloadServerStatus(){
        // this.view.refServerStatus()
    },
    openNotice(isShow){
        if(this.noticeData && ( this.isNoticeFlag || isShow )){
            this.isNoticeFlag = false
            Gm.ui.create("HelpInfoBox",{content:this.noticeData,title:Ls.get(70047)})
        }
    },
    // newSocket(){
    //     this.socket = new WebSocket("ws://192.168.3.188:4888")
        
    //     this.socket.binaryType = 'arraybuffer';
    //     this.socket.onopen = ()=>{
    //         cc.log("new onopen")
    //         this.sendTestlogin(MSGCode.OP_PLAYER_LOGIN_C,Gm.loginData.getLoginData())
    //     }
    //     this.socket.onclose = ()=>{
    //         cc.log("new onclose")
    //     }
    //     this.socket.onmessage = (event)=>{
    //         cc.log("new onmessage")
    //         if (event.data.byteLength < 8) {
    //             return
    //         }
    //         var dataView = new DataView(event.data);
    //         //服务器约定 长度（4字节) 消息号（4字节）以后全部为proto数据
    //         var msgLen = dataView.getInt32(0, false);
    //         var cmd = dataView.getInt32(4, false);
           
    //         console.log("收到新消息号:" + cmd)
    //         if (cmd == MSGCode.OP_PLAYER_LOGIN_S){
    //             setTimeout(()=> {
    //                 this.sendTestlogin(MSGCode.OP__BEAT_C,{})
    //             }, 5000);
    //         }
    //     }
    //     this.socket.onerror = ()=>{
    //         cc.log("new onerror")
    //     }

    //     setInterval(()=>{
    //         if (this.socket){
    //             cc.log("new socket"," socket state = " + this.socket.readyState)
    //         }
    //     },2000)
    // },
    sendTestlogin(cmd,args){
        var newPb = Gm.netLogic.protoCode.encode(cmd,args)
        var pbBuff = newPb.toArrayBuffer()
        let pbBuffView = new DataView(pbBuff)

        //服务器约定 长度（4字节) 消息号（4字节）以后全部为proto数据
        let cmdBuff = new ArrayBuffer(8+pbBuff.byteLength)
        let cmdDataView = new DataView(cmdBuff)
        cmdDataView.setInt32(0, pbBuff.byteLength+4); // 消息长度(proto长度+消息号)))
        cmdDataView.setInt32(4, cmd); // 消息号

        for(var i = 0; i < pbBuff.byteLength; i++) { //拼接proto消息
            cmdDataView.setUint8(i+8,pbBuffView.getUint8(i, false))
        }
        this.socket.send(cmdBuff)
        
        cc.log("发送新消息号：",cmd)
    },
    onAutoLogin(serverData,dd){
        this.onLogin(serverData,dd)
    },
    checkTermsAgreement(){
        var AppTypeEnable = this.checkTermsAppType()
        if(!this.termsAgree && AppTypeEnable){
            // Gm.ui.create("UserTermsConfirm")
            return true
        }
        return false
    },
    checkTermsAppType(){
        // var nAppType = Bridge.getAppType() 
        var AppTypeEnable = true
        // if(!cc.sys.isNative){
        //     AppTypeEnable = true
        // }else if(nAppType == 3){
        //     AppTypeEnable = true
        // }else if(nAppType == 5){
        //     AppTypeEnable = true
        // }
        return AppTypeEnable
    },
});
