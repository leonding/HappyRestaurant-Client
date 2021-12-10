const FLY_LOCK = [100,102,106,110,111,114,523]
cc.Class({
    extends: require("BaseView"),

    properties: {
        tipsNode:cc.Node,
        ssrIconSpr1:cc.Sprite,
        ssrIconSpr2:cc.Sprite,
        starNodes1:cc.Node,
        starNodes2:cc.Node,
        heroNode1:cc.Node,
        heroNode2:cc.Node,

        itemNode:cc.Node,
        listNode:cc.Node,
        needNode:cc.Node,

        skillNode:cc.Node,

        m_oSkillPerfab:cc.Prefab,
        lastSkill:{
            default: [],
            type: cc.Node,
        },
        nextSkill:{
            default: [],
            type: cc.Node,
        },
    },
    onLoad(){
        this.popupUIData = {title:5272}
        this._super()
        // this.popupUI.setData({title:5272})
        // this.popupUI.setCloseFunc(()=>{
        //     this.onBack()
        // })
        // this.tipsNode.active = false
        // this.popupUI.setHeight(924)
    },
    enableUpdateView:function(args){
        if (args){
            this.tipsNode.active = false
            cc.log(this.openData)
            Gm.heroNet.sendQualityInfo(this.openData.heroData.heroId)
        }
    },
    register:function(){
        this.events[MSGCode.OP_HERO_QUALITY_INFO_S] = this.updateView.bind(this)
        // this.events[MSGCode.OP_HERO_QUALITY_S] = this.onBack.bind(this)
    },
    updateView(args){
        this.tipsNode.active = true
        this.lastConf = this.updateHero(this.openData.heroData.qualityId,1)

        var nextHeroId = 0
        for (var i = 0; i < this.openData.heroConf.qualityProcess.length; i++) {
            if (this.openData.heroConf.qualityProcess[i] == this.openData.heroData.qualityId){
                nextHeroId = this.openData.heroConf.qualityProcess[i+1]
                break
            }
        }
        var nextConf = this.updateHero(nextHeroId,2)

        this.heroIds = []
        for (var i = 0; i < this.openData.costHeros.length; i++) {
            var list = this.openData.costHeros[i]
            for (var j = 0; j < list.length; j++) {
                var heroId = list[j]
                var itemBase = Gm.ui.getNewItem(this.needNode)
                itemBase.node.scale = 115/itemBase.node.width
                itemBase.updateHero(Gm.heroData.getHeroById(heroId))
                itemBase.node.anchorX = 1
                this.heroIds.push(heroId)
            }
        }

        var num = 0

        var nowHeroData = Gm.heroData.getHeroById(args.heroId)
        for (var i = 0; i < FLY_LOCK.length; i++) {
            var attrId = FLY_LOCK[i]

            var tmpOld = 0
            var tmpNew = 0
            for(const k in args.attribute){
                if (args.attribute[k].attrId == attrId){
                    tmpNew = args.attribute[k].attrValue
                    break
                }
            }
            for(const k in nowHeroData.attribute){
                if (nowHeroData.attribute[k].attrId == attrId){
                    tmpOld = nowHeroData.attribute[k].attrValue
                    break
                }
            }
            if (tmpOld == tmpNew){
                continue
            }

            var item = cc.instantiate(this.itemNode)
            item.active = true
            this.listNode.addChild(item)

            item.getChildByName("nameLab").getComponent(cc.Label).string = EquipFunc.getBaseIdToName(attrId)
            item.getChildByName("nameLabnew").getComponent(cc.Label).string = EquipFunc.getBaseIdToName(attrId)
            item.getChildByName("lastLab").getComponent(cc.Label).string = EquipFunc.getBaseIdToNum(attrId,tmpOld) 
            item.getChildByName("nextLab").getComponent(cc.Label).string = EquipFunc.getBaseIdToNum(attrId,tmpNew) 

            // if (num%2 == 0){
            //     item.getComponent(cc.Sprite).spriteFrame = null
            // }
            num = num + 1
        }
        this.skillNode.zIndex = 1

        const skillname = ["attack_skill","passive_skill"]


        var dealSkill = (sNode,skillId)=>{
            const v1 = Gm.config.getSkill(skillId)
            var tmpPage = cc.instantiate(this.m_oSkillPerfab)
            var tmpSpt = tmpPage.getComponent("SkillBase")
            sNode.addChild(tmpPage,-1)
            tmpPage.y = 8.5
            tmpPage.scale = 0.75
            tmpSpt.setOwner(this,v1)

            sNode.getChildByName("New Label").getComponent(cc.Label).string = v1.skillLevle
        }

        for(const i in skillname){
            dealSkill(this.lastSkill[i],this.lastConf[skillname[i]])
            dealSkill(this.nextSkill[i],nextConf[skillname[i]])
        }
    },
    onSkillClick(data,sender){
        var y = sender.target.y
        Gm.ui.create("TipsInfoView",{id:data.baseId,x:sender.target.x,y:y})
    },
    updateHero(qualityId,index){
        var itemBase = Gm.ui.getNewItem(this["heroNode"+index],true)
        itemBase.updateHero({baseId:qualityId})


        var heroConf = Gm.config.getHero(0,qualityId)
        Gm.load.loadSpriteFrame("img/equipLogo/ssr_quality_"+HeroFunc.ssrQuality(heroConf.quality),function(sp,icon){
            icon.spriteFrame = sp
        },this["ssrIconSpr" + index])

        var starNodes = this["starNodes" + index]

        var star = heroConf.quality - HeroFunc.HERO_STAR_NUM
        for (var i = 0; i < starNodes.children.length; i++) {
            starNodes.children[i].active = star > i
        }

        return heroConf
    },
    onOkClick(){
        var equipNum = 0
        for (let j = 0; j < this.heroIds.length; j++) {
            var hero = Gm.heroData.getHeroById(this.heroIds[j])
            equipNum = equipNum + hero.equipInfos.length
        }
        if (equipNum > Gm.bagData.getSurplusBagSize()){
            Gm.floating(5013)
            return
        }

        var newList = []
        newList.push({heroId:this.openData.heroData.heroId,removeIds:this.heroIds})
        if (this.lastConf.quality+1 >=Gm.config.getConst("hero_quality_point")){

            var list = Gm.heroData.getHerosByBaseId(this.openData.heroData.baseId)
            list.sort(function(a,b){
                return a.qualityId - b.qualityId
            })

            var isHas = false
            for (var i = 0; i < list.length; i++) {
                var v = list[i]
                if (v.qualityId > this.openData.heroData.qualityId){
                    isHas = true
                }
            }
            if (isHas){
                var str = 5289
                var color = cc.js.formatStr("<color=#ff0000>%s</c>",this.lastConf.name)
                Gm.box({msg:cc.js.formatStr(Ls.get(str),color)},(btnType)=>{
                    if (btnType == 1){
                        this.send(newList)
                    }
                })
                return
            }
        }
        this.send(newList)
    },
    send(newList){
        Gm.heroNet.sendHeroRiseQuality(newList)
        this.onBack()
    },
    onCancelClick(){

    }

});
