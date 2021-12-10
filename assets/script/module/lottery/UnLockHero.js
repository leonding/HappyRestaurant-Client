var BaseView = require("BaseView")
// UnLockHero
cc.Class({
    extends: BaseView,
    properties: {
        showBack:cc.Node,
        // hecheng_up:sp.Skeleton,
        m_oPerson:sp.Skeleton,
        // hecheng_down:sp.Skeleton,

        m_oSSRQuality:cc.Sprite,
        m_oPlayerName:cc.Label,
        m_oVoiceName:cc.Label,
        m_oLines:cc.Label,

        m_oTeamSprite:cc.Sprite,
        m_oTeamLab:cc.Label,
        m_usedLays:{
            default: [],
            type: cc.Label,
        },
        m_campLayout:cc.Layout,
        m_oSkillIcons:{
            default: [],
            type: cc.Sprite
        },
        m_oSkillNames: {
            default: [],
            type: cc.Label
        },
        m_oSkillInfos: {
            default: [],
            type: cc.RichText
        },
        m_oExcWeaponNode:cc.Node,
        m_oExcWeaponItem:cc.Prefab,
    },
    onEnable(){
        Gm.send(Events.GUIDE_PAUSE)
        this._super()
    },
    onDestroy(){
        Gm.send(Events.GUIDE_RESUME)
        this._super()
    },
    onLoad:function(){
        this._super()

        // this.hecheng_down.setEventListener((trackEntry, event) => {
        //     if (event.data.name == "start"){
        //         this.m_oPerson.node.runAction(cc.fadeIn(0.02))
        //     }
        // })
    },
    enableUpdateView(args){
        if (args){
            if (args.baseId || args.qualityId){
                // Gm.config.getHero(args.baseId)
                var heroCfg = null
                this.heroId = args.heroId
                if(args.baseId){
                    heroCfg = Gm.config.getHero(args.baseId)
                }else if(args.qualityId){
                    heroCfg = Gm.config.getHero(parseInt(args.qualityId/1000),args.qualityId)
                }
                var tmpConfig = Gm.config.getSkin(heroCfg.skin_id)
                if(tmpConfig.type == 1 && args.qualityId) {
                    var cfg = Gm.config.getQulityHero(args.qualityId)
                    heroCfg.name = cfg.name
                }
                Gm.load.loadSkeleton(tmpConfig.rolePic,function(sp,self){
                    if (self && self.node && self.m_oPerson.node){
                        self.m_oPerson.skeletonData = sp
                        self.m_oPerson.setAnimation(0, "ziran", true)

                        Gm.audio.playEffect("music/gacha/42_gacha_cha_get")
                        // self.m_oPerson.node.opacity = 0

                        // self.hecheng_up.setAnimation(0, "hecheng_up", false)
                        // self.hecheng_down.setAnimation(0, "hecheng_down", false)
                        // self.hecheng_down.addAnimation(0, "hecheng_loop", true)
                        Gm.audio.playDub(args.isFly?tmpConfig.voc020:tmpConfig.voc019)
                    }
                },this)
                var res = Gm.config.getTeamType(heroCfg.camp)
                Gm.load.loadSpriteFrame("img/jobicon/" +res.currencyIcon,function(sp,icon){
                    icon.spriteFrame = sp
                },this.m_oTeamSprite)
                this.m_oTeamLab.string = res.childTypeName
                for(const i in this.m_usedLays){
                    var value = heroCfg.location[i]
                    if (value){
                        var res = Gm.config.getTypeConfigById(value)
                        if (res && res.childTypeName.length > 0){
                            this.m_usedLays[i].string = res.childTypeName
                        }else{
                            this.m_usedLays[i].string = ""
                        }
                    }else{
                        this.m_usedLays[i].string = ""
                    }
                }
                this.m_campLayout._layoutDirty = true
                this.m_campLayout.updateLayout()

                
                this.updateSkill(Gm.config.getSkill(heroCfg.attack_skill),0)
                this.updateSkill(Gm.config.getSkill(heroCfg.passive_skill),1)
                if(args.skinConf){
                    if(args.skinConf.type == 1 ){
                        this.loadSkinIcon(args.skinConf.skinIcon) 
                    }
                }else{
                    this.loadSSRQuality(heroCfg.quality)
                }
                this.initPlayerName(heroCfg.name)
                this.initVoiceActorName("CV : "+tmpConfig.cv)
                this.initLines(args.isFly?tmpConfig.advanced:tmpConfig.lines)

                this.addExcWeapon(heroCfg)
            }

           
        }
    },
    loadSSRQuality(quality){
        Gm.load.loadSpriteFrame("img/equipLogo/ssr_quality_"+HeroFunc.ssrQuality(quality), function(sf, sp){
            sp.spriteFrame = sf
        },this.m_oSSRQuality)
    },

    loadSkinIcon(skinIcon){
        Gm.load.loadSpriteFrame("img/camp/"+skinIcon, function(sf, sp){
            sp.spriteFrame = sf
        },this.m_oSSRQuality)
    },

    initPlayerName(name){
        this.m_oPlayerName.string = name
    },
    initVoiceActorName(name){
        this.m_oVoiceName.string = name
    },
    initLines(content){
        this.m_oLines.string = content
    },
    loadSkin(){

    },
    updateSkill (data, nodeidx) {
        Gm.load.loadSpriteFrame("personal/skillicon/"+data.picture,function(sf,sp){
            sp.spriteFrame = sf
        },this.m_oSkillIcons[nodeidx])
        this.m_oSkillNames[nodeidx].string = data.name
        this.m_oSkillInfos[nodeidx].string = data.detailed
    },
    onBack(){
        // Gm.audio.playEffect("music/20433 metal particle magic spell-full")
        Gm.audio.stopDub();
        Gm.activityData.showLimitGift()
        this._super()

        Gm.send(Events.UNLOCKHERO_CLOSE)
    },
    addExcWeapon(heroConfig){
       var q = heroConfig.quality
        if(q>11 && heroConfig.weaponId){
            this.m_oExcWeaponNode.active = true
            var item = cc.instantiate(this.m_oExcWeaponItem)
            this.m_oExcWeaponNode.addChild(item)
            item.getComponent("ExcWeaponItem").setUI(ExcWeaponFunc.getExcWeaponIconInfo(heroConfig.id,Gm.heroData.getWeaponLevel(this.heroId)))
        }
        else{
            this.m_oExcWeaponNode.active = false
        }
    },
    onExcWeaponClick(){
        //  var args = {hero:Gm.heroData.getHeroById(this.heroId),backView:"UnLockHero"}
        //  Gm.ui.create("ExcWeaponMainView",args)
        //  Gm.ui.removeByName("UnLockHero")
    },
});

