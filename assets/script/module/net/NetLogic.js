var CoreLogic = require("CoreLogic")
var ProtoCode = require("ProtoCode")
cc.Class({
    extends: CoreLogic,
    properties: {
        retryTimes:0,
        isLogout:false,
        isInitiativeClose:false,
        isConnect:false,
        isConnecting:false,
        host:"",
        port:"",
        loginTimer:null,
        maskNode:null,
        maskTimer:null,
        cacheData:null, //创建界面异步缓存
        isCache:false,
        isPrint:false
    },
    ctor:function(){
        this.protoCode = new ProtoCode()
        this.cacheData = []

        this.isPrint = true//!cc.sys.isNative

        // setInterval(()=>{
        //     if (this.socket){
        //         this.printState("setInterval")
        //     }
        // },2000)
    },
    register:function(){
        // this.events[Events.MSG_CONNECT] = this.onConnect.bind(this)
        this.events[Events.MSG_RECONNECT] = this.onReconnect.bind(this)
        this.events[Events.MSG_CLOSE] = this.onClose.bind(this)
        this.events[Events.MSG_CACHE] = this.onMsgCache.bind(this)
    },
    onConnect:function(args){
        this.printState("connect")
        if (this.isLogout ){
            console.log("已踢出")
            return
        }
        if (this.isConnecting){
            console.log("正在连接中")
            return
        }
        if (!this.isConnect){
            console.log("开始连接",this.host)
            // if (cc.sys.getNetworkType() == 0){
            //     var self = this
            //     Gm.box({msg:Ls.get(9015)},function(){
            //         self.onReconnect()
            //     })
            //     return
            // }
            var str = Ls.get(4000003)
            if (args.reconnect){
                str = Ls.get(4000005) + (this.retryTimes + 1) + Ls.get(4000006)
            }
            Gm.loading(str,true)

            this.host = args.host
            this.port = args.port

            if (this.host.slice(0,2) == "ws"){
                this.socket = new WebSocket(this.host)
            }else{
                this.socket = new WebSocket("ws://" + this.host + ":" + this.port)
            }
            
            this.socket.binaryType = 'arraybuffer';
            this.socket.onopen = this.onNetConnectSuc.bind(this);
            this.socket.onclose = this.onNetConnectFail.bind(this);
            this.socket.onmessage = this.onNetMessage.bind(this);
            this.socket.onerror = this.onNetError.bind(this)

            this.isConnecting = true
            this.beginTime = new Date()
        }else{
            console.log("已连接,重新连接一下，刷新整个游戏")
            Gm.send(Events.MSG_CLOSE,{isReconnect:true})
        }
    },
    printState(str){
        if (this.socket){
            // cc.error(str + " socket state = " + this.socket.readyState)
        }
    },
    onNetError:function(args){
        console.log("连接error",args)
    },
    onReconnect:function(args){
        if (this.host == "" && this.port == ""){
            return
        }
        console.log("重新连接")
        Gm.removeBox()
        this.onConnect({host:this.host,port:this.port,reconnect:true})
    },
    isCanConnect:function(){
        if (this.host == "" && this.port == ""){
            return false
        }
        return true
    },
    clearData:function(){
        this.host = "" 
        this.port = ""
    },
    onClose:function(args){
        if (!args.isReconnect){
            this.isInitiativeClose = true
        }
        if (args.quit){
            this.host = "" 
            this.port = ""
            this.isConnect = false
        }
        if (this.socket){
            this.removeCloseTimer()
            this.closeTimer = setInterval(()=> {
                if(this.socket){
                    if (this.socket.readyState == 3){
                        this.onNetConnectFail()
                    }else if (this.socket.readyState == 1){
                        this.removeCloseTimer()
                    }
                }else{
                    this.removeCloseTimer()
                }
            }, 1000);
            this.closeActionTime =new Date()
            this.socket.close()
            this.printState("close")
        }
    },
    removeCloseTimer:function(){
        if (this.closeTimer){
            clearInterval(this.closeTimer)
            this.closeTimer = null
        }
    },

    clearLoginTimer:function(){
        if (this.loginTimer){
            clearTimeout(this.loginTimer)
            this.loginTimer = null
        }
    },
    onNetConnectFail:function(){
        this.removeCloseTimer()
        console.log('连接断开',this.isInitiativeClose,new Date()-this.beginTime)
        if (this.closeActionTime){
            console.log('主动断开回调耗时',new Date()-this.closeActionTime)
            this.closeActionTime = null
        }
        
        this.printState("fail")
        this.isConnect = false
        this.isConnecting = false
        this.clearLoginTimer()//取消登录延时
        Gm.removeLoading()
        Gm.send(Events.SOCKET_CLOSE)
        if (this.isLogout){
            return
        }
        if (this.isInitiativeClose){
            this.isInitiativeClose = false
        }else{
            if (this.retryTimes >= 2){
                var self = this
                var isLogin = Gm.ui.getLayerActive("LoginView")
                var dd = {}
                if (isLogin){
                    dd.msg = Ls.get(1000070)
                    dd.ok = Ls.get(1000069)
                    dd.cancel = Ls.get(70009)
                }else{
                    dd.msg = Ls.get(4000011)
                    dd.ok = Ls.get(1000069)
                    dd.cancel = Ls.get(1000068)
                }
                dd.isNetwork = true
                Gm.box(dd,(btnType)=>{
                    self.retryTimes = 0
                    if (btnType == 1){
                        // self.onReconnect()
                        Gm.ui.removeAllView()
                        Gm.ui.create("LoginView")
                    }else if(isLogin == false && btnType == 2){
                        Gm.ui.removeAllView()
                        Gm.ui.create("LoginView",2)
                    }
                })
                return
            }
            this.retryTimes = this.retryTimes + 1
            this.onReconnect()
        }
    },
    sendCmdHttp:function(cmd,args){

        var newPb = this.protoCode.encode(cmd,args)
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
        if (this.isPrint){
            console.log("发送消息:" + cmd + "[" +MSGCode.proto[cmd] + "] "+ this.getLogTimeStr(),args);
        }
        this.showMask()

        let reqData = {}
        reqData.url = Globalval.getBaseURL()
        reqData.type = "POST"
        reqData.responseType = "arraybuffer"
        reqData.sendData = cmdBuff     
        reqData.handler = this.onNetMessage.bind(this)

        Gm.sendHttp(reqData)
        return true
    },
    getLogTimeStr(){
        var str = Func.dateFtt("yyyy-MM-dd hh:mm:ss S",new Date())
        return str 
    },
    onNetMessage:function(event){
        if(!event){
            return
        }
        if (event.byteLength < 8) {
            return
        }
        var dataView = new DataView(event);
        //服务器约定 长度（4字节) 消息号（4字节）以后全部为proto数据
        var msgLen = dataView.getInt32(0, false);
        var cmd = dataView.getInt32(4, false);
       
        if (MSGCode.proto[cmd]){
            
            var buffer =  new Uint8Array(msgLen-8)
            for(var i = 0; i < msgLen - 8; i++) {
                buffer[i] = dataView.getInt8(i + 8, false);
            }
            let newPb = this.pbDecode(cmd,buffer,true)
            if (newPb.result == undefined){
                newPb.result = 0
            }
            
            if (this.isPrint && cmd != MSGCode.OP_HEART_BEAT_S){
                console.log("收到消息:" + cmd + "[" +MSGCode.proto[cmd] + "] " + this.getLogTimeStr(),newPb);
            }
            newPb.result = newPb.result || 0
            if (newPb.result != 0){
                if (newPb.result == -1 && newPb.errorTips){
                    Gm.floating(newPb.errorTips)
                }else{
                    // Gm.floating(ProtocolCodeText[newPb.result] || 0)  
                }
            }
            this.hideMask()
            if (this.isCache){
                this.cacheData.push({cmd:cmd,newPb:newPb})
            }else{
                Gm.send(cmd,newPb)
            }
        }else{
            console.log("未解析消息:" + cmd)
        }
    },
    pbDecode(cmd,buffer){
        var newPb = this.protoCode.decode(cmd,buffer,true)
        this.intToNumber(newPb)
        return newPb
    },
    onMsgCache:function(args){
        this.isCache = args
        if (!this.isCache){
            while (this.cacheData.length >0) {
                var v = this.cacheData[0];
                Gm.send(v.cmd,v.newPb)
                this.cacheData.splice(0,1)
            }
        }
    },
    intToNumber:function(newData){
        //int64转number，JS存储最高53
        for (const key in newData) {
            if (newData.hasOwnProperty(key)) {
                var v = newData[key];
                if(v && typeof(v) == "object" ){
                    if (v.hasOwnProperty("high") && v.hasOwnProperty("low")){
                        newData[key] = Number(v)
                    }else {
                        this.intToNumber(v)
                    }
                }
            }
        }
    },
    showMask:function(){
        var self = this
        this.createMask(function(){
            if (self.maskNode == null || self.maskNode.active){
                return
            }
            self.maskNode.active = true
            self.maskTimer = setTimeout(function(){
                self.maskTimer = null
                self.hideMask()
            }.bind(self),500)
        })
    },
    createMask:function(func){
        if (this.maskNode == null){
            // this.maskNode = Gm.getView("NetMask")
            // var self = this
            // Gm.ui.create("NetMask",{},function(newNode){
                // self.maskNode = newNode
                // self.maskNode.zIndex = 10
                // if (self.maskNode == null){
                //     console.log("没有网络屏蔽层")
                //     return
                // }
                // self.maskNode.active = false
               
                // self.maskNode.getChildByName("bg").off(cc.Node.EventType.TOUCH_START)
                // self.maskNode.getChildByName("bg").on(cc.Node.EventType.TOUCH_START,function  (event) {
                //     console.log("消息屏蔽层")
                // },self)
                // func()
            // })
        }else{
            func()
        }
    },
    hideMask:function(){
        if (this.maskNode){
            this.maskNode.active = false
        }
        if (this.maskTimer){
            clearTimeout(this.maskTimer)
            this.maskTimer = null
        }
    },
});
