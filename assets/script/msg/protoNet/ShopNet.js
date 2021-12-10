var MSGCode = require("MSGCode")
MSGCode.proto[MSGCode.OP_SHOP_INFO_C]        = "Shop.OPShopInfo"
MSGCode.proto[MSGCode.OP_SHOP_INFO_S]        = "Shop.OPShopInfoRet"
MSGCode.proto[MSGCode.OP_SHOP_BUY_ITEM_C]        = "Shop.OPShopBuyItem"
MSGCode.proto[MSGCode.OP_SHOP_BUY_ITEM_S]        = "Shop.OPShopBuyItemRet"
MSGCode.proto[MSGCode.OP_SHOP_REFRESH_ITEM_C]        = "Shop.OPShopRefreshItem"
MSGCode.proto[MSGCode.OP_SHOP_REFRESH_ITEM_S]        = "Shop.OPShopRefreshItemRet"
MSGCode.proto[MSGCode.OP_SHOP_BUY_SILVER_C]        = "Shop.OPShopBuySilver"
MSGCode.proto[MSGCode.OP_SHOP_BUY_SILVER_S]        = "Shop.OPShopBuySilverRet"

MSGCode.proto[MSGCode.OP_SHOP_BUY_GEM_C]        = "Shop.OPShopBuyGem"
MSGCode.proto[MSGCode.OP_SHOP_BUY_GEM_S]        = "Shop.OPShopBuyGemRet"
cc.Class({
    properties: {
        
    },
    getInfo:function(shopTypes){
        Gm.sendCmdHttp(MSGCode.OP_SHOP_INFO_C,{shopType:shopTypes})
    },
    buyItem:function(type,id,shopType,count){
        this.buyType = type
        this.buyId = id
        this.shopType = shopType
        this.count = count
        Gm.sendCmdHttp(MSGCode.OP_SHOP_BUY_ITEM_C,{type:type,id:id,shopType:shopType,count:count})
    },
    refreshItem:function(shopType){
        this.shopType = shopType
        Gm.sendCmdHttp(MSGCode.OP_SHOP_REFRESH_ITEM_C,{shopType:shopType})
    },
    buySilver:function(type){
        Gm.sendCmdHttp(MSGCode.OP_SHOP_BUY_SILVER_C,{type:type})
    },
    buyGem:function(baseId,count){
        Gm.sendCmdHttp(MSGCode.OP_SHOP_BUY_GEM_C,{baseId:baseId,count:count})
    }

});
