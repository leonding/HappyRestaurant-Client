var MSGCode = require("MSGCode")
MSGCode.proto[MSGCode.OP_WEAR_EQUIP_C]= "Equip.OPWearEquip"
MSGCode.proto[MSGCode.OP_WEAR_EQUIP_S]= "Equip.OPWearEquipRet"
MSGCode.proto[MSGCode.OP_UNWEAR_EQUIP_C]= "Equip.OPUnWearEquip"
MSGCode.proto[MSGCode.OP_UNWEAR_EQUIP_S]= "Equip.OPUnWearEquipRet"
MSGCode.proto[MSGCode.OP_SELL_EQUIP_C]= "Equip.OPSellEquip"
MSGCode.proto[MSGCode.OP_SELL_EQUIP_S]= "Equip.OPSellEquipRet"
MSGCode.proto[MSGCode.OP_SMELT_EQUIP_C]= "Equip.OPSmeltEquip"
MSGCode.proto[MSGCode.OP_SMELT_EQUIP_S]= "Equip.OPSmeltEquipRet"
MSGCode.proto[MSGCode.OP_SMELT_MAKE_EQUIP_SHOW_C]= "Equip.OPSmeltMakeEquipShow"
MSGCode.proto[MSGCode.OP_SMELT_MAKE_EQUIP_SHOW_S]= "Equip.OPSmeltMakeEquipShowRet"
MSGCode.proto[MSGCode.OP_SMELT_REFRESH_C]= "Equip.OPSmeltRefresh"
MSGCode.proto[MSGCode.OP_SMELT_REFRESH_S]= "Equip.OPSmeltRefreshRet"
MSGCode.proto[MSGCode.OP_SMELT_MAKE_EQUIP_C]= "Equip.OPSmeltMakeEquip"
MSGCode.proto[MSGCode.OP_SMELT_MAKE_EQUIP_S]= "Equip.OPSmeltMakeEquipRet"

MSGCode.proto[MSGCode.OP_STRENGTHEN_EQUIP_C]= "Equip.OPStrengthenEquip"
MSGCode.proto[MSGCode.OP_STRENGTHEN_EQUIP_S]= "Equip.OPStrengthenEquipRet"
MSGCode.proto[MSGCode.OP_WASH_EQUIP_C]= "Equip.OPWashEquip"
MSGCode.proto[MSGCode.OP_WASH_EQUIP_S]= "Equip.OPWashEquipRet"

MSGCode.proto[MSGCode.OP_GODLY_DEVOUR_C]= "Equip.OPGodlyDevour"
MSGCode.proto[MSGCode.OP_GODLY_DEVOUR_S]= "Equip.OPGodlyDevourRet"
MSGCode.proto[MSGCode.OP_GODLY_FUSE_C]= "Equip.OPGodlyFuse"
MSGCode.proto[MSGCode.OP_GODLY_FUSE_S]= "Equip.OPGodlyFuseRet"
MSGCode.proto[MSGCode.OP_GODLY_INHERIT_C]= "Equip.OPGodlyInherit"
MSGCode.proto[MSGCode.OP_GODLY_INHERIT_S]= "Equip.OPGodlyInheritRet"
MSGCode.proto[MSGCode.OP_CHIP_MAKE_EQUIP_C]= "Equip.OPChipMakeEquip"
MSGCode.proto[MSGCode.OP_CHIP_MAKE_EQUIP_S]= "Equip.OPChipMakeEquipRet"
MSGCode.proto[MSGCode.OP_CHIP_EXCHANGE_EQUIPCOIN_C]= "Equip.OPChipExchangeEquipCoin"
MSGCode.proto[MSGCode.OP_CHIP_EXCHANGE_EQUIPCOIN_S]= "Equip.OPChipExchangeEquipCoinRet"
MSGCode.proto[MSGCode.OP_SPLIT_SUIT_C]= "Equip.OPSplitSuit"
MSGCode.proto[MSGCode.OP_SPLIT_SUIT_S]= "Equip.OPSplitSuitRet"
MSGCode.proto[MSGCode.OP_SUIT_UPLEVEL_C]= "Equip.OPSuitUpLevel"
MSGCode.proto[MSGCode.OP_SUIT_UPLEVEL_S]= "Equip.OPSuitUpLevelRet"
MSGCode.proto[MSGCode.OP_OPEN_GEM_C]= "Equip.OPOpenGem"
MSGCode.proto[MSGCode.OP_OPEN_GEM_S]= "Equip.OPOpenGemRet"
MSGCode.proto[MSGCode.OP_WEAR_GEM_C]= "Equip.OPWearGem"
MSGCode.proto[MSGCode.OP_WEAR_GEM_S]= "Equip.OPWearGemRet"

MSGCode.proto[MSGCode.OP_ENCHANT_C]= "Equip.OPEnchant"
MSGCode.proto[MSGCode.OP_ENCHANT_S]= "Equip.OPEnchantRet"

cc.Class({
    properties: {
        
    },
    wear:function(hero,eIds,type,isInherit){
        var heroId = 0 
        if(hero){
            heroId = hero.heroId
        }
        Gm.audio.playEffect("music/12_equip_wear")
        Gm.sendCmdHttp(MSGCode.OP_WEAR_EQUIP_C,{heroId:heroId,equipId:eIds,type:type||0,isInherit:isInherit || false})
    },
    unWear:function(hero,eIds){
        var heroId = 0 
        if(hero){
            heroId = hero.heroId
        }
        Gm.audio.playEffect("music/13_equip_release")
        Gm.sendCmdHttp(MSGCode.OP_UNWEAR_EQUIP_C,{heroId:heroId,equipId:eIds})
    },
    sell:function(eIds){
        this.sellIds = eIds
        Gm.sendCmdHttp(MSGCode.OP_SELL_EQUIP_C,{equipIds:eIds})
    },
    smelt:function(eIds,qs){
        this.smeltIds = eIds
        Gm.sendCmdHttp(MSGCode.OP_SMELT_EQUIP_C,{equipIds:eIds,quality:qs})
    },
    makeShow:function(){
        Gm.sendCmdHttp(MSGCode.OP_SMELT_MAKE_EQUIP_SHOW_C)
    },
    makeRefresh:function(type){
        Gm.sendCmdHttp(MSGCode.OP_SMELT_REFRESH_C,{refreshType:type||1})
    },
    make:function(type,baseId,count){
        this.makeType = type
        Gm.sendCmdHttp(MSGCode.OP_SMELT_MAKE_EQUIP_C,{makeType:type,baseId:baseId,count:count})
    },
    qh:function(hero,equipId,type){
        var heroId = 0 
        if(hero){
            heroId = hero.heroId
        }
        this.heroId = heroId
        this.equipId = equipId
        Gm.sendCmdHttp(MSGCode.OP_STRENGTHEN_EQUIP_C,{heroId:heroId,equipId:equipId,type:type})
    },
    xl:function(hero,equipId,washType,lockAttr){
        var heroId = 0 
        if(hero){
            heroId = hero.heroId
        }
        this.heroId = heroId
        this.equipId = equipId
        Gm.sendCmdHttp(MSGCode.OP_WASH_EQUIP_C,{heroId:heroId,equipId:equipId,washType:washType,lockAttr:lockAttr||[]})
    },
    devour:function(hero,equipId,targetEquipId,godlyStones){
        var heroId = 0 
        if(hero){
            heroId = hero.heroId
        }
        this.heroId = heroId
        this.equipId = equipId
        this.targetEquipId = targetEquipId
        Gm.sendCmdHttp(MSGCode.OP_GODLY_DEVOUR_C,{heroId:heroId,targetEquipIds:targetEquipId,equipId:equipId,godlyStone:godlyStones})
    },
    fuse:function(hero,equipId,targetEquipId){
        var heroId = 0 
        if(hero){
            heroId = hero.heroId
        }
        this.heroId = heroId
        this.equipId = equipId
        this.targetEquipId = targetEquipId
        Gm.sendCmdHttp(MSGCode.OP_GODLY_FUSE_C,{heroId:heroId,targetEquipId:targetEquipId,mainEquipId:equipId})
    },
    inherit:function(hero,equipId,targetEquipId,targetHeroId){
        var heroId = 0 
        if(hero){
            heroId = hero.heroId
        }
        this.heroId = heroId
        this.equipId = equipId
        this.targetEquipId = targetEquipId
        this.targetHeroId = targetHeroId || 0
        Gm.sendCmdHttp(MSGCode.OP_GODLY_INHERIT_C,{heroId:heroId,targetEquipId:targetEquipId,equipId:equipId,targetHeroId:this.targetHeroId})
    },
    chipMake:function(propId){
        Gm.sendCmdHttp(MSGCode.OP_CHIP_MAKE_EQUIP_C,{propId:propId})
    },
    openGem:function(hero,equipId){
        var heroId = 0 
        if(hero){
            heroId = hero.heroId
        }
        this.heroId = heroId
        this.equipId = equipId
        Gm.sendCmdHttp(MSGCode.OP_OPEN_GEM_C,{heroId:heroId,equipId:equipId})
    },
    waerGem:function(hero,equipId,type,gemId,pos){
        var heroId = 0 
        if(hero){
            heroId = hero.heroId
        }
        this.heroId = heroId
        this.equipId = equipId
        this.gemType = type
        this.pos = pos
        if (gemId > 0){
            var bag = Gm.bagData.getItemById(gemId)
            this.gemId = bag.baseId
        }
        Gm.sendCmdHttp(MSGCode.OP_WEAR_GEM_C,{heroId:heroId,equipId:equipId,type:type,gemId:gemId||0,pos:pos})
    },
    chipExchange:function(chipId,count){
        this.chipId = chipId
        Gm.sendCmdHttp(MSGCode.OP_CHIP_EXCHANGE_EQUIPCOIN_C,{chipId:chipId,count:count})
    },
    splitSuit:function(equipIds){
        this.equipIds = equipIds
        Gm.sendCmdHttp(MSGCode.OP_SPLIT_SUIT_C,{equipIds:equipIds})
    },
    suitUp:function(hero,equipId,propChip){
        var heroId = 0
        if(hero){
            heroId = hero.heroId
        }
        this.heroId = heroId
        this.equipId = equipId

        MSGCode.proto['test_002']   = "Equip.SuitPropChip"
        var list = []
        for (var i = 0; i < propChip.length; i++) {
            var v = propChip[i]
            var pb = Gm.netLogic.protoCode.encode('test_002',{itemId:v.baseId,count:v.count})
            list.push(pb)
        }
        var dd = {heroId:heroId,equipId:equipId,SuitPropChip:list}
        Gm.sendCmdHttp(MSGCode.OP_SUIT_UPLEVEL_C,dd)
    },
    rune(hero,equipId,runeId){
        var heroId = 0 
        if(hero){
            heroId = hero.heroId
        }
        this.heroId = heroId
        this.equipId = equipId
        Gm.sendCmdHttp(MSGCode.OP_ENCHANT_C,{heroId:heroId,equipId:equipId,runeId:runeId})
    },
});
