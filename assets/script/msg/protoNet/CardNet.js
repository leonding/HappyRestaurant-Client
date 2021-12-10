var MSGCode = require("MSGCode")

MSGCode.proto[MSGCode.OP_DRAW_CARD_INFO_C]        = "Card.OPDrawCardInfo"
MSGCode.proto[MSGCode.OP_DRAW_CARD_INFO_S]        = "Card.OPDrawCardInfoRet"

MSGCode.proto[MSGCode.OP_DRAW_CARD_C]        = "Card.OPDrawCard"
MSGCode.proto[MSGCode.OP_DRAW_CARD_S]        = "Card.OPDrawCardRet"

MSGCode.proto[MSGCode.OP_USE_OFFER_C]        = "Card.OPUseOffer"
MSGCode.proto[MSGCode.OP_USE_OFFER_S]        = "Card.OPUseOfferRet"

MSGCode.proto[MSGCode.OP_DRAW_EXCHANGE_C]        = "Card.OPDrawExChange"
MSGCode.proto[MSGCode.OP_DRAW_EXCHANGE_S]        = "Card.OPDrawExChangeRet"

MSGCode.proto[MSGCode.OP_DRAW_OPEN_BOX_S]        = "Card.OPDrawOpenBoxRet"
MSGCode.proto[MSGCode.OP_SET_WISH_LIST_S]        = "Card.OPSetWishList"


MSGCode.proto[MSGCode.OP_SELECT_SINGLE_HERO_C]        = "Card.OPSelectSingleHero"
MSGCode.proto[MSGCode.OP_SELECT_SINGLE_HERO_S]        = "Card.OPSelectSingleHeroRet"

cc.Class({
    properties: {
        
    },
    sendDrawCardInfo:function(activityID) {
        if (!Gm.userInfo.isLogin()){
            return
        }
        Gm.sendCmdHttp(MSGCode.OP_DRAW_CARD_INFO_C,{activityID:activityID})
    },

    sendDrawCard:function(fieldId,drawType,quality) {
        Gm.loading(null,true)
        setTimeout(() => {
             Gm.removeLoading()
        }, 500);
        Gm.lotteryData.setBoxShow()
        this.m_iDrawField = fieldId
        this.m_iDrawQuality = quality
        this.m_iDrawType = drawType
        Gm.sendCmdHttp(MSGCode.OP_DRAW_CARD_C,{fieldId:fieldId,drawType:drawType})
    },

    sendUseOffer:function(activityID,itemId) {
        this.m_iOfferItem = itemId
        Gm.sendCmdHttp(MSGCode.OP_USE_OFFER_C,{activityID:activityID,itemId:itemId})
    },

    sendDrawExChange:function(itemGroup,itemId,count) {
        Gm.sendCmdHttp(MSGCode.OP_DRAW_EXCHANGE_C,{itemGroup:itemGroup,itemId:itemId,count:count})
    },

    sendSetWishList:function(heroBaseId){
        Gm.sendCmdHttp(MSGCode.OP_SET_WISH_LIST_S,{heroBaseId:heroBaseId})
    },

    sendSetHeroAndJob:function(){
        Gm.sendCmdHttp(MSGCode.OP_SELECT_SINGLE_HERO_C,{heroBaseId:Gm.lotteryData.getTzHero(),equipJob:Gm.lotteryData.getTzJob()})
    }
});
