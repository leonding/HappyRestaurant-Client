var HeroInfo = require("HeroInfo")
cc.Class({
    properties: {
       
    },
    ctor:function(){
        this.clearData()
    },
    clearData:function(){
        this.isHas = false
        this.dataList = []
    },
    setData(data){
        this.dataList[data.shopType] = data
    },
    getData(shopType){
        return this.dataList[shopType]
    },
    addBuyId(shopType,buyId,count){
        var data = this.getData(shopType)
        if (data){
            var buyShopItem = this.getBuyShopItem(shopType,buyId)
            if (buyShopItem.count == 0){
                data.buyShopItem.push(buyShopItem)
            }
            buyShopItem.count = buyShopItem.count + count
        }
    },
    getBuyShopItem(shopType,buyId){
        var data = this.getData(shopType)
        if (data){
            var buyShopItem = Func.forBy(data.buyShopItem,"buyShopId",buyId)
            if (buyShopItem){
                if (shopType != ConstPb.ShopType.SHOP_LIMIT && shopType != ConstPb.ShopType.SHOP_ORE){
                    buyShopItem.count = 1
                }
                return buyShopItem
            }
        }
        return {buyShopId:buyId,count:0}
    },
    getSurplusTime(shopType){
        var data = this.getData(shopType)
        if (data){
            if (shopType == ConstPb.ShopType.SHOP_LIMIT || shopType == ConstPb.ShopType.SHOP_ORE){
                if (data.nextRefreshTime == null){
                    data.nextRefreshTime = Func.dealConfigTime(Gm.config.getEventGroup(ConstPb.ShopType.SHOP_LIMIT).eventEnd)  
                }
            }
            return Func.translateTime(data.nextRefreshTime,true)
        }
    },
    getEquiRedHeros(equip){
        var list = []
        var heros = Gm.heroData.getBossLineHeros()
        var equipConf = Gm.config.getEquip(equip.baseId)
        for (const key in heros) {
            const v = heros[key];
            var hero = Gm.heroData.getHeroById(v)
            if (hero){
                if ( equipConf.jobLimit == 0 || Gm.config.getHero(hero.baseId).job == equipConf.jobLimit){
                    var nowEquip = hero.getEquipByPart(equipConf.part)
                    if (nowEquip){
                        var nowConf = Gm.config.getEquip(nowEquip.baseId)
                        if (equipConf.quality > nowConf.quality || equipConf.level > nowConf.level){
                            list.push(v)
                        }
                    }else{
                        list.push(v)
                    }
                }
            }
        }
        return list
    },
    isEquipChipRed(baseId,count){
        var conf = Gm.config.getItem(baseId)
        if (conf && conf.type == 104) {//装备碎片
            var num = count || 0
            var nowNum = Gm.bagData.getNum(baseId)
            if (num + nowNum >= conf.need_chip){
                return true
            }
        }
        return false
    },
});
