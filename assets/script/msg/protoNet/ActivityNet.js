var MSGCode = require("MSGCode")
MSGCode.proto[MSGCode.OP_ACTIVITY_BUYGROW_C]        = "Activity.OPBuyPlanGrow"
MSGCode.proto[MSGCode.OP_ACTIVITY_BUYGROW_S]        = "Activity.OPBuyPlanGrowRet"
MSGCode.proto[MSGCode.OP_ACTIVITY_REWARD_C]        = "Activity.OPActivityRewards"
MSGCode.proto[MSGCode.OP_ACTIVITY_REWARD_S]        = "Activity.OPActivityRewardsRet"
MSGCode.proto[MSGCode.OP_ACTIVITY_INFO_S]           = "Activity.OPActivityGetInfoRet"
MSGCode.proto[MSGCode.OP_ACTIVITY_BUY_VIPPACKET_C]        = "Activity.OPBuyVipPackage"
MSGCode.proto[MSGCode.OP_ACTIVITY_BUY_VIPPACKET_S]        = "Activity.OPBuyVipPackageRet"
MSGCode.proto[MSGCode.OP_PAY_CREATE_PAYMENT_C]        = "Activity.OPDrawExChangeRet"
MSGCode.proto[MSGCode.OP_PAY_CREATE_PAYMENT_S]        = "Activity.OPDrawExChangeRet"
MSGCode.proto[MSGCode.OP_PAY_PAYMENT_RESULT_C]        = "Activity.OPDrawExChangeRet"
MSGCode.proto[MSGCode.OP_PAY_PAYMENT_RESULT_S]        = "Activity.OPDrawExChangeRet"

MSGCode.proto[MSGCode.OP_SYNC_LIMIT_GIFT_S]        = "Activity.OPSyncLimitGift"

MSGCode.proto[MSGCode.OP_BUY_PASSMEDAL_EXP_C]        = "Activity.OPBuyPassMedalExp"
MSGCode.proto[MSGCode.OP_BUY_PASSMEDAL_EXP_S]        = "Activity.OPBuyPassMedalExpRet"

MSGCode.proto[MSGCode.OP_ACT_STORE_PAY_S]        = "Activity.OPActStorePayRet"

MSGCode.proto[MSGCode.OP_ACT_REWARD_C]    = "Activity.OPActReward"
MSGCode.proto[MSGCode.OP_ACT_REWARD_S]    = "Activity.OPActRewardRet"

cc.Class({
    properties: {
        
    },
    buyPassMedalExp(id){
        this.buyPassId = id
        Gm.sendCmdHttp(MSGCode.OP_BUY_PASSMEDAL_EXP_C,{activityId:id})
    },
    buyGrow:function(activityID) {
        Gm.sendCmdHttp(MSGCode.OP_ACTIVITY_BUYGROW_C)
    },
    vipReward:function(id,type) {
        Gm.sendCmdHttp(MSGCode.OP_ACTIVITY_REWARD_C,{activityId:id,type:type})
    },
    vipPackage:function(vipPackageId) {
        Gm.sendCmdHttp(MSGCode.OP_ACTIVITY_BUY_VIPPACKET_C,{vipPackageId:vipPackageId})
    },
    reward(atyId){
        Gm.sendCmdHttp(MSGCode.OP_ACTIVITY_REWARD_C,{activityId:atyId})
    },

    firstPayReward(atyId){
        Gm.sendCmdHttp(MSGCode.OP_ACTIVITY_REWARD_C,{firstPayId:atyId})
    },

    anniversary(type){
        Gm.sendCmdHttp(MSGCode.OP_ACT_REWARD_C,{type:type})
    }
});
