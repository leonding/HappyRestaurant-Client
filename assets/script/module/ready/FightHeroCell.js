// FightHeroCell
cc.Class({
    extends: cc.Component,

    properties: {
        m_oSkPerson:sp.Skeleton,
        m_oLvNmLab:cc.Label,
        m_oLvJobSpr:cc.Sprite,
        m_oTopNode:cc.Node,
        m_oHireNode:cc.Node,
        m_oHireName:cc.Label,
        m_oLightNode:cc.Node,
    },
    onLoad () {
        this.m_oAnimate = this.node.getComponent(cc.Animation)
    },
    callYoke:function(){
        this.m_oAnimate.play()
    },
    setOwner:function(destOwner,destIdx,isEnemy) {
        this.m_oOwner = destOwner
        this.m_iIndex = destIdx
        this.m_bIsEnmey = isEnemy
    },
    setData:function(data,playSound,waitSec){
        this.node.x = 0
        this.node.y = 0
        this.m_oLightNode.active = false
        this.m_oSkPerson.spName = null
        this.m_oSkPerson.node.active = false
        this.tmpShadowSpr = this.node.parent.getChildByName("shadow")
        this.m_oConf = null
        if (data){
            this.m_oTopNode.active = true
            this.m_oData = data
            this.m_oLvJobSpr.spriteFrame = null
            var tmpDwarf = null
            var tmpName = null
            var tmpJob = null
            var tmpShadow = null
            var tmpLevel = data.level || 1
            var color = cc.color(248,242,225)
            var heroColor = null
            var scale = 1
            if (this.m_oData.monsterType){
                tmpLevel = HeroFunc.monsterFormatLv(tmpLevel)
                this.m_oConf = Gm.config.getHero(0,this.m_oData.heroQualityID)
                var skinConf =Gm.config.getSkin(this.m_oConf.skin_id)
                tmpDwarf = skinConf.dwarf
                tmpName = this.m_oConf.name
                tmpJob = this.m_oConf.camp
                tmpShadow = this.m_oConf.battle_frame
                if (skinConf.enlarge > 0){
                    scale = skinConf.enlarge
                }
                if (skinConf.rgb.length > 0){
                    var split = skinConf.rgb.split("_")
                    heroColor = cc.color(checkint(split[0]),checkint(split[1]),checkint(split[2]))
                }
                this.m_oSkPerson.node.scaleX = -scale
                this.m_oSkPerson.node.scaleY = scale
            }else{
                if (this.m_bIsEnmey){
                    this.m_oSkPerson.node.scaleX = -scale
                    this.m_oSkPerson.node.scaleY = scale
                }else{
                    this.m_oSkPerson.node.scaleX = scale
                    this.m_oSkPerson.node.scaleY = scale
                }

                this.m_oConf = Gm.config.getHero(this.m_oData.baseId,this.m_oData.qualityId)
                if (this.m_oData.heroId && Gm.heroData.isInPool(this.m_oData.heroId)){
                    tmpLevel = Func.configHeroLv(this.m_oData,this.m_oConf)
                    color = cc.color(101,255,60)
                }
                
                var tmpBaseId = this.m_oData.baseId
                if (tmpBaseId == 0){
                    tmpBaseId = this.m_oConf.idGroup
                }
                var heroData = Gm.heroData.getHeroByBaseId(tmpBaseId)
                var skinConf = Gm.config.getSkin((heroData && heroData.skin) || this.m_oConf.skin_id)
                tmpDwarf = skinConf.dwarf
                tmpName = this.m_oConf.name
                tmpJob = this.m_oData.camp || this.m_oConf.camp
                tmpShadow = this.m_oConf.battle_frame
                if (playSound){
                    Gm.audio.playDub(skinConf.voc002)
                }
            }
            if (heroColor){
                this.m_oSkPerson.node.color = heroColor
            }
            this.m_oSkPerson.bossSclae = scale
            if (waitSec){
                this.scheduleOnce(()=>{
                    this.loadFight(tmpDwarf)
                },0.05*this.m_iIndex)
            }else{
                this.loadFight(tmpDwarf)
            }
            this.m_oLvNmLab.node.color = color
            this.m_oLvNmLab.string = Ls.lv()+tmpLevel
            var res = Gm.config.getTeamType(tmpJob)
            Gm.load.loadSpriteFrame("img/jobicon/"+res.currencyIcon,function(sp,icon){
                if (icon.node){
                    icon.spriteFrame = sp
                }
            },this.m_oLvJobSpr)
            if(this.tmpShadowSpr){
                 Gm.load.loadSpriteFrame("img/fighting/"+tmpShadow,function(sp,icon){
                    if (icon.node){
                        icon.spriteFrame = sp
                    }
                },this.tmpShadowSpr.getComponent(cc.Sprite))
                if(this.tmpShadowSpr.getChildByName("m_oPosLab")){
                    this.tmpShadowSpr.getChildByName("m_oPosLab").active = false    
                }
            }
            if (this.m_oData.isHire){
                this.m_oHireNode.active = true
                this.m_oHireName.string = this.m_oData.ownerName
            }else{
                this.m_oHireNode.active = false
            }
        }else{
            this.m_oHireNode.active = false
            this.m_oTopNode.active = false
            this.m_oData = null
            Gm.load.loadSpriteFrame("img/fighting/bossbattle_ty_kong",function(sp,icon){
                if (icon.node){
                    icon.spriteFrame = sp
                }
            },this.tmpShadowSpr.getComponent(cc.Sprite))
            if(this.tmpShadowSpr.getChildByName("m_oPosLab")){
                this.tmpShadowSpr.getChildByName("m_oPosLab").active = true    
            }
        }
    },
    loadFight:function(dwarf){
        this.m_oSkPerson.spName = dwarf
        Gm.load.loadFight(dwarf,function(sp,sk){
            if (sk && sk.spName == sp.name && sk.node && cc.isValid(sk.node)){
                sk.skeletonData = sp
                sk.node.active = true
                if (sk.bossSclae != 1){
                    sk.setAnimation(0, "idle_boss", true)
                }else{
                    sk.setAnimation(0, "idle", true)
                }
            }
        },this.m_oSkPerson)
    },
    bindingCell:function(value){
        this.m_oLightNode.active = value
    },
    isLocked:function(){
        return false
    },
    onCellClick:function(){
        this.m_oOwner.onHeroListClick(this.m_oData,false)
    },
    hideTopNode(){
        if(this.m_oTopNode){
            this.m_oTopNode.active = false
        }
    },
    hideTmpShadowSpr(){
        if(this.tmpShadowSpr){
            this.tmpShadowSpr.active = false
        }
    }
});

