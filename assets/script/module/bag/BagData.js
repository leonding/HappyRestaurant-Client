var HeroInfo = require("HeroInfo")
cc.Class({
    properties: {
       
    },
    ctor:function(){
        this.clearData()
    },
    clearData:function(){
        this.items = []//道具
        this.equips = [] //装备
        this.smeltData = null
    },
    
    isBagSize:function(){
        return this.equips.length >= Gm.userInfo.pocketSize
    },
    getSurplusBagSize(){
        return Gm.userInfo.pocketSize - this.equips.length
    },
    setSmeltData:function(data){
        this.smeltData = data
    },
    getSmeltEquip:function(){
        return this.smeltData.smeltEquipInfo[0]
    },
    initItems:function(items){
        this.items = items || []
    },
    initEquips:function(list){
        this.equips = list || []
    },
    getItemById:function(id){
        return Func.forBy(this.items,"id",id)
    },
    getItemByBaseId:function(id){
        return Func.forBy(this.items,"baseId",id)
    },
    getNum:function(baseId){
        var item = this.getItemByBaseId(baseId)
        return item?item.count:0
    },
    subItem:function(data){
        var item = Gm.bagData.getItemById(data.id)
        if (item){
            item.count = item.count - data.count
            if (item.count <=0){
                Func.forRemove(this.items,"id",data.id)
            }
        }
    },
    changeItem:function(data){
        var item = Gm.bagData.getItemById(data.id)
        if (item){
            item.count = item.count + data.count
        }else{
            this.items.push(data)
        }
    },
    addEquip:function(equip){
        this.equips.push(equip)
    },
    checkEquip:function(limit){
        var tmpLost = Gm.userInfo.pocketSize - this.equips.length
        return tmpLost <= limit
    },
    removeEquips:function(ids){
        if (typeof(ids) == "number"){
            ids = [ids]
        }
        for (let index = 0; index < ids.length; index++) {
            const id = ids[index];
            Func.forRemove(this.equips,"equipId",id)
        }
    },
    getEquitById:function(id){
        return Func.forBy(this.equips,"equipId",id)
    },
    getEquitByBaseId:function(id){
        return Func.forBy(this.equips,"baseId",id)
    },
    getAllItems:function(){
        return this.items
    },
    getAllItemsNoSp:function(){
        var list = []
        for (let index = 0; index < this.items.length; index++) {
            const v = this.items[index];
            var con = Gm.config.getItem(v.baseId)
            if (con && con.type != ConstPb.propsType.SUIT_CHIP && con.type != ConstPb.propsType.HERO_CHIP_PACKAGE){
                list.push(v)
            }
        }
        return list
    },
    getItemsByType:function(type){
        if (typeof(type) != "object"){
            type = [type]
        }
        var tab = {}
        for (let index = 0; index < type.length; index++) {
            const v = type[index];
            tab[v] = true
        }
        var list = []
        for (let index = 0; index < this.items.length; index++) {
            const v = this.items[index];
            var con = Gm.config.getItem(v.baseId)
            if (con && tab[con.type]){
                list.push(v)
            }
        }
        return list
    },
    getAllSuitExp(){
        var sps = Gm.bagData.getItemsByType(104)
        var list = Gm.bagData.getItemsByType(134)
        if (list.length > 0){
            sps.unshift(list[0])
        }
        var exp = 0
        for (var i = 0; i < sps.length; i++) {
            sps[i]
            var itemConf = Gm.config.getItem(sps[i].baseId)
            exp = exp + itemConf.train_exp * sps[i].count
        }
        return exp
    },
    getGemByPart:function(part){
        var list = []
        for (let index = 0; index < this.items.length; index++) {
            const v = this.items[index];
            var con = Gm.config.getItem(v.baseId)
            if (con && con.type == 2){
                var conf = Gm.config.getGem(v.baseId)
                if (Func.forBy(conf.gem_part,"id",part)){
                    list.push(v)
                }
                // if (conf.gem_part == part){
                //     list.push(v)
                // }
            }
        }
        return list
    },
    getItemsByQuality:function(quality){
        var list = []
        for (let index = 0; index < this.items.length; index++) {
            const v = this.items[index];
            var con = Gm.config.getItem(v.baseId)
            if (con.quality == quality){
                list.push(v)
            }
        }
        return list
    },
    getEquipsByQuality:function(quality){
        if (quality == 6){
            return this.getGodly()
        }
        var list = []
        for (let index = 0; index < this.equips.length; index++) {
            const v = this.equips[index];
            var con = Gm.config.getEquip(v.baseId)
            if (con.quality == quality){
                list.push(v)
            }
        }
        return list
    },
    getEquipsByPart:function(part,job){
        var list = []
        for (let index = 0; index < this.equips.length; index++) {
            const v = this.equips[index];
            var con = Gm.config.getEquip(v.baseId)
            if (con.part == part ){
                if ((job == null || job == con.jobLimit || con.jobLimit == 0)){
                    list.push(v)
                }
            }
        }
        return list
    },
    getCanInheritEquip:function(equip,part){
        var list = []
        //人身上的装备
        var allHeros = Gm.heroData.getAll()
        for (let index = 0; index < allHeros.length; index++) {
            const hero = allHeros[index];
            var heroEquip = hero.getEquipByPart(part)
            if (heroEquip && Func.isCanInherit(equip,heroEquip)){
                heroEquip.heroId = hero.heroId
                list.push(heroEquip)
            }
        }
        for (let index = 0; index < this.equips.length; index++) {
            const v = this.equips[index];
            var con = Gm.config.getEquip(v.baseId)
            if (con.part == part && Func.isCanInherit(equip,v)){
                list.push(v)
            }
        }
        return list
    },
    
    getCanSplitSuit:function(){
        var list = []
        for (let index = 0; index < this.equips.length; index++) {
            const v = this.equips[index];
            if (v.godlyAttrId > 0 || Func.isHasGem(v)){
                continue
            }
            var con = Gm.config.getEquip(v.baseId)
            if(con.isSuit >0 ){
                list.push(v)
            }
        }
        return list
    },
    getAllEquips:function(){
        return this.equips
    },
    getCanSmelt:function(isSort){
        var list = []
        for (let index = 0; index < this.equips.length; index++) {
            const v = this.equips[index];
            var conf = Gm.config.getEquip(v.baseId)
            if (!EquipFunc.isGodly(v) && !Func.isHasGem(v) && conf.isSuit == 0){
                list.push(v)
            }
        }
        if (isSort){
            list.sort(function(a,b){
                var aConf =  Gm.config.getEquip(a.baseId)
                var bConf =  Gm.config.getEquip(b.baseId)
                if (aConf.quality == bConf.quality){
                    return a.score - b.score
                }
                return aConf.quality - bConf.quality
            })
        }
        return list
    },
    getCanSmeltByQuality:function(quality){
        var list = this.getCanSmelt()
        var tab = []
        for (let index = 0; index < list.length; index++) {
            const v = list[index];
            var conf = Gm.config.getEquip(v.baseId)
            if (conf.quality == quality){
                tab.push(v)
            }
        }
        return tab
    },
    itemSort:function(list){
        list.sort(function(a,b){
            var e1 = Gm.config.getItem(a.baseId)
            var e2 = Gm.config.getItem(b.baseId)
            return e1.show_priority - e2.show_priority
        })
    },
    equipSort:function(list,isNode){
        var godlyNum = function(equip){
            var godly = {}
            godly.num = 0 
            if (equip.godlyAttr[0].level > 0 ){
                godly.num = godly.num + 1
                godly.type = Gm.config.getGodly(equip.godlyAttr[0].level,equip.godlyAttr[0].attrId).godlyType
            }
            if (equip.godlyAttr[1].level > 0 ){
                godly.num = godly.num + 1
                if(godly.type == null){
                    godly.type = Gm.config.getGodly(equip.godlyAttr[1].level,equip.godlyAttr[1].attrId).godlyType
                }
            }
            return godly
        }

        var suitSort = function(a,b){
            var e1 = Gm.config.getEquip(a.baseId)
            var e2 = Gm.config.getEquip(b.baseId)
            if (e1.isSuit > 0 && e2.isSuit >0 || e1.isSuit==0 && e2.isSuit ==0){//套装
                if (e1.quality == e2.quality){//品质
                    if (e1.level == e2.level){//等级
                        if (a.strength == b.strength){//强化等级
                            if (e1.part == e2.part){//部位
                                var job1 = e1.jobLimit || 100 //通用放最后
                                var job2 = e2.jobLimit || 100
                                return job1 - job2
                            }else{
                                return e1.part - e2.part
                            }
                        }else{
                            return b.strength - a.strength
                        }
                    }else{
                        return e2.level - e1.level 
                    }
                }else{
                    return e2.quality - e1.quality
                }
            }else{
                if (e1.isSuit > 0 ){
                    return -1
                }
                return 1
            }
        }
        list.sort(function(a1,b1){
            var a
            var b
            if (isNode){
                a = a1.getComponent("BagPageItem").data
                b = b1.getComponent("BagPageItem").data
            }else{
                a = a1
                b = b1
            }
            
            var godly1 = godlyNum(a)
            var godly2 = godlyNum(b)
            if (godly1.num  == godly2.num ){
                if (godly1.num == 0 || godly1.num == 2 || (godly1.num == 1 && godly1.type == godly2.type)){//双神器或者单神器属性相同
                    return suitSort(a,b)
                }
                return godly1.type - godly2.type
            }else{
                return godly1.num >godly2.num ?-1:1
            }
        })
    },
    smeltSort(list){
        var heros = Gm.heroData.getBossLineHeros()
        for (let index = 0; index < list.length; index++) {
            const v = list[index];
            var conf = Gm.config.getEquip(v.baseId)
            v.isNeed = false
            if (EquipFunc.isGodly(v) || Func.isHasGem(v)){
                v.isNeed = true
                v.isNeedIndex = 1
            }else{
                for (const key in heros) {
                    const heroId = heros[key];
                    if (heroId > 0){
                        var hero = Gm.heroData.getHeroById(heroId)
                        if (conf.jobLimit == 0 || conf.jobLimit == Gm.config.getHero(hero.baseId).job){
                            var nowEquip = hero.getEquipByPart(conf.part)
                            if (nowEquip == null || (nowEquip && v.score > nowEquip.score)){
                                v.isNeed = true
                                v.isNeedIndex = 2
                            }
                        }
                    }
                }
            }
        }

        var godlyNum = function(equip){
            var godly = {}
            godly.num = 0 
            if (equip.godlyAttr[0].level > 0 ){
                godly.num = godly.num + 1
                godly.type = Gm.config.getGodly(equip.godlyAttr[0].level,equip.godlyAttr[0].attrId).godlyType
            }
            if (equip.godlyAttr[1].level > 0 ){
                godly.num = godly.num + 1
                if(godly.type == null){
                    godly.type = Gm.config.getGodly(equip.godlyAttr[1].level,equip.godlyAttr[1].attrId).godlyType
                }
            }
            return godly
        }
        var suitSort = function(a,b){
            var e1 = Gm.config.getEquip(a.baseId)
            var e2 = Gm.config.getEquip(b.baseId)
            if (e1.isSuit > 0 && e2.isSuit >0 || e1.isSuit==0 && e2.isSuit ==0){//套装
                if (e1.quality == e2.quality){//品质
                    if (e1.level == e2.level){//等级
                        if (a.strength == b.strength){//强化等级
                            if (e1.part == e2.part){//部位
                                var job1 = e1.jobLimit || 100 //通用放最后
                                var job2 = e2.jobLimit || 100
                                return job1 - job2
                            }else{
                                return e1.part - e2.part
                            }
                        }else{
                            return b.strength - a.strength
                        }
                    }else{
                        return e2.level - e1.level 
                    }
                }else{
                    return e2.quality - e1.quality
                }
                
                // if (a.isNeed == b.isNeed){
                //     if (a.isNeedIndex == b.isNeedIndex){
                        // if (e1.quality == e2.quality){//品质
                        //         if (e1.part == e2.part){//部位
                        //             return e1.level - e2.level //等级
                        //         }else{
                        //             return e1.part - e2.part
                        //         }
                        // }else{
                        //     return e2.quality - e1.quality
                        // }
                //     }else{
                //         return a.isNeedIndex - b.isNeedIndex
                //     }
                // }else{
                //     return a.isNeed?-1:1
                // }
            }else{
                return e1.isSuit > 0?-1:1
            }
            
        }

        list.sort(function(a1,b1){
            var a = a1
            var b = b1

            var godly1 = godlyNum(a)
            var godly2 = godlyNum(b)
            if (godly1.num  == godly2.num ){
                if (godly1.num == 0 || godly1.num == 2 || (godly1.num == 1 && godly1.type == godly2.type)){//双神器或者单神器属性相同
                    return suitSort(a,b)
                }
                return godly1.type - godly2.type
            }else{
                return godly1.num >godly2.num ?-1:1
            }
        })
    },
    equipSpSort(list){
        list.sort(function(a,b){
            var item1 = Gm.config.getItem(a.baseId)
            var item2 = Gm.config.getItem(b.baseId)

            var has1 = a.count >= item1.need_chip
            var has2 = b.count >= item2.need_chip
            if (has1 == has2){
                var e1 = Gm.config.getEquip(item1.equip)
                var e2 = Gm.config.getEquip(item2.equip)
                if (has1){//可合成
                    return e2.quality - e1.quality
                }else{
                    if (e2.quality == e1.quality){
                        return b.count - a.count
                    }
                    return e2.quality - e1.quality
                }
                // if (e1.quality == e2.quality){//品质
                //     if (e1.level == e2.level){//等级
                //         if (e1.part == e2.part){//部位
                //             var job1 = e1.jobLimit || 100 //职业-通用放最后
                //             var job2 = e2.jobLimit || 100
                //             return job1 - job2
                //         }else{
                //             return e1.part - e2.part
                //         }
                //     }else{
                //         return e2.level - e1.level 
                //     }
                // }else{
                //     return e2.quality - e1.quality
                // }
            }else{
                return has1?-1:1
            }
            
        })
    },
    getNewItem:function(id,baseId,count){
        var tab = {}
        tab.id = id
        tab.baseId = baseId
        tab.count = count
        tab.level = 0 
        tab.status = 0 
        tab.lucky = 0
        return tab
    },
    getGodly(noGem){
        noGem = noGem || false
        var list = []
        for (let index = 0; index < this.equips.length; index++) {
            const v = this.equips[index];
            var conf = Gm.config.getEquip(v.baseId)
            if(conf.isSuit >0 ){
                continue
            }
            if (EquipFunc.isGodly(v) &&  !EquipFunc.isGem(v)){
                list.push(v)
            }
        }
        return list
    },
    getCanGodly(){

    },
});
