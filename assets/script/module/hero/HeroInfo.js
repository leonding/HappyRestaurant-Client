var strs = [5040,5041,5042]
cc.Class({
    properties: {
       
    },
    ctor:function(){
        this.fight = 0
    },
    //是否为全部数据，登录时只有id和baseid,其他数据用时取
    isFull:function(){
        return this.attribute.length > 0
    },
    setData:function(data,beSizeName){
        for (const key in data) {
            if (typeof(data[key]) != "function" && key != beSizeName){
                this[key] = data[key]
            }
        }
        this.setSkin(this.skin)
        this.updateFight()
    },
    setSkin(id){
        this.skin = id
        if (this.skin == 0 || this.skin == null){
            var heroConf = Gm.config.getHero(0,this.qualityId)
            this.skin = heroConf.skin_id
            if (this.baseId == 0){
                this.baseId = heroConf.idGroup
            }
        }
    },
    setAttrValue:function(data,noTips){
        noTips = noTips || false
        var list = []
        var newLen = data.length
        var oldLen = this.attribute.length
        if (newLen > oldLen){
            for(const i in data){
                if (data[i].attrId != 203){
                    var tmpValue = this.getAttrValue(data[i].attrId) || 0
                    var nowValue = data[i].attrValue || 0
                    if (tmpValue != nowValue){
                        list.push({attrId:data[i].attrId,attrValue:data[i].attrValue - tmpValue})
                    }
                }
            }
        }else{
            for(const i in this.attribute){
                if (this.attribute[i].attrId != 203){
                    var tmpValue = this.attribute[i].attrValue || 0
                    var nowValue = 0
                    for(const j in data){
                        if (data[j].attrId == this.attribute[i].attrId){
                            nowValue = data[j].attrValue
                            break
                        }
                    }
                    if (tmpValue != nowValue){
                        list.push({attrId:this.attribute[i].attrId,attrValue:nowValue - tmpValue})
                    }
                }
            }
        }
        this.attribute = data
        var lastValue = this.getFight()
        this.updateFight()
        var newData = {fight:this.getFight(),lastFight:lastValue,attrList:list,heroId:this.heroId}
        if (!noTips){
            Gm.showHeroAttr(newData)
            // Gm.showAttr(list)
        }else{
            return newData
        }
    },
    setCulAttrValue:function(data){
        this.cultureAttribute = data
    },
    getAttrValue:function(attrId){
        for(const i in this.attribute){
            if (this.attribute[i].attrId == attrId){
                return this.attribute[i].attrValue || 0
            }
        }
        return 0
    },
    updateFight(){
        if (this.isFull()){
            this.fight = this.getAttrValue(203)
        }
        Gm.send(Events.All_FIGHT_UPDATE)
    },
    getFight(){
        return this.fight || 0
    },
    addEquip:function(equip){
        this.equipInfos.push(equip)
    },
    removeEquip:function(ids){
        if (typeof(ids) == "string"){
            ids = [ids]
        }
        for (let index = 0; index < ids.length; index++) {
            const id = ids[index];
            Func.forRemove(this.equipInfos,"equipId",id)
        }
    },
    getEquipByPart:function(part){
        for (let index = 0; index < this.equipInfos.length; index++) {
            const v = this.equipInfos[index];
            var con = Gm.config.getEquip(v.baseId)
            if (con.part == part){
                return v
            }
        }
    },
    getEquip:function(id){
        return Func.forBy(this.equipInfos,"equipId",id)
    },
    getEquipRunes(){
        var list = {}
        for (let index = 0; index < this.equipInfos.length; index++) {
            const v = this.equipInfos[index];
            if(v.runeId > 0){
                if (list[v.runeId] == null){
                    list[v.runeId] = 0
                }
                list[v.runeId] = list[v.runeId] + 1
            }
        }
        return list
    },
});
