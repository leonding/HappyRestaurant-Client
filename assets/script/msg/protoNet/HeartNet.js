var MSGCode = require("MSGCode")
MSGCode.proto[MSGCode.OP_HEART_BEAT_C]        = "System.CWHeartBeatREQ"
MSGCode.proto[MSGCode.OP_HEART_BEAT_S]        = "System.WCHeartBeatRES"
MSGCode.proto[MSGCode.P_WC_SYSTEM_MARQUEE_RES]   = "System.WCMarqueeSYN"
MSGCode.proto[MSGCode.P_WC_SYSTEM_DEL_MARQUEE_RES] = "System.WCDelMarqueeSYN"
cc.Class({
    properties: {
        
    },
    heart:function(){
        return Gm.sendCmdHttp(MSGCode.OP_HEART_BEAT_C)
    }
});
