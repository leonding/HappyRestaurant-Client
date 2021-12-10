var CoreLogic = require("CoreLogic")
cc.Class({
    extends: CoreLogic,
    properties: {
        
    },
    ctor:function(){

    },
    register:function(){
        this.events[Events.LOGIN_SUC]       = this.onLogicSuss.bind(this)
        this.events[MSGCode.OP_PROPS_INFO_S] = this.onNetBagInfos.bind(this)
        this.events[MSGCode.OP_PROPS_USE_S] = this.onNetBagUse.bind(this)
        this.events[MSGCode.OP_BAG_EQUIP_INFO_S] = this.onNetBagEquip.bind(this)
        this.events[MSGCode.OP_BAG_BUY_POCKET_S] = this.onNetBagBuyPocket.bind(this)

        //-------------------装备---------------
        this.events[MSGCode.OP_WEAR_EQUIP_S] = this.onNetWearEquip.bind(this)
        this.events[MSGCode.OP_UNWEAR_EQUIP_S] = this.onNetUnwearEquip.bind(this)
        this.events[MSGCode.OP_SELL_EQUIP_S] = this.onNetSellEquip.bind(this)
        this.events[MSGCode.OP_SMELT_EQUIP_S] = this.onNetSmeltEquip.bind(this)
        this.events[MSGCode.OP_CHIP_MAKE_EQUIP_S] = this.onNetChipMake.bind(this)
        this.events[MSGCode.OP_CHIP_EXCHANGE_EQUIPCOIN_S] = this.onNetChipExchange.bind(this)
        this.events[MSGCode.OP_SPLIT_SUIT_S] = this.onNetSplitSuit.bind(this)
    },
    
    onLogicSuss:function(){
        // Gm.bagNet.getBag()
    },
    onNetBagInfos:function(args){
        Gm.bagData.initItems(args.hpPropsInfoSync.propsInfos)
    },
    onNetBagUse:function(args){
       // if (args.propsInfo && args.propsInfo.length > 0 ){
       //     var list = []
       //     for (let index = 0; index < args.propsInfo.length; index++) {
       //         const v = args.propsInfo[index];
       //         list.push({type:v.itemType,id:v.baseId,num:v.count})
       //     }
       //     Gm.ui.create("AwardShowView",list)
       // }
       if (args.addExp && args.addExp > 0){
            Gm.showAttr([{attrId:2001,attrValue:args.addExp}],true)
       }
       
    },
    onNetBagEquip:function(args){
        Gm.bagData.initEquips(args.equipInfos)
    },
    onNetBagBuyPocket:function(args){
        if (args.type == 1){//装备背包
            if (args.openPocketCount){
                Gm.userInfo.openPocketCount = args.openPocketCount
            }
            Gm.userInfo.pocketSize = args.pocketSize
            if (this.isView()){
                this.view.onUserInfoUpdate()
            }
            Gm.red.refreshEventState("bag")
        }else if(args.type == 2){
            Gm.userInfo.heroBagSize = args.pocketSize
            Gm.send(Events.USER_INFO_UPDATE)
        }
    },
    onNetWearEquip:function(args){
        var hero = Gm.heroData.getHeroById(args.heroId)
        for (let index = 0; index < args.equipId.length; index++) {
            const equipId = args.equipId[index];
            var equip = Func.forBy(args.equipInfos,"equipId",equipId) || Gm.bagData.getEquitById(equipId)
            if (equip == null){
                Gm.floating(Ls.get(3001))
                cc.error("wear equip error")
                return
            }
            equip.heroId = hero.heroId 
            hero.addEquip(equip)
        }
        Gm.bagData.removeEquips(args.equipId)
        this.unwearEquip(args.heroId,args.oldEquipId,args.oldEquipInfos)
        Gm.send(Events.UPDATE_HERO,{heroId:args.heroId,isEquip:true})
        // Gm.showReward(args.returnItems)
        Gm.ui.removeByName("HeroEquipInfoView")
        Gm.send(Events.BAG_UPDATE)
        Gm.red.refreshEquip()
    },
    unwearEquip:function(heroId,equipIds,oldEquipInfos){
        oldEquipInfos = oldEquipInfos || []
        var hero = Gm.heroData.getHeroById(heroId)
        for (let index = 0; index < equipIds.length; index++) {
            const equipId = equipIds[index];
            var equip = Func.forBy(oldEquipInfos,"equipId",equipId) || hero.getEquip(equipId)
            if (equip == null){
                Gm.floating(Ls.get(3002))
                cc.error("unwear equip error")
                return
            }
            equip.heroId = 0 
            Gm.bagData.addEquip(equip)
        }
        hero.removeEquip(equipIds)
    },
    onNetUnwearEquip:function(args){
        this.unwearEquip(args.heroId,args.equipId)
        Gm.ui.removeByName("HeroEquipInfoView")
        Gm.send(Events.BAG_UPDATE)
        Gm.send(Events.UPDATE_HERO,{heroId:args.heroId,isEquip:true})
        if(Gm.equipNet.openEquipInfo){
            var args = {equip:Gm.equipNet.openEquipInfo}
            Gm.ui.create("HeroEquipInfoView",args)
            Gm.equipNet.openEquipInfo = null
        }
        Gm.red.refreshEquip()
    },
    onNetSellEquip:function(args){
        Gm.bagData.removeEquips(Gm.equipNet.sellIds)
        Gm.ui.removeByName("HeroEquipInfoView")
        args.returnItems.push({itemType:ConstPb.itemType.PLAYER_ATTR,baseId:ConstPb.playerAttr.SILVER,count:args.silver})
        // Gm.showReward(args.returnItems)
    },
    onNetSmeltEquip:function(args){
        if (args.equipInfos && args.equipInfos.length > 0){
            for (let index = 0; index < args.equipInfos.length; index++) {
                const v = args.equipInfos[index];
                // args.returnItems.push({itemType:ConstPb.itemType.EQUIP,baseId:v.baseId,count:1})
            }
        }
        // if(args.smeltValue){
        //     args.returnItems.push({itemType:ConstPb.itemType.PLAYER_ATTR,baseId:ConstPb.playerAttr.SMELT_VALUE,count:args.smeltValue})
        // }
        // Gm.showReward(args.returnItems)
        if (this.isView()){
            this.view.updateList()
        }
        Gm.ui.removeByName("EquipMainView")
    },
    onNetChipMake:function(args){
        Gm.floating(Ls.get(3003))
    },
    onNetChipExchange:function(args){
        // Gm.floating(Ls.get(3004))
    },
    onNetSplitSuit:function(args){
        Gm.floating(Ls.get(3005))
        // Gm.showReward(args.returnItems)
        if (this.isView()){
            this.view.updateList()
        }
        Gm.ui.removeByName("EquipMainView")
    },
    
});
