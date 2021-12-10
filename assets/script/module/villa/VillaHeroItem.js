// var Type = cc.Enum({
//     DEFAULT: 0,
//     CAN_UNLOCK:1
// });
cc.Class({
    extends: cc.Component,

    properties: {
        bgBottom:cc.Sprite,
        bgSpr:cc.Sprite,
        roleSpr:cc.Sprite,
        roleSpr1:cc.Sprite,
        ssrSpr:cc.Sprite,
        
        lvBg:cc.Node,
        lvLab:cc.Label,
        zzNode:cc.Node,
        lockNode:cc.Node,
        canUnlockNode:cc.Node,
        unlockNode:cc.Node,
        upUnlockNode:cc.Node,
        starNode:cc.Node,
    },
    setData:function(data,owner){
        this.data = data
        this.owner = owner
        this.updateView()
    },
    updateView(){
        this.vHeroData = Gm.villaData.getVillaHeroData(this.data.id)

        var showQualityId = 0
        if (this.vHeroData){
            this.state = this.vHeroData.state
            showQualityId = this.vHeroData.showQualityId
        }else{
            this.state = 0
            showQualityId = this.data.qualityProcess[0]
        }

        this.heroConf = Gm.config.getHero(0,showQualityId)                                  
        this.updateSkin()

        HeroFunc.heroStar(this.starNode,this.heroConf.quality)

        Gm.load.loadSpriteFrame("img/equipLogo/ssr_quality_"+HeroFunc.ssrQuality(this.heroConf.quality),function(sp,icon){
            icon.spriteFrame = sp
        },this.ssrSpr)

        Gm.load.loadSpriteFrame("img/chouka/nvshen_di_"+this.heroConf.bottom_floor,function(sp,icon){
            icon.spriteFrame = sp
        },this.bgBottom)
        Gm.load.loadSpriteFrame("img/chouka/nvshen_kuang_"+this.heroConf.bottom_floor,function(sp,icon){
            icon.spriteFrame = sp
        },this.bgSpr)

        this.zzNode.active = true
        this.canUnlockNode.active = false
        this.unlockNode.active = false
        this.upUnlockNode.active = false
        this.lvBg.active = false
        this.bgBottom.node.active = this.state != VillaFunc.HeroType.default
        this.updateLv()
        if (this.state == VillaFunc.HeroType.default){//未激活
            this.lockNode.active = true
            this.ssrSpr.node.active = false
            this.starNode.active = false
        }else if (this.state == VillaFunc.HeroType.unlock){//首次激活
            // this.initUnlockAnimation()
            // this.playUnCanUnlockHeroAnimation()
            this.canUnlockNode.active = true
            this.unlockNode.active = true
            this.starNode.active = false
            this.ssrSpr.node.active = false
        }else if (this.state == VillaFunc.HeroType.up){//升级激活
            // this.initUnlockAnimation()
            this.canUnlockNode.active = true
            this.upUnlockNode.active = true
            this.lvBg.active = true
            this.ssrSpr.node.active = true
        }else {
            this.zzNode.active = false
            this.lvBg.active = true
            this.ssrSpr.node.active = true
        }
    },
    updateLv(){
        if (this.vHeroData){
            this.lvLab.string = Ls.lv() + this.vHeroData.lv
        }else{
            this.lvLab.string = ""
        }
    },
    updateSkin(){
        var heros = Gm.heroData.getHerosByBaseId(this.heroConf.idGroup)
        var skinConf = HeroFunc.tjSkinConf(heros,this.heroConf.idGroup)
        if (skinConf.role == this.lastRoleStr){
            return
        }
        this.lastRoleStr = skinConf.role
        var self = this
        Gm.load.loadSpriteFrame("personal/banshnew/" +skinConf.role,function(sp,icon){
            icon.spriteFrame = sp
            self.roleSpr1.spriteFrame = sp
        },this.roleSpr)
    },
    onItemClick(){
        cc.log(this.vHeroData,this.data)

        if (this.state == VillaFunc.HeroType.default){
            Gm.floating(5465)
            return
        }else if (this.state == VillaFunc.HeroType.up || this.state == VillaFunc.HeroType.unlock){
            Gm.villaNet.active(this.vHeroData.qualityId)
        }else if (this.state == VillaFunc.HeroType.active){
            this.owner.onItemClick(this.vHeroData.qualityId)
        }
    },
    onHeartClick(){
        if (this.vHeroData){
            Gm.ui.create("FeelAddtionView",{baseId:this.data.id})
        }
    },
    playMaxQualityIdAnimation(){
        if(!this.m_maxQualityAni){
            this.m_maxQualityAni = this.getComponent(cc.Animation)
        }
        var clips = this.m_maxQualityAni.getClips()
        this.m_maxQualityAni.play(clips[0]._name)
    },
    initUnlockAnimation(){
        this.m_unlockAni = this.unlockNode.getComponent(cc.Animation) 
        this.m_UnlockClips = this.m_unlockAni.getClips()
    },
    playUnCanUnlockHeroAnimation(){
       this.m_unlockAni.play(this.m_UnlockClips[0]._name)
    },
    playUnUnlockHeroAnimation(){
        this.unlockNode.active = true
        this.m_unlockAni.play(this.m_UnlockClips[1]._name)
    },
    playUnlockAnim(){
        if (this.state == VillaFunc.HeroType.unlock){
            this.playMaxQualityIdAnimation()
            // this.playUnUnlockHeroAnimation()
        }else if (this.state == VillaFunc.HeroType.up){
            this.playMaxQualityIdAnimation()
            // this.updateView()
        }

        this.onUnlockKaiDone()
        // this.updateView()
    },
    onUnlockKaiDone(){
        console.log("unlock kai done")
        this.ssrSpr.node.active = true
        this.lvBg.active = true
        this.updateView()
    }
});

