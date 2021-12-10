var HVAE_RED_CHAT_BUFFER = 100
cc.Class({
    properties: {
       
    },
    ctor:function(){
        this.clearData()
        this.m_haveRedChat = []
        this.m_preLoadChats= []
    },

    initChatPath(){
        HVAE_RED_CHAT_BUFFER = Gm.config.getConst("private_storage_max")
        this.m_chatDataPath =cc.js.formatStr("chatData%s",Gm.loginData.getServerNowId()) 
        // console.log("初始化路径======>",this.m_chatDataPath)
        var file = cc.sys.localStorage.getItem( this.m_chatDataPath) || ""
        if( file != ""){
            this.preLoadHaveRedChats() 
        }
    },

    clearData:function(){
        this.clearChats()
        this.privateChats = {}
        this.initData = {privateRoleList:[],channelCount:[0,0,0,0]}
        this.unionChatRed = false //同盟红点
        this.privateChatRed = {}//私信红点
        this.unionRedTime = 0
    },
    clearChats(){
        this.chats = [[],[],[]]
    },
    setPrivateRed(playerId,show){
        if(this.privateChatRed[playerId] == show){
            return
        }
        this.privateChatRed[playerId] = show
        Gm.red.refreshEventState("privateChat")
    },
    setRedData(index,show){
        if (show){
            var time = 5*60
            if (this.unionRedTime == 0 || Gm.userData.getTime_s() - this.unionRedTime > time){
                this.unionRedTime = Gm.userData.getTime_s()
            }else{
                return
            }
        }
        this.unionChatRed = show
        Gm.red.refreshEventState("unionChat")
    },
    getPrivateRoleById:function(id){
        for (let index = 0; index < this.initData.privateRoleList.length; index++) {
            const v = this.initData.privateRoleList[index];
            if (v.playerId == id){
                return v
            }
        }
    },
    setinitData:function(data){
        this.initData = data
        this.firstGet = true
        this.showMaxNum = Gm.config.getConst("chat_max_store")
    },
    getCount:function(chatType){
        return this.initData.channelCount[chatType-1] || 0
    },
    setCount:function(chatType){
        this.initData.channelCount[chatType-1] = this.initData.channelCount[chatType-1] + 1
    },
    pushChat:function(chat){
        this.setRedData(chat.chatType-1,true)    
        if(chat.chatType == 4){
            this.pushPrivateChat(chat)
        }else{
            this.chats[chat.chatType-1].push(chat)
            if (this.chats[chat.chatType-1].length > this.showMaxNum){
                this.chats[chat.chatType-1].splice(0,1)
            }
        }
    },
    pushPrivateChat:function(chat){
        var id = chat.sendPlayerId
        if (id == Gm.userInfo.id){
            id = chat.targetPlayerId
        }
        var list = this.getPrivateChatById(id)
        list.push(chat)
        if (list.length > this.showMaxNum){
            list.splice(0,1)
        }
        chat.privateId = id
        if (chat.sendPlayerId != Gm.userInfo.id && chat.haveRedType != 4){
            this.setPrivateRed(chat.sendPlayerId,true)
        }
        if (chat.arenaFightInfo.playerId == Gm.userInfo.id){
            return
        }
        var isPush = true
        for (let index = 0; index < this.initData.privateRoleList.length; index++) {
            const v = this.initData.privateRoleList[index];
            if (v.playerId == chat.privateId){
                isPush = false
            }
        }
        if (isPush){
            this.initData.privateRoleList.push(chat.arenaFightInfo)
        }
    },
    getPrivateChatById:function(id){
        if (this.privateChats[id] == null){
            this.privateChats[id] = []
        }
        return this.privateChats[id]
    },
    getAll:function(chatType){
        var list = this.chats[chatType-1]
        // if (list.length >= 100){
        //     return list
        // }
        // if (list.length){
        //     var a = []
        //     for (var i = 0; i < 100; i++) {
        //         var dd = Func.dataMerge({},list[0])
        //         dd.chatMsg = i + ""
        //         a.push(dd)
        //     }
        //     this.chats[chatType-1] = a
        //     return a
        // }
        return list
    },

    savePrivateChat(args){
        if( args.chatType == 4 ){
            if(this.m_haveRedChat.length > HVAE_RED_CHAT_BUFFER){
                this.m_haveRedChat.splice(0,1)
            }
            args.haveRedType = args.chatType //历史消息标记
            this.m_haveRedChat.push(args)
            this.savePrivateChatToJson(this.m_haveRedChat)
        }
      
    },    
    savePrivateChatToJson(data){
        var jsonData = JSON.stringify(data)
        cc.log("Path:"+this.m_chatDataPath);
        cc.sys.localStorage.setItem(this.m_chatDataPath,jsonData)
    },


    preLoadHaveRedChats(){
        var chatData = cc.sys.localStorage.getItem(this.m_chatDataPath)
        // console.log("加载历史聊天记录====>",chatData)
        this.m_preLoadChats = JSON.parse(chatData)
        this.m_haveRedChat = this.m_preLoadChats
    },

    getPreLoadHaveRedChats(){
        if(this.m_preLoadChats.length > 0 ){
            var chats = JSON.parse(JSON.stringify(this.m_preLoadChats)) 
            this.m_preLoadChats = [] //保证数据只被加载一次，加载完清空
            return chats
        }else{
            return []
        }
    }
});
