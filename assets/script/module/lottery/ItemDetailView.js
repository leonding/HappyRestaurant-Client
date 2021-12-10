var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        itemInfoNode:cc.Node,
        equipInfoNode:cc.Node,

        itemNode:cc.Node,
        itemDescRich:cc.RichText,

        equipItemNode:cc.Node,
        equipNameLab:cc.Label,
        equipZyLab:cc.Label,
        equipScoreLab:cc.Label,
        equipInfoBaseNode:cc.Node,
        equipNeedHeroNode:cc.Node,
        equipNeedHeroScroll: {
        	default: null,
        	type: cc.ScrollView
        },
        m_oBlankTipNode:cc.Node,//空白页提示
        m_oFdjBtn:cc.Button,
    },
    onLoad:function(){
        this.popupUIData = {title:""}
        this._super()
        this.popupUI.setWidth(this.tipsNode.width)
    },
    onEnable(){
        this._super()
    },
    enableUpdateView(args){
        if(args){
            this.currData = args

            if (this.currData.item.itemType == ConstPb.itemType.EQUIP){
                this.updateEquip()
            }else if (this.currData.item.itemType == ConstPb.itemType.HERO_CARD){

            }else if (this.currData.item.itemType == ConstPb.itemType.HERO_SKIN){
                this.updateSkin()
            }else{
                this.updateItem()
            }
        }
    },
    updateSkin(){
        this.itemInfoNode.active = true
        this.m_oFdjBtn.node.active = true
        this.itemBase = Gm.ui.getNewItem(this.itemNode)
        this.itemBase.setTips(false)
   
        var tmpNode = new cc.Node()
        tmpNode.anchorY = 0 
        tmpNode.anchorX = 0
        tmpNode.x = 26
        tmpNode.y = -83
        this.itemInfoNode.addChild(tmpNode)
        var sprite = tmpNode.addComponent(cc.Sprite)
        Gm.load.loadSpriteFrame("img/tujian/shop_pifu",function(sp,icon){
            icon.spriteFrame = sp
        },sprite)
        
        var conf = this.itemBase.setData(this.currData.item)
        this.popupUI.setData({title:conf.name})
        this.itemDescRich.string = conf.info
    },

    heroSkinShowClick(){
        var conf = Gm.config.getHero(parseInt(this.currData.item.qualityId/1000),this.currData.item.qualityId)
        var skinConf = Gm.config.getSkin(conf.skin_id)
        Gm.ui.create("HeroShowView",{skinconf:skinConf})
    },

    updateItem(){
        this.itemInfoNode.active = true
        this.itemBase = Gm.ui.getNewItem(this.itemNode)
        this.itemBase.setTips(false)
        
        var conf = this.itemBase.setData(this.currData.item)

        this.popupUI.setData({title:conf.name})
        this.itemDescRich.string = conf.description

        if (this.currData.isBagHero){
            this.itemBase.setLabStr(Func.doubleLab(this.currData.item.count,conf.need_chip,"F8F2E2","00ff00"))
        }
        this.itemBase.setCountLabRightAlign()
    },

    updateEquip(){
        this.equipInfoNode.active = true
        this.itemBase = Gm.ui.getNewItem(this.equipItemNode)
        this.itemBase.setTips(false)

        var equipConf = this.itemBase.setData(this.currData.item)

        this.popupUI.setData({title:equipConf.name})


        this.equipNameLab.string = equipConf.name
        this.equipZyLab.string = Gm.config.getJobType(equipConf.jobLimit).childTypeName
        this.equipScoreLab.string = ""//this.currData.item.score

        var primarys = equipConf.mainAttr

        primarys.sort(function(a,b){
            return a.AttriID - b.AttriID
        })

        EquipFunc.equipCommonBaseViewConf(this.equipInfoBaseNode,primarys)

        var heros = Gm.shopData.getEquiRedHeros(this.currData.item)

        this.equipNeedHeroNode.active =  heros.length > 0
        if (this.equipNeedHeroNode.active){
            heros.sort(function(aid,bid){
                var a = Gm.heroData.getHeroById(aid)
                var b = Gm.heroData.getHeroById(bid)
                var confA = Gm.config.getHero(a.baseId,a.qualityId)
                var confB = Gm.config.getHero(b.baseId,b.qualityId)
                var levelA = a.level
                var levelB = b.level
                if (Gm.heroData.isInPool(a.heroId)){
                    levelA = Func.configHeroLv(a,confA)
                }
                if (Gm.heroData.isInPool(b.heroId)){
                    levelB = Func.configHeroLv(b,confB)
                }
                if (levelA == levelB){
                    if (confA.quality == confB.quality){
                        return confB.camp - confA.camp
                    }else{
                        return confB.quality - confA.quality
                    }
                    return -1
                }else{
                    return levelB - levelA
                }
            })

            for (let index = 0; index < heros.length; index++) {
                const v = heros[index];
                var iBase = Gm.ui.getNewItem(this.equipNeedHeroScroll.content)
                iBase.updateHero(Gm.heroData.getHeroById(v))
                iBase.setShowAccess(true)
            }
        }
        this.checkBlank(heros)
    },
    checkBlank:function(data){
        var isBlank = data?data.length == 0:true
        this.m_oBlankTipNode.active = isBlank
    }
});

