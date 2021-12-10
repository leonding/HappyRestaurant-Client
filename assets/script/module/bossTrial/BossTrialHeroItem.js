// BossTrialHeroItem
cc.Class({
    extends: cc.Component,

    properties: {
        itemNode:cc.Node,
        grayNode:cc.Node,
        unlockLab:cc.Label,
    },
    setData:function(baseId,conf,owner){
        this.baseId = baseId
        this.conf = conf
        this.owner = owner

        var itemBase = Gm.ui.getNewItem(this.itemNode)
        itemBase.setMaxHeight()
        itemBase.setTips(false)
        
        this.hero = null
        if (Gm.userInfo.maxMapId < conf.condition){//未解锁
            this.grayNode.active = true
            this.unlockLab.string = conf.mapName
        }else{
            this.hero = Gm.bossTrialData.getHeroByBaseId(baseId)
        }
        if (this.hero == null){
            this.hero = this.getHero()
        }
        itemBase.updateHero(this.hero)
    },
    getHero(){
        var heroConf = Gm.config.getHero(this.baseId)
        var qualityId = heroConf.qualityProcess[0]
        for (var i = 0; i < heroConf.qualityProcess.length; i++) {
            var id = heroConf.qualityProcess[i]
            if (id%100 <= HeroFunc.HERO_STAR_NUM && id%100 <= this.owner.maxQuality){
                qualityId = id
            }
        }
        return {baseId:this.baseId,qualityId:qualityId,isHelpHero:true}
    },
    onClick(){
        if (Gm.userInfo.maxMapId < this.conf.condition){
            cc.log("未解锁")
            return
        }
        Gm.ui.create("TeamListView",{isOther:true,heroData:this.hero})
    },
});

