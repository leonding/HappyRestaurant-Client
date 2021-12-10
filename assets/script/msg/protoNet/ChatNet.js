var MSGCode = require("MSGCode")

MSGCode.proto[MSGCode.OP_SEND_CHAT_C]        = "Chat.OPSendChat"
MSGCode.proto[MSGCode.OP_SEND_CHAT_S]        = "Chat.OPChatMsgRet"
MSGCode.proto[MSGCode.OP_PUSH_CHAT_S]        = "Chat.OPPushChatMsgRet"
MSGCode.proto[MSGCode.OP_PUSH_OFFLINE_CHAT_S]= "Chat.OPPushOfflineChatMsgRet"
MSGCode.proto[MSGCode.OP_CHAT_INIT_S]= "Chat.OPChatInitRet"

MSGCode.proto[MSGCode.OP_GET_CHAT_INFO_C]= "Chat.OPGetChatInfo"

cc.Class({
properties: {
        
    },
    send:function(chatType,msg,tId){
        Gm.sendCmdHttp(MSGCode.OP_SEND_CHAT_C,{chatType:chatType,chatMsg:msg,targetPlayerId:tId})
    },
    getChat(){
        if (Gm.chatData.firstGet){
            Gm.chatData.firstGet = false
            Gm.chatData.clearChats()
            Gm.sendCmdHttp(MSGCode.OP_GET_CHAT_INFO_C)
        }
    },
});
