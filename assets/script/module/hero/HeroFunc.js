exports.HERO_STAR_NUM = 11
exports.isBiography = true
exports.ssrQuality = function(quality){
    return Math.min(quality,exports.HERO_STAR_NUM)
}

exports.getFlyFlyConsumeData = function (dd) {
    var itemData
    if (dd.type == ConstPb.itemType.HERO_CARD){
        itemData = {type:ConstPb.itemType.ROLE,id:dd.quality}
        if (dd.quality < 100 ){//阵营
            var heroGroupConf = Gm.config.getHeroByTeamType(dd.camp)[0]
            var gourps = Gm.config.getGroupHero(heroGroupConf.id)
            gourps.sort((a,b)=>{
                return a.id - b.id
            })
            itemData.id = gourps[dd.quality-1].id
            itemData.noHead = true
        }
    }
    return itemData
}
exports.createFlyConsumeItem = function(item,dd){
    item.active = true
    var itemData = this.getFlyFlyConsumeData(dd)

    Func.destroyChildren(item)
    var itemBase = Gm.ui.getNewItem(item,true)
    itemBase.setData({noHead:itemData.noHead,type:itemData.type,id:itemData.id})
    itemBase.setTips(false)
    itemBase.setChoice(true,true)
    itemBase.addNode.y = -25
    itemBase.addNode.x = 25

    item.itemBase = itemBase
    
    if (dd.type == ConstPb.itemType.HERO_CARD){
        itemBase.getBaseClass().teamSpr.node.active = true
        if (dd.quality < 100){
            itemBase.getBaseClass().teamSpr.node.active =dd.camp!=0
            Gm.load.loadSpriteFrame("img/camp/camp_img_ns",(sp,icon)=>{
                icon.spriteFrame = sp
                icon.node.scale = 0.60
            },itemBase.iconSpr)

            if(dd.camp == 0){
                Gm.load.loadSpriteFrame("img/camp/camp_img_wh",(sp,icon)=>{
                    var newNode = new cc.Node()
                    newNode.addComponent(cc.Sprite)
                    newNode.getComponent(cc.Sprite).spriteFrame = sp
                    icon.addChild(newNode)
                    newNode.scale = 3
                },itemBase.bgSpr.node)
            }
        }
    }
    return itemBase
}

exports.flyLockType = function(heroInfo){
    if (Gm.oreData.isInLine(heroInfo.heroId)){
        return 4
    }
    if (Gm.heroData.isline(ConstPb.lineHero.LINE_DEFEND,heroInfo.heroId)){
        return 1
    }
    if (heroInfo.lock){
        return 2
    }
    if (Gm.heroData.isline(ConstPb.lineHero.LINE_BOSS,heroInfo.heroId)){
        return 3
    }
    return 0
}

exports.getFlyList = function(heroList,allList,hasIds,hero_synthetise_list_quality=0){
    var retultList = []
    // var hasIds = {}
    for (var i = 0; i < heroList.length; i++) {
        var heroDataFly = heroList[i]
        if (hasIds[heroDataFly.heroId]){
            // cc.log("总列表已占用1",heroDataFly.heroId)
            continue
        }

        var heroConf = Gm.config.getHero(heroDataFly.baseId,heroDataFly.qualityId)
        if (heroConf.quality  >= Gm.config.getConst("hero_synthetise_quality_max")){
            continue
        }
        if (hero_synthetise_list_quality && heroConf.quality > hero_synthetise_list_quality){
            continue
        }
        for(const j in heroConf.qualityProcess){
            if (heroDataFly.qualityId == heroConf.qualityProcess[i]){
                if (checkint(j) == heroConf.qualityProcess.length - 1){// 最大等级
                    hasIds[heroDataFly.heroId] = true
                }
                break
            }
        }
        if (hasIds[heroDataFly.heroId]){
            // cc.log("总列表已占用1",heroDataFly.heroId)
            continue
        }

        var needNum = 0
        // cc.log(heroDataFly.heroId,"=====================")
        for (let j = 0; j < heroConf.qualityUpCost.length; j++) {
            var needData = heroConf.qualityUpCost[j]
            needNum =needData.num + needNum
        }

        var listId = {}
        var nowNum = 0
        for (let j = 0; j < heroConf.qualityUpCost.length; j++) {
            var needData = heroConf.qualityUpCost[j]
            var num = 0
            for (var k = allList.length-1; k >= 0; k--) {
                var tmpHero = allList[k]
                if (heroDataFly.heroId == tmpHero.heroId){
                    // cc.log("相同2",tmpHero.heroId)
                    continue
                }
                if (hasIds[tmpHero.heroId]){//总列表已占用
                    // cc.log("总列表已占用2",tmpHero.heroId)
                    continue
                }
                if (listId[tmpHero.heroId]){//当前消耗已占用
                    // cc.log("当前消耗已占用2",tmpHero.heroId)
                    continue
                }
                if (tmpHero.isLine){
                    // cc.log("锁定2",tmpHero.heroId)
                    continue
                }

                if (needData.quality > 100){//具体品质
                    if (needData.quality == tmpHero.qualityId){
                        listId[tmpHero.heroId] = true
                        num = num + 1
                    }
                }else{
                    if (needData.camp == 0 ||  needData.camp == tmpHero.camp){
                        if (tmpHero.quality == needData.quality){
                            listId[tmpHero.heroId] = true
                            num = num + 1
                        }
                    }
                }
                if (num == needData.num){
                    nowNum = nowNum + num
                    break
                }
            }
        }
        // cc.log(heroDataFly.heroId,listId,nowNum,needNum,hasIds)
        if (needNum == nowNum){
            retultList.push({heroId:heroDataFly.heroId,listId:listId})
            hasIds[heroDataFly.heroId] = true
            
            for(const k in listId){
                hasIds[k] = true
            }
        }
    }
    return retultList
}

exports.tjSkinConf = function(heros,baseId){
    var data
    for (var i = 0; i < heros.length; i++) {
        var hero = heros[i]
        var skinConf = Gm.config.getSkin(hero.skin)
        if(data == null || skinConf.show > data.show){
            data = skinConf
        }
    }
    if (data == null){
        return Gm.config.getSkins(baseId)[0]

    }
    return data
}

exports.getBiographyKey = function(baseId){
    return "biographyBaseId" + baseId
}

exports.heroStar = function(starNode,quality){
    starNode.active = false
    if (quality){
        var star = quality - HeroFunc.HERO_STAR_NUM
        Func.destroyChildren(starNode)
        if (star > 0){
            starNode.active = true
            for (var i = 0; i < star; i++) {
                var iconNode = starNode.children[i]
                if (iconNode == null){
                    iconNode = new cc.Node()
                    iconNode.rotate = -18
                    iconNode.addComponent(cc.Sprite)
                    starNode.addChild(iconNode)
                }
                Gm.load.loadSpriteFrame("img/heroFrame/heroFrame_img_xing",function(sp,icon){
                    if (icon && icon.node){
                        icon.spriteFrame = sp
                    }
                },iconNode.getComponent(cc.Sprite))
            }
        }
    }
}

exports.monsterFormatLv = function(lv){
    if (lv > 240+10){
        lv = 240 + Math.floor((lv-240)/10)
    }
    return lv
}




