var BaseView = require("BaseView")

// LotteryThirdInfo
cc.Class({
    extends: BaseView,
    properties: {
        heroContentLayer:cc.Node,
        heroListNode:cc.Node,
        heroListCell:cc.Node,
        timeLabel:cc.Label,
        costContentLabel:cc.RichText,
        titleNode:cc.Node,
        msg2:cc.RichText,
    },
    onLoad(){
        this.popupUIData = {title:Ls.get(3107)}
        this._super()
        var tipsNode = this.popupNode.getChildByName("TipsBase")
        if(tipsNode){
            this.popupUI.setWidth(tipsNode.width)
        }
    },
    enableUpdateView(args){
        // Gm.audio.playEffect("music/02_popup_open")
        this.selectedIndex = this.openData
        this.filedId = LotteryFunc.pageIndexToFiledId(this.selectedIndex)
        var lotteryConfig = Gm.config.getLotteryConfig(this.filedId)
        this.msg2.string = Ls.get(lotteryConfig.drawInfo)
        if(this.selectedIndex == 4){
            this.data = Gm.lotteryData.getLotteryThirdInfoData()
            this.timeLabel.string = Ls.get(3111)
            this.costContentLabel.string = Ls.get(7100037)
            this.createUI()
            // this.msg2.string = Ls.get(7100036)
        }
        else{
            this.timeLabel.string = this.getTimeLabelStr()
            this.costContentLabel.string = this.getCostLaeblStr()
            
            this.mode = LotteryFunc.filedIdToModeId(this.filedId)
            this.createUI1()
            // this.msg2.string = Ls.get(7100041)
        }
    },
    createUI(){
        //创建英雄
        this.createHero()
        //创建装备
        this.createEquip()
        //创建其它
        this.createOther()
    },
    createHero(){
        var heroTitle = this.createTitleNode(Ls.get(7100040))
        this.heroContentLayer.addChild(heroTitle)

        var heroCell = this.createHeroListCell(this.data.heroData.heroId,this.data.heroData.percent,0)
        heroTitle.getChildByName("contentNode").addChild(heroCell)
    },
    createEquip(){
        var heroTitle = this.createTitleNode(Ls.get(1601 ),this.data.equipData.type)
        this.heroContentLayer.addChild(heroTitle)

        var contentNode = heroTitle.getChildByName("contentNode")
        for(var i=0;i<this.data.equipData.itemInfo.length;i++){
            var listNode = this.createEquiptListNode(this.data.equipData.itemInfo[i])
            contentNode.addChild(listNode)
        }
    },
    createOther(){
        var heroTitle = this.createTitleNode(Ls.get(1602))
        this.heroContentLayer.addChild(heroTitle)

        var contentNode = heroTitle.getChildByName("contentNode")
        for(var i=0;i<this.data.other.itemInfo.length;i++){
            var listNode = this.createItemCell(this.data.other.itemInfo[i])
            contentNode.addChild(listNode)
        }
    },
    createEquiptListNode(data){
        var itemList = cc.instantiate(this.heroListNode)
        itemList.active = true
        itemList.x = 0
        itemList.y = 0
        var titleSprite = itemList.getChildByName("titleSprite")
        var nameLabel = titleSprite.getChildByName("nameLabel").getComponent(cc.Label)
        var percentLabel = titleSprite.getChildByName("percentLabel").getComponent(cc.Label)
        
        Gm.load.loadSpriteFrame("img/chouka/" + LotteryFunc.getChouKaTzImgTitleBg(data[0].quality),function(sp,icon){
            if (icon && icon.node && icon.node.isValid){
                icon.spriteFrame = sp
            }
        },titleSprite.getComponent(cc.Sprite))

        nameLabel.string =   LotteryFunc.getChoukaTzTitleNameByQualityId(data[0].quality)

        var contentNode = itemList.getChildByName("contentNode")
        var total = 0
        for(var i=0;i<data.length;i++){
           this.createHeroListCellFunc(contentNode,data,i)
           total = total + data[i].percent
        }
        percentLabel.string =  (total*100).toFixed(2) + "%"
        return itemList
    },
    createHeroListCellFunc(contentNode,data,i){
        setTimeout(() => {
              if(this.heroContentLayer && this.heroContentLayer.isValid){
                    var item = this.createEquipCell(data[i])
                    contentNode.addChild(item)
             }
        }, i*5);
    },
    createHeroListCell(heroId,percent,type){
        var item = cc.instantiate(this.heroListCell)
        item.active = true
        item.x = 0
        item.y = 0
        item.getChildByName("percentLabel").getComponent(cc.Label).string = (percent * 100).toFixed(2) + "%"
        if(heroId){
            var heroConfig = Gm.config.getHero(0,heroId)
            heroConfig.qualityId = heroId
            item.getChildByName("nameLabel").getComponent(cc.Label).string = heroConfig.name
            var itemJs = Gm.ui.getNewItem(item.getChildByName("heroNode"),true)
            itemJs.updateHero(heroConfig)
        }else{
            item.getChildByName("nameLabel").getComponent(cc.Label).string = ""
            var node = new cc.Node()
            var icon = node.addComponent(cc.Sprite)
            item.getChildByName("heroNode").addChild(node)
            Gm.load.loadSpriteFrame("/img/camp/camp_img_wh",function(sp,icon) {
                if(icon && icon.node && icon.node.isValid){
                    icon.spriteFrame = sp
                }
            },icon)
        }
        item.getChildByName("newSprite").active = (type == 1)
        item.getChildByName("nAcSprite").active = !Gm.lotteryData.isActivateHero(this.filedId,heroId)
        return item
    },
    createTitleNode(title,index){
        var heroTitle = cc.instantiate(this.titleNode)
        heroTitle.active = true
        heroTitle.x = 0
        heroTitle.y = 0
        heroTitle.getChildByName("dc_img_bt").getChildByName("name").getComponent(cc.Label).string = title
        if(index){
            var iconNode = heroTitle.getChildByName("dc_img_bt").getChildByName("icon")
            iconNode.active = true
            var picArray = LotteryFunc.getJobRes()
            Gm.load.loadSpriteFrame("/img/jobicon/" + picArray[index-1],function(sp,icon){
                if(icon && icon.node && icon.node.isValid){
                    icon.spriteFrame = sp
                }
            },iconNode.getComponent(cc.Sprite))
        }
        return heroTitle
    },
    createEquipCell(data){
        var item = cc.instantiate(this.heroListCell)
        item.active = true
        item.x = 0
        item.y = 0
        var equipConf = Gm.config.getEquip(data.id)
        equipConf.baseId = data.id

        item.getChildByName("nameLabel").getComponent(cc.Label).string = data.name
        item.getChildByName("percentLabel").getComponent(cc.Label).string = (data.percent*100).toFixed(2) + "%"
        var itemJs = Gm.ui.getNewItem(item.getChildByName("heroNode"),true)
        itemJs.updateEquip(equipConf)
        return item
    },
    createItemCell(data){
         var item = cc.instantiate(this.heroListCell)
        item.active = true
        item.x = 0
        item.y = 0
        var equipConf = Gm.config.getItem(data.id)
        equipConf.baseId = data.id

        item.getChildByName("nameLabel").getComponent(cc.Label).string = data.name
        item.getChildByName("percentLabel").getComponent(cc.Label).string = (data.percent*100).toFixed(2) + "%"
        var itemJs = Gm.ui.getNewItem(item.getChildByName("heroNode"),true)
        itemJs.updateItem(equipConf)
        return item
    },

    getTimeLabelStr(){
        var array = [3111,3111,7000006]
        return Ls.get(array[this.selectedIndex])
    },
    getCostLaeblStr(){
        var array = [3113,3114,3122]
        return Ls.get(array[this.selectedIndex])
    },
    createUI1(){
        var ids = Gm.lotteryData.getQuiliTyIdTypesArray(this.mode)
        ids.sort(function(a,b){
            return b-a
        })
        for(var i=0;i<ids.length;i++){
            var data = Gm.lotteryData.getProbabilityDisplayDataByIndexAndQuli(this.mode,ids[i])
            if((this.filedId == 1001 || this.filedId == 1002 ) && ids[i] == 5){
                Gm.lotteryData.dealNotActivityHero(data,this.filedId)
            }
            if(data.length>0){
                var item = this.createHeroListNode(data)
                this.heroContentLayer.addChild(item)
            }
        }
    },
    createHeroListNode(data){
        var itemList = cc.instantiate(this.heroListNode)
        itemList.active = true
        itemList.x = 0
        itemList.y = 0
        var titleSprite = itemList.getChildByName("titleSprite")
        var nameLabel = titleSprite.getChildByName("nameLabel").getComponent(cc.Label)
        var percentLabel = titleSprite.getChildByName("percentLabel").getComponent(cc.Label)
        var percentSprite = titleSprite.getChildByName("percentSprite").getComponent(cc.Sprite)
        
        Gm.load.loadSpriteFrame("img/chouka/" + LotteryFunc.getChouKaImgTitleBg(data[0].qualityId),function(sp,icon){
            if (icon && icon.node && icon.node.isValid){
                icon.spriteFrame = sp
            }
        },titleSprite.getComponent(cc.Sprite))

        nameLabel.string =   LotteryFunc.getChoukaTitleNameByQualityId(data[0].qualityId)

        //  Gm.load.loadSpriteFrame("img/chouka/" +  LotteryFunc.getChoukaImgTitlePercent(this.selectedIndex,data[0].qualityId),function(sp,icon){
        //     if (icon && icon.node && icon.node.isValid){
        //         icon.spriteFrame = sp
        //     }
        // },percentSprite)
        percentLabel.node.active = true
        percentSprite.node.active = false

        var per = LotteryFunc.getChoukaImgTitlePercent(this.selectedIndex,data[0].qualityId)
        percentLabel.string = (per * 100).toFixed(2) + "%"

        var contentNode = itemList.getChildByName("contentNode")
        for(var i=0;i<data.length;i++){
           this.createHeroListCellFunc1(contentNode,data,i)
        }
        return itemList
    },
     createHeroListCellFunc1(contentNode,data,i){
        setTimeout(() => {
              if(this.heroContentLayer && this.heroContentLayer.isValid){
                    var item = this.createHeroListCell(data[i].wId,data[i].weight,data[i].type)
                    contentNode.addChild(item)
             }
        }, i*5);
    },
});

