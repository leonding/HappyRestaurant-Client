var BaseView = require("BaseView")

// CharacterQualityUp
cc.Class({
    extends: BaseView,
    properties: {
        m_oQualityOld:cc.Sprite,
        m_oQualitySpr:cc.Sprite,
        m_oQualityShadow:cc.Sprite,
        m_oLevelOld:cc.Label,
        m_oLevelLab:cc.Label,

        m_oListNode:{
            default: [],
            type: cc.Node,
        },
    },
    enableUpdateView(args){
        if (args){
            var heroData = Gm.heroData.getHeroById(args.heroId)
            var tmpHero = Gm.config.getHero(heroData.baseId,heroData.qualityId)
            var tmpOld = ""
            for(const i in tmpHero.qualityProcess){
                if (tmpHero.qualityProcess[i] == heroData.qualityId){
                    break
                }
                tmpOld = tmpHero.qualityProcess[i]
            }
            var tmpHeroOld = Gm.config.getHero(heroData.baseId,tmpOld)
            this.m_oLevelOld.string = Ls.lv()+tmpHeroOld.max_level
            Gm.load.loadSpriteFrame("img/equipLogo/ssr_quality_"+HeroFunc.ssrQuality(tmpHeroOld.quality),function(sp,icon){
                if (icon && icon.node){
                    icon.spriteFrame = sp
                }
            },this.m_oQualityOld)

            Gm.load.loadSpriteFrame("img/equipLogo/ssr_quality_"+HeroFunc.ssrQuality(tmpHero.quality),function(sp,icon){
                if (icon && icon.node){
                    icon.m_oQualitySpr.spriteFrame = sp
                    icon.m_oQualityShadow.spriteFrame = sp
                }
            },this)
            this.m_oLevelLab.string = Ls.lv()+tmpHero.max_level

            for(const i in args.list){
                this.m_oListNode[i].active = true
                var tmpName0 = Gm.config.getBaseAttr(args.list[i].id)
                var nameLb = this.m_oListNode[i].getChildByName("name")
                nameLb.getComponent(cc.Label).string = tmpName0.childTypeName
                var oldNod = this.m_oListNode[i].getChildByName("old")
                oldNod.getComponent(cc.Label).string = args.list[i].oldValue
                var newNod = this.m_oListNode[i].getChildByName("new")
                newNod.getComponent(cc.Label).string = args.list[i].newValue
            }
            Gm.audio.playEffect("music/15_rare_up")
        }
    },
});

