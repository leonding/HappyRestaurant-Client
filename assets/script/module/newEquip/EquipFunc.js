exports.EQUIP_SHT_MAX_LV = 100
exports.EQUIP_BASE = 0
exports.EQUIP_SHT = 1
exports.EQUIP_GODLY = 2
exports.EQUIP_GEM = 3
exports.EQUIP_RUNE = 4
exports.EQUIP_UP = 5

exports.equipCommonBaseView = function(parentNode,equip,primarys){
    if (primarys == null){
        primarys = EquipFunc.getEquipPrimarys(equip)
    }
    for (let index = 0; index < 4; index++) {
        var baseNode = parentNode.getChildByName("node" +(index+1))
        if (primarys[index]){
            baseNode.active = true
            var attrData = primarys[index].attrData
            baseNode.getChildByName("lab1").getComponent(cc.Label).string = EquipFunc.getBaseIdToName(attrData.attrId)
            baseNode.getChildByName("lab2").getComponent(cc.Label).string = EquipFunc.getBaseIdToNum(attrData.attrId,attrData.attrValue) 
            var equipChangeLable = baseNode.getChildByName("lab2").getComponent("EquipChangeLable")
            if (equipChangeLable){
                equipChangeLable.hideArrow()
            }
        }else{
            baseNode.active = false
        }
    }
}

exports.equipCommonBaseViewConf = function(parentNode,primarys){
    primarys.sort(function(a,b){
        return a.AttriID - b.AttriID
    })
    for (let index = 0; index < 4; index++) {
        var baseNode = parentNode.getChildByName("node" +(index+1))
        if (primarys[index]){
            baseNode.active = true
            var attrData = primarys[index]
            baseNode.getChildByName("lab1").getComponent(cc.Label).string = EquipFunc.getBaseIdToName(attrData.AttriID)
            baseNode.getChildByName("lab2").getComponent(cc.Label).string = EquipFunc.getBaseIdToNum(attrData.AttriID,attrData.value) 
            var equipChangeLable = baseNode.getChildByName("lab2").getComponent("EquipChangeLable")
            if (equipChangeLable){
                equipChangeLable.hideArrow()
            }
        }else{
            baseNode.active = false
        }
    }
}
exports.getBaseIdToName = function(id){
    var conf = Gm.config.getBaseAttr(id)
    return conf.childTypeName
}

exports.getBaseIdToNum = function(id,value){
    if (id == null){
        return value
    }
    var conf = Gm.config.getBaseAttr(id)
    value = checkint(value)
    if(conf.percentage == 1){
        return ((value/100)+ "%")
    }else{
        return value
    }
}

exports.getEquipPrimarys = function(equip){ //装备主属性
    var list = []
    for (let index = 0; index < equip.attrInfos.length; index++) {
        const v = equip.attrInfos[index];
        if (v.attrGrade == ConstPb.equipAttrGrade.PRIMARY_ATTR){
            list.push(v)
        }
    }
    list.sort(function(a,b){
        return a.attrData.attrId - b.attrData.attrId
    })
    return list
}

//-------------------神器-------------------
exports.isGodlyFullLv = function(equip,godlyType){
    for (let index = 0; index < equip.godlyAttr.length; index++) {
        const v = equip.godlyAttr[index];
        if (godlyType){
            if (index == godlyType-1){
                if (v.level < 20){
                    return false
                }
            }
        }else{
            if (v.level < 20){
                return false
            }
        }
        
    }
    return true
}

exports.godlySort = function(equip){
    if (equip && equip.godlyAttr){
        equip.godlyAttr.sort(function(a,b){
            var aConf = Gm.config.getGodly(a.level,a.attrId)
            var bConf = Gm.config.getGodly(b.level,b.attrId)
            return aConf.godlyType - bConf.godlyType
        })
    }
}
exports.isDoubleGodly = function(equip){
    for (let index = 0; index < equip.godlyAttr.length; index++) {
        const v = equip.godlyAttr[index];
        if (v.level == 0){
            return false
        }
    }
    return true
}

exports.getGodlyExp = function(equip){
    var exp = 0
    for (let index = 0; index < equip.godlyAttr.length; index++) {
        const v = equip.godlyAttr[index];
        if (v.level > 0){
            var aConf = Gm.config.getGodly(v.level,v.attrId)
            exp = exp + aConf.exp
        }
    }
    return exp
}


exports.isGodly = function(equip){
    for (let index = 0; index < equip.godlyAttr.length; index++) {
        const v = equip.godlyAttr[index];
        if (v.level > 0){
            return true
        }
    }
    return false
}

exports.getGodlyType = function(equip){
    if (EquipFunc.isDoubleGodly(equip)){
        return 3
    }
    for (let index = 0; index < equip.godlyAttr.length; index++) {
        const v = equip.godlyAttr[index];
        if (v.level > 0){
            return index+1
        }
    }
}

exports.godlyActive = function(equip){
    var attrs = []
    if(equip.godlyAttr){
        for (let index = 0; index < equip.godlyAttr.length; index++) {
            const v = equip.godlyAttr[index];
            if (v.level > 0){
                attrs.push(v)
            }
        }
    }
    return attrs
}
exports.getGodlyEffect = function(equip){
    var nowKuang = ""
    var godlys = EquipFunc.godlyActive(equip)
    if (godlys.length > 0){
        if (godlys.length == 2){
            nowKuang = "kuang03"
        }else{
            var godlyCon = Gm.config.getGodly(godlys[0].level,godlys[0].attrId)
            if (godlyCon.godlyType == 1){
                nowKuang = "kuang01"
            }else{
                nowKuang = "kuang02"
            }
        }
    }
    return nowKuang
}

exports.getGodlyStr = function(godlyData){
    var jsStr = "%s:Lv.%s %s"
    var godlyStr = ""
    if (godlyData){
        var godlyCon = Gm.config.getGodly(godlyData.level,godlyData.attrId)
        godlyStr = cc.js.formatStr(jsStr,EquipFunc.getGodlyName(godlyCon),godlyData.level,Func.baseStr(godlyCon.attributeId,godlyCon.attributeValue))
    }
    return godlyStr
},

exports.getGodlyName = function(godlyCon){
    return Gm.config.getGodlyType(godlyCon.godlyType).childTypeName
}

exports.isCanInherit = function(equip,targetEquip){
    if (equip && targetEquip){
        if (EquipFunc.isGodly(equip) && !EquipFunc.isGodly(targetEquip)){
            return true
        }
        if (equip.strength > 0 && targetEquip.strength == 0){
            return true
        }
        if (EquipFunc.getGemNum(targetEquip,-1) == 0 && EquipFunc.getGemNum(equip,-1) > EquipFunc.getGemNum(targetEquip,-1)){
            return true
        }
        if (EquipFunc.getGemNum(targetEquip) == 0 && EquipFunc.getGemNum(equip) > EquipFunc.getGemNum(targetEquip)){
            return true
        }
    }
    return false
},

//-------------------宝石-------------------

exports.isGem = function(equip){
    for (let index = 0; index < equip.gemInfos.length; index++) {
        const v = equip.gemInfos[index];
        if (v.gemItemId > 0 ){
            return true
        }
    }
    return false
}

exports.getGemNum = function(equip,flag=0){
    var num = 0 
    for (let index = 0; index < equip.gemInfos.length; index++) {
        const v = equip.gemInfos[index];
        if (v.gemItemId > flag ){
            num = num + 1
        }
    }
    return num
}

//-------------------附魔-------------------
exports.getRuneStr = function(runeId,sum){
    var strs = [Ls.get(5040),Ls.get(5041),Ls.get(5042)]
    var allStr = ""
    sum  = sum || 0

    var suitConf = Gm.config.getSuit(runeId)
    
    for (let index = 1; index <= 3; index++) {
        var attr = suitConf["equipmentEffect" + (index*2)]
        var str = ""
        for (let i = 0; i < attr.length; i++) {
            const v1 = attr[i];
            if (str != ""){
                str = str + "  "
            }
            str = str +  Func.baseStr(v1.id,v1.value)
        }
        var co
        if (sum/2 >= index){
            co = "18A456"
        }else{
            co = "584768"
        }
        if (allStr != ""){
            allStr = allStr + "\n"
        }
        allStr = allStr + cc.js.formatStr("<color=#%s>%s</c>",co,Ls.get(strs[index-1]) + str)
    }
    return allStr
}

//---------------强化-------------------
var MAX_LV = 100
exports.getStrengthenAddNum = function(lv,qhLv,attrId){
    var currNum = this.getEquipLvNum(lv,qhLv,attrId)
    return currNum
}

exports.getEquipLvNum = function(lv,qhLv,attrId){
    if (qhLv == 0){
        return 0
    }
    var qhConf = Gm.config.getStrengthen(qhLv)
    var baseAttr = Gm.config.getBaseAttr(attrId)
    var value = qhConf[baseAttr.systemName]
    return Math.floor(value*Gm.config.getStrengthenPro(lv).proportion/10000)
}
