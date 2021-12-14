var MSGCode = require("MSGCode")
MSGCode.proto[MSGCode.OP_PLAYER_LOGIN_C]  = "Player.PlayerLoginCmd"
MSGCode.proto[MSGCode.OP_PLAYER_LOGIN_S]  = "Player.PlayerLoginRet"


cc.Class({
    properties: {
        
    },

    login:function(data){
        Gm.sendCmdHttp(MSGCode.OP_PLAYER_LOGIN_C,data)
    },

});
