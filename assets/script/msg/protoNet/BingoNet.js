var MSGCode = require("MSGCode")

MSGCode.proto[MSGCode.OP_BINGO_SITE_REWARD_S]        = "Activity.OPBingoSiteRewardRet"
MSGCode.proto[MSGCode.OP_BINGO_FLIP_C]               = "Activity.OPBingoFlip"
MSGCode.proto[MSGCode.OP_BINGO_FLIP_S]               = "Activity.OPBingoFlipRet"
MSGCode.proto[MSGCode.OP_RECEIVE_BINGO_REWARD_C]     = "Activity.OPReceiveBingoReward"
MSGCode.proto[MSGCode.OP_RECEIVE_BINGO_REWARD_S]     = "Activity.OPReceiveBingoRewardRet"
MSGCode.proto[MSGCode.OP_SELECT_BINGO_REWARD_C]      = "Activity.OPSelectBingoReward"
MSGCode.proto[MSGCode.OP_BUY_BINGO_ITEM_C]           = "Activity.OPBuyBingoItem"
MSGCode.proto[MSGCode.OP_BUY_BINGO_ITEM_S]           = "Activity.OPBuyBingoItemRet"

cc.Class({
    receiveTurnReward(turn){
        Gm.sendCmdHttp(MSGCode.OP_RECEIVE_BINGO_REWARD_C,{turn:turn})
    },

    openCard(openCardArr){
        Gm.sendCmdHttp(MSGCode.OP_BINGO_FLIP_C,{index:openCardArr})
    },

    selectReward(turn,index){
        Gm.sendCmdHttp(MSGCode.OP_SELECT_BINGO_REWARD_C,{minTurn:turn,index:index})
    },

    buyBingoItem(count){
        if(count > 0){
            Gm.sendCmdHttp(MSGCode.OP_BUY_BINGO_ITEM_C,{count:count})
        }
    }
})





