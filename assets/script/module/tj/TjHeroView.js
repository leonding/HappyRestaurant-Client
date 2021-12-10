var BaseView = require("BaseView")

cc.Class({
    extends: BaseView,

    properties: {
        itemPerfab: cc.Prefab,
        tjHeroItem:cc.Prefab,
        jbItem:cc.Node,
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        m_oPerson:sp.Skeleton,
        m_oHeroBack:cc.Sprite,
        nameLab:cc.Label,
        qIcon:cc.Sprite,
        jobLab:cc.Label,
        jobDescLab:cc.Label,
        descLab:cc.Label,
        m_oGetStr:cc.Label,
        getBtn:cc.Button,
        m_oFlyBase:cc.Node,
        m_oFlyJian:cc.Node,
        m_oFlyScroll:cc.ScrollView,
    },
    onLoad () {
        this._super()
    },
    onEnable(){
        this._super()
    },
    enableUpdateView:function(args){
        if (args){
            this.baseId = args
            this.updateView()
            var tmpQuality = -1
            var tmpNow = Gm.heroData.getHeroByBaseId(this.baseId)
            if (tmpNow){
                tmpQuality = tmpNow.qualityId
            }
            var tmpHero = Gm.config.getHero(this.baseId)
            Func.destroyChildren(this.m_oFlyScroll.content)
            for(const i in tmpHero.qualityProcess){
                const tmpConfig = Gm.config.getQulityHero(tmpHero.qualityProcess[i])
                var tmpItem = cc.instantiate(this.m_oFlyBase)
                tmpItem.active = true
                Func.newHead2(this.baseId,tmpItem.getChildByName("ItemBase"),tmpHero.qualityProcess[i])
                Gm.load.loadSpriteFrame("texture/ssr/ssr_hero_"+tmpConfig.quality,function(sp,icon){
                    icon.spriteFrame = sp
                },tmpItem.getChildByName("ssr_hero_1").getComponent(cc.Sprite))
                var idx = checkint(i)
                var tmpNameLab = tmpItem.getChildByName("m_oNameLab")
                if (idx == 0){
                    tmpNameLab.getComponent(cc.Label).string = tmpConfig.name
                }else{
                    if(tmpHero.qualityProcess[i] > tmpQuality){
                        tmpNameLab.color = cc.color(200,5,5)
                        tmpNameLab.getComponent(cc.Label).string = Ls.get(40002)
                    }else{
                        tmpNameLab.color = cc.color(200,200,5)
                        tmpNameLab.getComponent(cc.Label).string = Ls.get(40001)
                    }
                }
                this.m_oFlyScroll.content.addChild(tmpItem)
                if (idx != tmpHero.qualityProcess.length - 1){
                    var tmpJian = cc.instantiate(this.m_oFlyJian)
                    tmpJian.active = true
                    this.m_oFlyScroll.content.addChild(tmpJian)
                }
            }
        }
    },
    getHero:function(baseId){
        var heroNode = cc.instantiate(this.tjHeroItem)
        var itemSp = heroNode.getComponent("TjHeroItem")
        console.log("baseId===:",baseId)
        itemSp.setData(baseId,this,this.itemPerfab)
        return heroNode
    },
    register:function(){
        this.events[MSGCode.OP_HERO_RESERVATION_S] = this.onNetHeroReser.bind(this)
        this.events[MSGCode.OP_HERO_RESERVATION_INFO_S] = this.onNetHeroReser.bind(this)
    },
    onNetHeroReser(){
        this.getBtn.node.active = true
        var bo = Gm.heroData.getReserv(this.baseId)
        this.getBtn.interactable = !bo
        this.m_oGetStr.string = bo?Ls.get(400033):Ls.get(400032)
    },
    updateView:function(){
        var conf = Gm.config.getHero(this.baseId)
        this.nameLab.string = conf.name
        this.qIcon.node.x = this.nameLab.node.x + conf.name.length*30+40
        Gm.load.loadSpriteFrame("texture/ssr/ssr_hero_"+HeroFunc.ssrQuality(conf.quality),function(sp,icon){
            icon.spriteFrame = sp
        },this.qIcon)
        this.jobLab.string = conf.location
        this.m_oGetStr.string = conf.buttonText
        this.jobDescLab.string = "不知道显示啥"
        this.descLab.string = conf.info
        this.getBtn.node.active = false
        if (conf.use == 1){
            this.getBtn.node.active = true
        }else if(conf.use == 2){
            if (Gm.heroData.getReserv(this.baseId) == null){
                Gm.heroNet.reserInfo(this.baseId)
            }else{
                this.onNetHeroReser()
            }
        }
        cc.loader.loadRes("img/bg/"+conf.background,cc.SpriteFrame,function(err,spf){
            this.m_oHeroBack.spriteFrame = spf
        }.bind(this))
        Gm.load.loadSkeleton(conf.rolePic,function(sp,owner){
            // console.log("fashi===:",self.m_oPerson)
            owner.skeletonData = sp
            if (Gm.heroData.getHeroByBaseId(self.baseId)){
                owner.node.color = new cc.Color(255,255,255)
                owner.setAnimation(0, "ziran", true)
            }else{
                owner.node.color = new cc.Color(100,100,100)
            }
        },this.m_oPerson)

        var list = Gm.config.getJbsByHeroId(this.baseId)
        Func.destroyChildren(this.scrollView.content)
        
        for (let index = 0; index < list.length; index++) {
            const v = list[index];
            var jbNode = cc.instantiate(this.jbItem)
            jbNode.active = true
            this.scrollView.content.addChild(jbNode)
            var listNode = jbNode.getChildByName("listNode")
            var heroNum = 0 
            for (let i = 0; i < v.sparkCondition.length; i++) {
                const v1 = v.sparkCondition[i];
                var hero = this.getHero(v1)
                listNode.addChild(hero)
                if (Gm.heroData.getHeroByBaseId(v1)){
                    heroNum = heroNum + 1
                }
            }
            var nameLab = jbNode.getChildByName("nameLab").getComponent(cc.Label)
            var addLab = jbNode.getChildByName("addLab").getComponent(cc.Label)
            nameLab.string = v.relateName// + cc.js.formatStr("(%s/%s)",heroNum,v.heroNmu)

            var str = ""
            for (let i = 0; i < v.relateProperty.length; i++) {
                const v1 = v.relateProperty[i];
                if (str != ""){
                    str = str + "  "
                }
                
                str = str + Func.baseStr(v1.id,v1.vaule,true)
            }
            addLab.string = Ls.get(400005) + str
        }
        this.scrollView.content.height = 175*list.length
    },
    onSkillBtn:function(){
        Gm.ui.create("TjHeroSkillView",this.baseId)
    },
    onGetBtn:function(){
        var conf = Gm.config.getHero(this.baseId)
        if (conf.use == 1){
            Gm.ui.jump(conf.viewId)
            this.onBack()
        }else if (conf.use == 2) {
            Gm.heroNet.reser(this.baseId)
        }
    },
});

