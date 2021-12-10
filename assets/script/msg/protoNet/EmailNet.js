var MSGCode = require("MSGCode")
MSGCode.proto[MSGCode.P_WC_VISIT_EMAIL_RES]  = "Email.OPVisitEmailRet"
MSGCode.proto[MSGCode.P_WC_ADD_EMAIL_RES]  = "Email.OPAddEmailRet"
MSGCode.proto[MSGCode.P_WC_HAND_EMAIL_RES]  = "Email.OPHandEmailRet"
MSGCode.proto[MSGCode.P_WC_DEL_READ_EMAIL_RES]  = "Email.OPDelReadEmailRet"
MSGCode.proto[MSGCode.P_WC_REVEIVE_ALL_REWARD_EMAIL_RES]  = "Email.OPReceiveAllRewardEmailRet"

MSGCode.proto[MSGCode.P_CW_HAND_EMAIL_REQ]  = "Email.OPHandEmail"
MSGCode.proto[MSGCode.P_CW_DEL_READ_EMAIL_REQ]  = "Email.OPDelReadEmail"
MSGCode.proto[MSGCode.P_CW_REVEIVE_ALL_REWARD_EMAIL_REQ]  = "Email.OPReceiveAllRewardEmail"

cc.Class({
    properties: {
        
    },
    sendHandEmail:function(emailID,emailState,emailType){
        Gm.sendCmdHttp(MSGCode.P_CW_HAND_EMAIL_REQ,{playerId:Gm.userInfo.id,
            emailID:emailID,
            emailState:emailState,
            emailType:emailType})
    },
    sendDelReadEmail:function(emailType,emailID){
        Gm.sendCmdHttp(MSGCode.P_CW_DEL_READ_EMAIL_REQ,{playerId:Gm.userInfo.id,
            emailID:emailID,
            emailType:emailType})
    },
    sendReveiveAll:function(emailType){
        Gm.sendCmdHttp(MSGCode.P_CW_REVEIVE_ALL_REWARD_EMAIL_REQ,{playerId:Gm.userInfo.id,emailType:emailType})
    },
});
