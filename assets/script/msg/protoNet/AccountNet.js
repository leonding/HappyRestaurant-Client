var MSGCode = require("MSGCode")
MSGCode.proto[MSGCode.OP_BIND_PAY_ACCOUNT_C]    = "Pay.BindPayAccount"
MSGCode.proto[MSGCode.OP_BIND_PAY_ACCOUNT_S]    = "Pay.BindPayAccountRet"

MSGCode.proto[MSGCode.OP_FIND_OLD_USER_C]    = "Pay.FindOldUser"
MSGCode.proto[MSGCode.OP_FIND_OLD_USER_S]    = "Pay.FindOldUserRet"

cc.Class({
    properties: {
        
    },

    sendBindToken:function(playerid,toKen,platformType){
        var sendData = {playerId:playerid,token:toKen,channelId:platformType}
        Gm.sendCmdHttp(MSGCode.OP_BIND_PAY_ACCOUNT_C,sendData)
     },

     sendSwitchToken:function(playerid,toKen,platformType){
        var sendData = {playerId:playerid,token:toKen,channelId:platformType}
        Gm.sendCmdHttp(MSGCode.OP_FIND_OLD_USER_C,sendData)
     }
  
});
