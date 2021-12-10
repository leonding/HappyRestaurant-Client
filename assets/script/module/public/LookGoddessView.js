var BaseView = require("PageView")
cc.Class({
    extends: BaseView,

    properties: {
        m_oPerson:sp.Skeleton,
        m_oLvName:cc.Label,
        heroBackSpr:cc.Sprite,
        m_changBtnLab:cc.Label,
    },
    register:function(){
        this.events[Events.USER_LIHUI_UPDATE]           = this.onUserUpdate.bind(this)
    },

    onUserUpdate:function(args){
        this.m_SenderHeroHomeId = (args && args.homeHero) || Gm.userInfo.homeHero || Gm.userInfo.head
        if (this.node.active){
            var heroData = Gm.config.getQulityHero(this.m_SenderHeroHomeId)
            var skinId
            if (heroData){
                skinId = heroData.skin_id
            }
            var skinConf = Gm.config.getSkin(skinId)

            Gm.load.loadSpriteFrame("img/bg/"+skinConf.background,function(sp,icon){
                icon.spriteFrame = sp
            },this.heroBackSpr)
            
            Gm.load.loadSkeleton(skinConf.rolePic,function(sp,owner){
                owner.skeletonData = sp
                owner.setAnimation(0, "ziran", true)
            },this.m_oPerson)
            this.m_oLvName.string = skinConf.name
            if(args && args.result == 0){
                Gm.floating(1562)
            }
        }
    },

    //穿戴
    onWearClick(){
        var heroConf = Gm.config.getHero(0,Gm.userInfo.homeHero || Gm.userInfo.head)   
        var heros = Gm.heroData.getHerosByBaseId(heroConf.idGroup)
        heros.sort((a,b)=> {return a.qualityId - b.qualityId})
        Gm.ui.create("HeroSkinView",heros[heros.length - 1].qualityId)
    },

    //变更
    onChangeClick(){
        Gm.ui.create("LookGoddessSelectView",true)
    },

    playVoc:function(isHello){
        if (Gm.guideData.m_iGuideStep > 2 && !this.m_bVocPlaying){
            this.m_iVocNum = 0
            this.m_bVocPlaying = true
            if (isHello){
                Gm.audio.playDub(this.helloVoc,()=>{
                    this.m_bVocPlaying = false
                })
            }else{
                if (this.playVocIndex == undefined || this.playVocIndex == this.vocs.length){
                    this.playVocIndex = 0
                }
                if (this.vocs){
                    Gm.audio.playDub(this.vocs[this.playVocIndex],()=>{
                        this.m_bVocPlaying = false
                    })
                }
                this.playVocIndex++
            }
        }
    },

    onDrawClick:function(){
        // const emoji = ["beishang","haixiu","jingya","kaixin","shengqi","ziran"]
        // var tmpIdx = Func.random(0,emoji.length)
        // this.m_oPerson.addAnimation(0, emoji[tmpIdx], true)
        // this.playVoc()
    },

    enableUpdateView:function(args){
        this.onUserUpdate()
    },

    onBack(){
        this._super()
    },

});

