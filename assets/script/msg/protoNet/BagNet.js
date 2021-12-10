var MSGCode = require("MSGCode")
MSGCode.proto[MSGCode.OP_PROPS_INFO_C]   = "Props.OPPropsInfo"
MSGCode.proto[MSGCode.OP_PROPS_INFO_S]   = "Props.OPPropsInfoRet"
MSGCode.proto[MSGCode.OP_PROPS_USE_C]    = "Props.OPPropsUse"
MSGCode.proto[MSGCode.OP_PROPS_USE_S]    = "Props.OPPropsUseRet"
MSGCode.proto[MSGCode.OP_BAG_BUY_POCKET_C]    = "Props.OPBuyPocket"
MSGCode.proto[MSGCode.OP_BAG_BUY_POCKET_S]    = "Props.OPBuyPocketRet"

MSGCode.proto[MSGCode.OP_BAG_EQUIP_INFO_S]= "Equip.OPBagEquipInfoRet"

cc.Class({
    properties: {
        
    },
    getBag:function(){
        Gm.sendCmdHttp(MSGCode.OP_PROPS_INFO_C)
    },
    useBag:function(id,count,opType,type,choiceIndex){
        Gm.sendCmdHttp(MSGCode.OP_PROPS_USE_C,{id:id,count:count,opType:opType||0,type:type||0,choiceIndex:choiceIndex || 0})
    },
    buyBag:function(type){
        Gm.sendCmdHttp(MSGCode.OP_BAG_BUY_POCKET_C,{type:type})
    },
});
