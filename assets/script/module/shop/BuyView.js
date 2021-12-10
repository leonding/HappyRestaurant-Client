var BaseView = require("BaseView")
const max_num = 100
var EQUIP_FORMAT = "%s\n%s\n%s"
cc.Class({
    extends: BaseView,
    properties: {
        itemInfoNode:cc.Node,
        equipInfoNode:cc.Node,

        itemNode:cc.Node,
        itemDescRich:cc.RichText,
        itemNumNode:cc.Node,
        limitRich:cc.RichText,


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

        btn1:cc.Node,
        btn2:cc.Node,
        btnLab2:cc.Label,
        numLab:cc.Label,
        consumeUI:require("ConsumeUI"),

        m_oBlankTipNode:cc.Node,//空白页提示

        m_oFdjBtn:cc.Button,
    },
    onLoad:function(){
        this.popupUIData = {title:""}
        this._super()
    },
    runOpenAction(){
        if (this.openData.item.itemType == ConstPb.itemType.EQUIP){
            this.tipsNode.height = 810
            this.popupUI.setHeight(810)
        }
        this.consumeUI.node.active = true
        this._super()
    },
    onEnable(){
        this._super()
    },
    enableUpdateView(args){
        if(args){
            this.currData = args
            this.itemNumNode.active = this.currData.isMore
            this.maxNum = Math.floor(this.currData.maxNum || 0)
            this.currNum = 1
            if (this.maxNum == 0){
                this.currNum = 0
            }
            if(args.btnName2){
                this.btnLab2.string = args.btnName2
            }else{
                this.btnLab2.string = Ls.get(1007)
            }

            if (this.redNode == null){
                this.redNode = Gm.red.getRedNode(this.itemNode)
            }
            this.redNode.active = false
            this.btn1.active = true
            this.btn2.active = true
            cc.log(this.currData)
            if (this.currData.item.itemType == ConstPb.itemType.EQUIP){
                this.updateEquip()
            }else if (this.currData.item.itemType == ConstPb.itemType.HERO_CARD){

            }else if (this.currData.item.itemType == ConstPb.itemType.HERO_SKIN){
                this.updateSkin()
            }else{
                this.updateItem()
            }
            this.updateNum(0)

            if (args.limitNum && args.limitNum > 0){
                this.limitRich.node.parent.active = true
                var colorStr = "<color=#00FF00>%s</c>"
                if (args.limitNum == 0){
                    colorStr = "<color=#FF0000>%s</c>"
                }
                this.limitRich.string = cc.js.formatStr(Ls.get(5304),":",cc.js.formatStr(colorStr,args.limitNum))
            }
        }
    },
    updateSkin(){
        this.itemInfoNode.active = true
        this.itemNumNode.active = false
        this.m_oFdjBtn.node.active = true
        this.itemBase = Gm.ui.getNewItem(this.itemNode)
        this.itemBase.setTips(false)
        // this.itemBase.setFb((data)=>{
        //     if (data.itemType == ConstPb.itemType.HERO_SKIN){
        //         cc.log("皮肤点击")
        //         this.heroSkinShowClick()
        //     }
        // })

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

    updateHero(){
        // this.itemInfoNode.active = true
        // this.itemBase = Gm.ui.getNewItem(this.itemNode)
        // this.itemBase.setTips(false)
        
        
        // this.redNode.active =Gm.shopData.isEquipChipRed(this.currData.item.baseId,this.currData.item.count)
        // var conf = this.itemBase.setData(this.currData.item)

        // this.popupUI.setData({title:conf.name})
        // this.itemDescRich.string = conf.description

        // if (this.currData.isBagHero){
        //     this.itemBase.setLabStr(Func.doubleLab(this.currData.item.count,conf.need_chip,"F8F2E2","00ff00"))
        //     this.consumeUI.node.active = false
        //     this.btn1.active = false
        //     this.btn2.x = 0
        //     this.btnLab2.string = Ls.get(20003)
        // }
    },
    updateItem(){
        this.itemInfoNode.active = true
        this.itemBase = Gm.ui.getNewItem(this.itemNode)
        this.itemBase.setTips(false)
        
        
        this.redNode.active =Gm.shopData.isEquipChipRed(this.currData.item.baseId,this.currData.item.count)
        var conf = this.itemBase.setData(this.currData.item)

        this.popupUI.setData({title:conf.name})
        this.itemDescRich.string = conf.description

        if (this.currData.isBagHero){
            this.itemBase.setLabStr(Func.doubleLab(this.currData.item.count,conf.need_chip,"F8F2E2","00ff00"))
            this.consumeUI.node.active = false
            this.btn1.active = false
            this.btn2.x = 0
            this.btnLab2.string = Ls.get(20003)
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
        this.redNode.active = heros.length > 0

        this.equipNeedHeroNode.active = this.redNode.active
        if (this.redNode.active){
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
    updateNum:function(destValue){
        this.currNum = this.currNum + destValue
        if (this.currNum < 0){
            this.currNum = 0
        }
        if (this.currNum > this.maxNum && this.maxNum != -1){
            this.currNum = this.maxNum
        }

        this.numLab.string = this.currNum
        this.m_tNeedNums = this.currData.numFunc(this.currNum)
        if (this.m_tNeedNums){
            this.consumeUI.setData({id:this.m_tNeedNums[0],need:this.m_tNeedNums[1]})
        }
    },
    onAdd:function(){
        this.updateNum(1)
    },
    onRight:function(){
        this.updateNum(max_num)
    },
    onJian:function(){
        this.updateNum(-1)
    },
    onLeft:function(){
        this.updateNum(-max_num)
    },
    onOkBtn(){
        if(this.itemNumNode.active){
            if (this.currNum > 0 && this.m_tNeedNums){
                this.currData.callback(this.currNum)
                this.onBack()
            }
        }else{
            this.currData.callback(1)
            this.onBack()
        }
        
    },
    checkBlank:function(data){
        var isBlank = data?data.length == 0:true
        this.m_oBlankTipNode.active = isBlank
    }
});

