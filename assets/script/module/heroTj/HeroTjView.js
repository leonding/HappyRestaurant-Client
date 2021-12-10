var BaseView = require("BaseView")
const touch_update = 0.2
const MAX_LV = 160
cc.Class({
    extends: BaseView,
    properties: {
        infoNode:cc.Node,
        hideNode:cc.Node,
        heroBackSpr:cc.Sprite,
        nameLab:cc.Label,
        starNodes:cc.Node,

        campSpr:cc.Sprite,
        ssrSpr:cc.Sprite,

        personSpine:sp.Skeleton,
        dwarfSpine:sp.Skeleton,

        dwarfNode:cc.Node,

        cvIcon:cc.Node,
        cvLab:cc.Label,
        cvBtn:cc.Button,
        jobSpr:cc.Sprite,

        attributeNodes:{
            default: [],
            type: cc.Node,
        },

        skinBtn:cc.Button,
        getPathBtn:cc.Button,
        arrowBtn:cc.Node,
        pathBtn:cc.Button,
    },
    onLoad () {
        this._super()
        this.cvLab.node.on("size-changed", ()=>{
            this.cvIcon.x = -this.cvLab.node.width-5
        })
        Gm.ui.hideUnder()
    },
    onDestroy(){
        Gm.ui.showUnder()
        this._super()
    },
    enableUpdateView(args){
        if (args){
            this.updateView()
        }
    },
    register:function(){
        this.events[MSGCode.OP_HERO_SKIN_SET_S] = this.updateView.bind(this)
    },
    updateView(){
        cc.log(this.openData)
        var heroConf = Gm.config.getHero(0,this.openData.qualityId)
        var heros = Gm.heroData.getHerosByBaseId(heroConf.idGroup)
        this.skinConf = HeroFunc.tjSkinConf(heros,heroConf.idGroup)
        var isUnlockHero =Gm.heroData.queryUnlockHeroByBaseId(heroConf.idGroup) != 0
        this.cvBtn.node.active = false
        this.arrowBtn.active = false
        var quality = heroConf.quality
        if (heros.length > 0 || isUnlockHero){
            this.arrowBtn.active = true
            this.cvBtn.node.active = true
        }


        this.vocs = this.skinConf.voc021022023.split("|")
        this.playVocIndex = 0

        this.nameLab.string = heroConf.name
        this.cvLab.string = this.skinConf.cv

        Gm.load.loadSpriteFrame("img/equipLogo/ssr_quality_"+HeroFunc.ssrQuality(heroConf.quality),function(sp,icon){
            icon.spriteFrame = sp
        },this.ssrSpr)
        var teamConf = Gm.config.getTeamType(heroConf.camp)
        Gm.load.loadSpriteFrame("img/jobicon/" +teamConf.currencyIcon,function(sp,icon){
            icon.spriteFrame = sp
        },this.campSpr)
        Gm.load.loadSpriteFrame("img/bg/"+this.skinConf.background,function(sp,icon){
            icon.spriteFrame = sp
        },this.heroBackSpr)

        var isUnlock = heros.length > 0 || isUnlockHero

        this.personSpine.node.color = isUnlock?cc.color(255,255,255):cc.color(100,100,100)
        Gm.load.loadSkeleton(this.skinConf.rolePic,(sp,owner)=>{
            owner.skeletonData = sp
            owner.setAnimation(0, "ziran", true)
            this.scheduleOnce(()=>{
                owner.paused = !isUnlock
            },1/60)
        },this.personSpine)

        this.dwarfNode.active = false
        if (heros.length > 0 || isUnlockHero){
            this.dwarfNode.active = true
            Gm.load.loadFight(this.skinConf.dwarf,function(sp,owner){
                owner.skeletonData = sp
                owner.setAnimation(0, "idle", true)
            },this.dwarfSpine)
        }
        
        var jobConf = Gm.config.getJobType(heroConf.job)
        Gm.load.loadSpriteFrame("img/jobicon/"+jobConf.currencyIcon,function(sp,icon){
            icon.spriteFrame = sp
        },this.jobSpr)

        var attrList = ['hp','dodge','armor','hit','dmg','speed']

        if(this.openData.item){
            this.updateAttribute(this.openData.item)
        }else{
            var lvConf = Gm.config.getHeroByLv(MAX_LV)
            for (let index = 0; index < this.attributeNodes.length; index++) {
                const item = this.attributeNodes[index];
                var key = attrList[index]
                var keyConf = Gm.config.attrKeyToId(key)

                // var ratioConf = Gm.config.getHeroAttrQualityRatioConfig(keyConf.childType)
                item.getChildByName("base").getComponent(cc.Label).string = keyConf.childTypeName
                item.getChildByName("before").getComponent(cc.Label).string = heroConf[key]
                
                var factorConf = Func.forBy(heroConf.level_attribute_factor,"id",keyConf.childType)

                this.dealSABC(item,factorConf)

                var value = lvConf[key]
                if (factorConf){
                    value = Math.floor(value*heroConf.hero_quality_ratio*Gm.config.getHeroAttrQualityRatioConfig(factorConf.type).ratio/100000000)
                }
                item.getChildByName("before").getComponent(cc.Label).string = heroConf[key] + value
            }
        }
    },
    dealSABC:function(node,data){
        node.getChildByName("name").active = false
        node.getChildByName("plus").active = false
    },
    onCvBtn(){
        if (this.playVocIndex == this.vocs.length){
            this.playVocIndex = 0
        }
        this.cvBtn.interactable = false
        Gm.audio.playDub(this.vocs[this.playVocIndex],()=>{
            if (this.cvBtn && this.cvBtn.node && this.cvBtn.node.isValid){
                this.cvBtn.interactable = true
            }
        })
        this.playVocIndex = this.playVocIndex + 1
    },
    onSkinBtn(){
        var heroData = Gm.heroData.getHeroByBaseId(Gm.config.getHero(0,this.openData.qualityId).idGroup)

        //拿到玩家获得的最高品阶的英雄
        var heroConf = Gm.config.getHero(0,this.openData.qualityId)
        var heros = Gm.heroData.getHerosByBaseId(heroConf.idGroup)
        heros.sort((a,b)=>{
            return b.qualityId - a.qualityId
        })
        //
        
        heroData = Gm.heroData.getHeroByBaseId(Gm.config.getHero(0,this.openData.qualityId).idGroup)
        var unlockHeroId = Gm.heroData.queryUnlockHeroByBaseId(parseInt(this.openData.qualityId/1000))
        Gm.ui.create("HeroSkinView",heros[0] && heros[0].qualityId || heroData && heroData.qualityId || unlockHeroId || this.openData.qualityId)
    },
    onPathBtn(){
        Gm.ui.create("HeroAccessView",{itemType:ConstPb.itemType.HERO_CARD,baseId:Gm.config.getHero(0,this.openData.qualityId).idGroup})
    },
    onHideAllClick:function(){
        var isShow = this.hideNode.active
        this.hideNode.active = !this.hideNode.active
        this.infoNode.stopAllActions()

        var acs = null
        if (isShow){
            acs = cc.fadeIn(touch_update)
        }else{
            acs = cc.fadeOut(touch_update)
        }
        this.infoNode.runAction(acs)
    },
    onSkillClick(){
        Gm.ui.create("HeroTjSkillView",Gm.config.getHero(0,this.openData.qualityId))
    },
    setPathBtnVisible(visible){
        this.pathBtn.node.active = visible
    },
    updateAttribute(data){
        for (let index = 0; index < this.attributeNodes.length; index++) {
            const item = this.attributeNodes[index];
            var attrList = ['hp','dodge','armor','hit','dmg','speed']
            var key = attrList[index]
            var keyConf = Gm.config.attrKeyToId(key)
            var value = Func.forBy(data.heroInfo.attribute,"attrId",keyConf.childType)
            item.getChildByName("base").getComponent(cc.Label).string = keyConf.childTypeName
            if(value != null && value.attrValue % 1 === 0){
                item.getChildByName("before").getComponent(cc.Label).string = value.attrValue
            }else{
                item.getChildByName("before").getComponent(cc.Label).string = 0
            }
        }
    },
});

