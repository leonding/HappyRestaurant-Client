var MSGCode = require("MSGCode")
MSGCode.proto[MSGCode.OP_VILLA_BOOKS_C]    = "Villa.VillaHeroBooks"
MSGCode.proto[MSGCode.OP_VILLA_BOOKS_S]    = "Villa.VillaHeroBooksRet"

MSGCode.proto[MSGCode.OP_VILLA_ACT_C]    = "Villa.VillaActHero"
MSGCode.proto[MSGCode.OP_VILLA_ACT_S]    = "Villa.VillaActHeroRet"

MSGCode.proto[MSGCode.OP_VILLA_FEEL_C]    = "Villa.VillaFeelingUp"
MSGCode.proto[MSGCode.OP_VILLA_FEEL_S]    = "Villa.VillaFeelingUpRet"

cc.Class({
    properties: {
        
    },
    get:function(){
        Gm.sendCmdHttp(MSGCode.OP_VILLA_BOOKS_C)
     },
     active(qualityId){
        Gm.sendCmdHttp(MSGCode.OP_VILLA_ACT_C,{qualityId:qualityId})
     },
    feel:function(baseId,itemId){
        this.baseId = baseId
        this.itemId = itemId
        Gm.sendCmdHttp(MSGCode.OP_VILLA_FEEL_C,{baseId:baseId,itemId:itemId})
     },
     
  
});
