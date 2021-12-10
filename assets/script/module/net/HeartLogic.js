var CoreLogic = require("CoreLogic")
cc.Class({
    extends: CoreLogic,
    properties: {
        
    },
    ctor:function(){
        
    },
    register:function(){
        this.events[MSGCode.OP_PLAYER_LOGIN_S]  = this.onNetLogin.bind(this)
        this.events[MSGCode.OP_HEART_BEAT_S]    = this.onNetHeart.bind(this)
        
        this.events[Events.SOCKET_CLOSE]        = this.onSocketClose.bind(this)
        this.events[Events.ENTER_SHOW]          = this.onEnterShow.bind(this)
    },
    //回到游戏
    onEnterShow:function(){
        if (Gm.netLogic.isCanConnect()){
            cc.log("回到游戏、可发心跳")
            var self = this
            setTimeout(function() {
                self.sendHeart()
            }, 500);
        }
    },
    onNetLogin:function(args){
        this.addCheckNewDayInterval()
        this.addHeartInterval()
        this.sendHeart()
    },
    sendHeart:function(){
        var isSend = Gm.heartNet.heart()
        this.removeCheckHeart()
        if (isSend){
            this.heartTime = setTimeout(function(){
                cc.log("心跳5秒没有回来,重新连接")
                Gm.send(Events.MSG_CLOSE,{isReconnect:true})
            }.bind(this),5000)
        }
    },
    removeCheckHeart(){
        if( this.heartTime !=null){
            clearInterval(this.heartTime)
            this.heartTime = null
        }
    },
    addHeartInterval:function(){
        this.removeHeartInterval()
        this.heartInterval = setInterval(function(){
            this.sendHeart()
        }.bind(this),30*1000)
    },
    removeHeartInterval(){
        if( this.heartInterval !=null){
            clearInterval(this.heartInterval)
            this.heartInterval = null
        }
    },
    onSocketClose:function(args){
        this.removeHeartInterval()//清除重复心跳计时器
        this.removeCheckHeart() //清除发送心跳计时器
        this.removeCheckNewDayInterval()//清除新一天计时器
    },
    onNetHeart:function(args){
        this.removeCheckHeart()
        if(args.hasOwnProperty("serverTime")){
            Gm.userData.setServerTime(args.serverTime)
        }
        Gm.red.refreshEventState("fight")
    },

    addCheckNewDayInterval:function(){
        this.removeCheckNewDayInterval()
        this.checkNewDayInterval = setInterval(function(){
            var time = Gm.userData.getTime_m()
            if (time){
                var newDate = new Date(time)
                if (this.lastDate){
                    if (this.lastDate.getDate() != newDate.getDate()){
                        Gm.onNewDay()
                    }
                }
                this.lastDate = newDate
            }
        }.bind(this),1000)
    },
    removeCheckNewDayInterval(){
        if( this.checkNewDayInterval !=null){
            clearInterval(this.checkNewDayInterval)
            this.lastDate = null
            this.checkNewDayInterval = null
        }
    },
});
