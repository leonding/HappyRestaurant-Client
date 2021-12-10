var MSGCode = require("MSGCode")
MSGCode.proto[MSGCode.OP_APP_COMMENT_C]  = "Player.OPAppComment"
MSGCode.proto[MSGCode.OP_APP_COMMENT_S]  = "Player.OPAppCommentRet"

cc.Class({
    properties: {
        
    },

    //type = 1 评论
    //type = 2 领取奖励
    senAppraisa:function(type){
        Gm.sendCmdHttp(MSGCode.OP_APP_COMMENT_C,{type:type})
    },

  
});
