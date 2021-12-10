var CoreLogic = require("CoreLogic")
cc.Class({
    extends: CoreLogic,
    properties: {
        
    },
    ctor:function(){

    },
    register:function(){
        this.events[Events.LOGIN_SUC]       = this.onLogicSuss.bind(this)
        this.events[MSGCode.OP_CHAT_INIT_S] = this.onNetChatInit.bind(this)
        this.events[MSGCode.OP_SEND_CHAT_S] = this.onNetChatSend.bind(this)
        this.events[MSGCode.OP_PUSH_CHAT_S] = this.onNetChatPush.bind(this)
        this.events[MSGCode.OP_PUSH_OFFLINE_CHAT_S] = this.onNetChatPushOffline.bind(this)
        this.events[MSGCode.OP_PLAYER_LOGIN_S]  = this.onNetLogin.bind(this)

    },
    onLogicSuss:function(){
      Gm.chatData.clearData()
    },

    onNetLogin(){
        Gm.chatData.initChatPath()
    },
    onNetChatInit:function(args){
        Gm.chatData.setinitData(args)
    },
    onNetChatSend:function(args){

    },
    onNetChatPush:function(args,isFlag){
        if (Gm.friendData.getBlack(args.sendPlayerId)){//黑名单中人
            return
        }
        Gm.chatData.pushChat(args)
        Gm.chatData.savePrivateChat(args)
        if (isFlag){
            return
        }
        this.pushViewChat(args)
    },
    onNetChatPushOffline:function(args){
        Gm.chatData.clearChats()
        if(args.OPPushChatMsgRet.length > 0 && args.OPPushChatMsgRet[0].chatType == 4){
            this.pushHistoryPrivateChat()
        }
        if (args.OPPushChatMsgRet.length > 0 ){
            var starIndex = 0
            for (let index = starIndex; index < args.OPPushChatMsgRet.length; index++) {
                const v = args.OPPushChatMsgRet[index];
                this.onNetChatPush(v,true)
                // if (Gm.chatData.getPrivateRoleById(v.privateId) == null){
                //     Gm.chatData.initData.privateRoleList.push(v.arenaFightInfo)
                // }
            }
        }
    
    },

    pushHistoryPrivateChat(){
        var haveRed = Gm.chatData.getPreLoadHaveRedChats()
        if(haveRed.length > 0 ){
            for (let index = 0; index < haveRed.length; index++) {
                const v = haveRed[index];
                Gm.chatData.pushChat(v)
            }
        }
    },

    pushViewChat(args){
        if (this.view){
            this.view.pushChat(args,true)
        }
    }
});
